"use client";

import { useProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Users, BarChart3, Clock, Trophy, Link2, AlertCircle } from "lucide-react";

export default function ParentDashboardPage() {
  const { profile, updateProfile, isUpdating } = useProfile();
  const [studentIdInput, setStudentIdInput] = useState("");
  const [linkError, setLinkError] = useState("");

  const linkedStudentId = profile?.linked_student_id;

  // Fetch linked student data
  const { data: studentData } = useQuery({
    queryKey: ["linked-student", linkedStudentId],
    queryFn: async () => {
      if (!linkedStudentId) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("users")
        .select("id, name, email")
        .eq("id", linkedStudentId)
        .single();
      if (error) throw error;
      return data as { id: string; name: string; email: string } | null;
    },
    enabled: !!linkedStudentId,
  });

  // Fetch student's mock attempts
  const { data: studentAttempts } = useQuery({
    queryKey: ["student-attempts", linkedStudentId],
    queryFn: async () => {
      if (!linkedStudentId) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("mock_attempts")
        .select("*, exams(name, slug)")
        .eq("user_id", linkedStudentId)
        .order("started_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!linkedStudentId,
  });

  const handleLinkStudent = async () => {
    setLinkError("");
    if (!studentIdInput.trim()) {
      setLinkError("Please enter a student ID");
      return;
    }

    // Verify the student exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: student, error } = await (supabase as any)
      .from("users")
      .select("id, name, role")
      .eq("id", studentIdInput.trim())
      .eq("role", "student")
      .single();

    if (error || !student) {
      setLinkError("Student not found. Please check the ID and try again.");
      return;
    }

    updateProfile({ linked_student_id: student.id as string });
    setStudentIdInput("");
  };

  // Not linked yet — show linking UI
  if (!linkedStudentId) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Parent Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Link to your child&apos;s CrysLearn account to monitor their progress.
          </p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-text-light mb-2">
            Link to your child
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Ask your child for their Student ID (found in Settings).
          </p>

          {linkError && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-btn text-danger text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {linkError}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              className="input-field flex-1"
              placeholder="Paste student ID here"
            />
            <button
              onClick={handleLinkStudent}
              disabled={isUpdating}
              className="btn-primary text-sm px-4 flex items-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              {isUpdating ? "Linking..." : "Link"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Linked — show student stats
  const totalAttempts = studentAttempts?.length || 0;
  const completedAttempts =
    studentAttempts?.filter((a: any) => a.completed_at) || [];
  const bestScore = completedAttempts.length > 0
    ? Math.max(...completedAttempts.map((a: any) => a.score))
    : 0;
  const avgScore = completedAttempts.length > 0
    ? Math.round(
        completedAttempts.reduce((sum: number, a: any) => sum + a.score, 0) /
          completedAttempts.length
      )
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Parent Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Monitoring{" "}
          <span className="font-medium text-text-light">
            {studentData?.name || studentData?.email || "your child"}
          </span>
          &apos;s progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-secondary/10 rounded-card flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-light">
              {totalAttempts}
            </p>
            <p className="text-xs text-gray-500">Total Mocks</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-success/10 rounded-card flex items-center justify-center">
            <Trophy className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-light">{bestScore}%</p>
            <p className="text-xs text-gray-500">Best Score</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-warning/10 rounded-card flex items-center justify-center">
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-light">{avgScore}%</p>
            <p className="text-xs text-gray-500">Average Score</p>
          </div>
        </div>
      </div>

      {/* Recent Attempts */}
      <div className="card">
        <h2 className="text-lg font-semibold text-text-light mb-4">
          Recent Mock Exams
        </h2>

        {completedAttempts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No attempts yet. Take your first mock to see your history here.
          </div>
        ) : (
          <div className="space-y-3">
            {completedAttempts.map((attempt: any) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-3 rounded-btn bg-gray-50 border border-gray-100"
              >
                <div>
                  <p className="font-medium text-text-light text-sm">
                    {attempt.exams?.name || "Exam"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(attempt.completed_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div
                  className={`text-lg font-bold ${
                    attempt.score >= 70
                      ? "text-success"
                      : attempt.score >= 50
                      ? "text-warning"
                      : "text-danger"
                  }`}
                >
                  {attempt.score}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
