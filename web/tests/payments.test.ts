import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getApplicationOrigin,
  isExamSlug,
  isPaymentReference,
  isPaystackCheckoutUrl,
  validatePayment,
} from "../src/lib/payments/validation";
import { hasValidPaystackSignature } from "../src/lib/payments/signature";
import { saveExamAccess } from "../src/lib/payments/access";

const userId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const rawPayment = {
  reference: "test_ref-123",
  status: "success",
  amount: 350000,
  currency: "NGN",
  metadata: { exam_slug: "jamb", user_id: userId },
};

test("a successful NGN payment is bound to the authenticated user and reference", () => {
  const payment = validatePayment(rawPayment, { reference: rawPayment.reference, userId });
  assert.equal(payment.examSlug, "jamb");
  assert.equal(payment.userId, userId);
  assert.throws(
    () => validatePayment(rawPayment, { userId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" }),
    /another account/,
  );
  assert.throws(
    () => validatePayment(rawPayment, { reference: "different-reference" }),
    /reference/,
  );
});

test("underpayment, overpayment, wrong currencies, and non-integer amounts never grant an exam", () => {
  for (const amount of [0, 1, 349999, 350001, 350000.1, "350000", NaN])
    assert.throws(() => validatePayment({ ...rawPayment, amount }), /amount or currency/);
  for (const currency of [undefined, "USD", "ngn", ""])
    assert.throws(() => validatePayment({ ...rawPayment, currency }), /amount or currency/);
});

test("pending and failed charges cannot be treated as successful payments", () => {
  for (const status of [undefined, "pending", "failed", "abandoned"])
    assert.throws(() => validatePayment({ ...rawPayment, status }), /not been completed/);
});

test("malformed and prototype-inherited exam names are rejected", () => {
  for (const examSlug of ["toString", "constructor", "__proto__", "invalid", null, []]) {
    assert.equal(isExamSlug(examSlug), false);
    assert.throws(() =>
      validatePayment({ ...rawPayment, metadata: { exam_slug: examSlug, user_id: userId } }),
    );
  }
  for (const metadata of [null, [], "{", {}, { exam_slug: "jamb", user_id: "not-a-uuid" }])
    assert.throws(() => validatePayment({ ...rawPayment, metadata }));
});

test("serialized provider metadata is supported without accepting missing details", () => {
  assert.equal(
    validatePayment({ ...rawPayment, metadata: JSON.stringify(rawPayment.metadata) }).examSlug,
    "jamb",
  );
  assert.throws(() => validatePayment({ ...rawPayment, metadata: "null" }));
});

test("the higher-priced exam requires its own exact amount", () => {
  const metadata = { exam_slug: "post-utme", user_id: userId };
  assert.throws(() => validatePayment({ ...rawPayment, metadata }));
  assert.equal(validatePayment({ ...rawPayment, metadata, amount: 500000 }).amount, 500000);
});

test("payment references cannot escape the verification path", () => {
  for (const reference of [
    ".",
    "..",
    "../refund",
    "abc/def",
    "ref?admin=1",
    "ref#x",
    "",
    "a".repeat(201),
    null,
  ])
    assert.equal(isPaymentReference(reference), false);
  assert.equal(isPaymentReference("paystack.123-abc_456=789"), true);
});

test("callbacks use the configured app URL or visitor's hostname to preserve login cookies", () => {
  assert.equal(
    getApplicationOrigin("https://app.example/pay", {
      NEXT_PUBLIC_APP_URL: "https://learn.example/",
    }),
    "https://learn.example",
  );
  assert.equal(getApplicationOrigin("http://localhost:3000/pay"), "http://localhost:3000");
  assert.equal(
    getApplicationOrigin("https://custom-domain.example/pay"),
    "https://custom-domain.example",
  );
  for (const url of [
    "javascript:alert(1)",
    "http://learn.example",
    "https://user:password@learn.example",
  ])
    assert.throws(() => getApplicationOrigin("https://app.example", { NEXT_PUBLIC_APP_URL: url }));
});

test("checkout redirects only accept the secure Paystack checkout hostname", () => {
  assert.equal(isPaystackCheckoutUrl("https://checkout.paystack.com/code"), true);
  for (const url of [
    "https://checkout.paystack.com.evil.example/code",
    "https://evil.example/code",
    "javascript:alert(1)",
    "http://checkout.paystack.com/code",
    "https://checkout.paystack.com:444/code",
    "https://checkout.paystack.com@evil.example",
    null,
  ])
    assert.equal(isPaystackCheckoutUrl(url), false);
});

test("webhook HMAC validates the exact raw body and safely rejects malformed signatures", () => {
  const body = JSON.stringify({ event: "charge.success", data: rawPayment });
  const secret = "sk_test_not-a-real-credential";
  const signature = createHmac("sha512", secret).update(body).digest("hex");
  assert.equal(hasValidPaystackSignature(body, signature, secret), true);
  assert.equal(hasValidPaystackSignature(`${body} `, signature, secret), false);
  assert.equal(hasValidPaystackSignature(body, signature, "different-secret"), false);
  for (const invalid of [null, "", "ff", "z".repeat(128), "f".repeat(129)])
    assert.equal(hasValidPaystackSignature(body, invalid, secret), false);
});

function databaseFixture(
  options: { price?: number; examError?: boolean; writeError?: boolean } = {},
) {
  const records = new Map<string, Record<string, string>>();
  let writeCount = 0;
  const client = {
    from(table: string) {
      if (table === "exams")
        return {
          select: () => ({
            eq: (_column: string, slug: string) => ({
              single: async () => ({
                data:
                  slug === "jamb"
                    ? {
                        id: "11111111-1111-1111-1111-111111111111",
                        price_kobo: options.price ?? 350000,
                      }
                    : null,
                error: options.examError ? { message: "database unavailable" } : null,
              }),
            }),
          }),
        };
      assert.equal(table, "user_exam_access");
      return {
        upsert: async (
          record: Record<string, string>,
          settings: { onConflict: string; ignoreDuplicates: boolean },
        ) => {
          writeCount += 1;
          assert.equal(settings.onConflict, "user_id,exam_id");
          if (options.writeError) return { error: { message: "database unavailable" } };
          const key = `${record.user_id}/${record.exam_id}`;
          if (!records.has(key) || !settings.ignoreDuplicates) records.set(key, record);
          return { error: null };
        },
      };
    },
  } as unknown as Pick<SupabaseClient, "from">;
  return { client, records, writes: () => writeCount };
}

test("callback and webhook retries leave one access record and preserve the first payment reference", async () => {
  const db = databaseFixture();
  const payment = validatePayment(rawPayment);
  await saveExamAccess(payment, db.client);
  await Promise.all([
    saveExamAccess(payment, db.client),
    saveExamAccess({ ...payment, reference: "a-second-payment" }, db.client),
  ]);
  assert.equal(db.records.size, 1);
  assert.equal([...db.records.values()][0].payment_ref, rawPayment.reference);
  assert.equal([...db.records.values()][0].exam_id, "11111111-1111-1111-1111-111111111111");
});

test("database errors propagate so callbacks cannot claim access and webhooks can retry", async () => {
  const db = databaseFixture({ writeError: true });
  await assert.rejects(
    saveExamAccess(validatePayment(rawPayment), db.client),
    /could not be saved/,
  );
  assert.equal(db.records.size, 0);
});

test("missing exams, query failures, and database price mismatches do not create access", async () => {
  for (const options of [{ price: 500000 }, { examError: true }]) {
    const db = databaseFixture(options);
    await assert.rejects(
      saveExamAccess(validatePayment(rawPayment), db.client),
      /could not be resolved/,
    );
    assert.equal(db.writes(), 0);
  }
  const db = databaseFixture();
  await assert.rejects(
    saveExamAccess(
      validatePayment({ ...rawPayment, metadata: { exam_slug: "waec", user_id: userId } }),
      db.client,
    ),
    /could not be resolved/,
  );
  assert.equal(db.writes(), 0);
});
