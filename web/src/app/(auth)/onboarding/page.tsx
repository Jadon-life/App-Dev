"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { EXAMS, EXAM_SLUGS } from "@shared/constants/exams";
import { GraduationCap, Users, CheckCircle2 } from "lucide-react";
import type { ExamSlug, UserRole } from "@/types/database";

export default function OnboardingPage() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [selectedExams, setSelectedExams] = useState<ExamSlug[]>([]);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const router = useRouter();

  const toggleExam = (slug: ExamSlug) => {
    setSelectedExams((prev) =>
      prev.includes(slug) ? prev.filter((e) => e !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async () => {
    if (!role) {
      setError("Please select your role");
      return;
    }
    if (role === "student" && selectedExams.length === 0) {
      setError("Please select at least one exam");
      return;
    }
    if (role === "parent" && !studentId.trim()) {
      setError("Please enter your child's student ID");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (!user) throw new Error("Not authenticated");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from("users")
        .update({
          role,
          name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "",
          ...(role === "parent" && studentId
            ? { linked_student_id: studentId }
            : {}),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Redirect based on role (per Doc 03)
      if (role === "parent") {
        router.push("/parent");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Let&apos;s set you up
          </h1>
          <p className="mt-2 text-gray-500">
            Tell us about yourself so we can personalise your experience.
          </p>
        </div>

        <div className="card space-y-8">
          {/* Error */}
          {error && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-btn text-danger text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Role Selection */}
          <div>
            <h2 className="text-lg font-semibold text-text-light mb-4">
              I am a...
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setRole("student")}
                className={`p-5 rounded-card border-2 transition-all text-center ${
                  role === "student"
                    ? "border-secondary bg-secondary/5"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <GraduationCap
                  className={`w-8 h-8 mx-auto mb-2 ${
                    role === "student" ? "text-secondary" : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    role === "student" ? "text-secondary" : "text-text-light"
                  }`}
                >
                  Student
                </span>
              </button>

              <button
                onClick={() => setRole("parent")}
                className={`p-5 rounded-card border-2 transition-all text-center ${
                  role === "parent"
                    ? "border-secondary bg-secondary/5"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <Users
                  className={`w-8 h-8 mx-auto mb-2 ${
                    role === "parent" ? "text-secondary" : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    role === "parent" ? "text-secondary" : "text-text-light"
                  }`}
                >
                  Parent
                </span>
              </button>
            </div>
          </div>

          {/* Step 2a: Exam Selection (Student) */}
          {role === "student" && (
            <div>
              <h2 className="text-lg font-semibold text-text-light mb-4">
                Which exam(s) are you preparing for?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {EXAM_SLUGS.map((slug) => {
                  const exam = EXAMS[slug];
                  const selected = selectedExams.includes(slug);
                  return (
                    <button
                      key={slug}
                      onClick={() => toggleExam(slug)}
                      className={`p-4 rounded-card border-2 transition-all text-left relative ${
                        selected
                          ? "border-secondary bg-secondary/5"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      {selected && (
                        <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-secondary" />
                      )}
                      <span className="font-semibold text-text-light block">
                        {exam.name}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {exam.fullName.split("(")[0].trim()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2b: Link Student (Parent) */}
          {role === "parent" && (
            <div>
              <h2 className="text-lg font-semibold text-text-light mb-2">
                Link to your child&apos;s account
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Enter your child&apos;s PrepHQ student ID. You can find it in
                their Settings page.
              </p>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="input-field"
                placeholder="Enter student ID (e.g. abc12345-...)"
              />
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !role}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Continue to Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
