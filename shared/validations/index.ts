import { z } from "zod";

// ─── Auth Schemas ───────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const onboardingSchema = z.object({
  role: z.enum(["student", "parent"]),
  target_exams: z.array(z.enum(["jamb", "waec", "neco", "post-utme"])).min(1, "Select at least one exam"),
  linked_student_id: z.string().uuid().optional(), // For parent accounts
});

// ─── Payment Schemas ────────────────────────────────────────────

export const paymentInitSchema = z.object({
  exam_id: z.string().uuid(),
  email: z.string().email(),
  amount_kobo: z.number().positive(),
});

export const webhookPayloadSchema = z.object({
  event: z.literal("charge.success"),
  data: z.object({
    reference: z.string(),
    status: z.literal("success"),
    amount: z.number(),
    metadata: z.object({
      exam_id: z.string().uuid(),
      user_id: z.string().uuid(),
    }),
  }),
});

// ─── Mock Exam Schemas ──────────────────────────────────────────

export const startMockSchema = z.object({
  exam_id: z.string().uuid(),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
});

export const submitMockSchema = z.object({
  attempt_id: z.string().uuid(),
  answers: z.record(z.string().uuid(), z.enum(["A", "B", "C", "D"])),
});

// ─── Type exports from schemas ──────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type PaymentInitInput = z.infer<typeof paymentInitSchema>;
export type StartMockInput = z.infer<typeof startMockSchema>;
export type SubmitMockInput = z.infer<typeof submitMockSchema>;
