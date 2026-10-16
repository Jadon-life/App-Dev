import assert from "node:assert/strict";
import test from "node:test";
import { authFlowForCapabilities, supportsSecurePkce } from "../src/lib/auth-capabilities";
test("native email auth avoids insecure PKCE fallbacks when WebCrypto is incomplete", () => {
  for (const crypto of [
    undefined,
    null,
    {},
    { getRandomValues() {} },
    { subtle: { digest() {} } },
  ]) {
    const supported = supportsSecurePkce(crypto, TextEncoder);
    assert.equal(supported, false);
    assert.equal(authFlowForCapabilities(supported), "implicit");
  }
});
test("in-app Google requires secure random generation, S256, and text encoding", () => {
  const crypto = { getRandomValues() {}, subtle: { digest() {} } };
  assert.equal(supportsSecurePkce(crypto, undefined), false);
  assert.equal(supportsSecurePkce(crypto, TextEncoder), true);
  assert.equal(authFlowForCapabilities(true), "pkce");
});
