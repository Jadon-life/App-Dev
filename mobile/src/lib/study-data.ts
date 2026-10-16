import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { progressLearnerId } from "./profile-access";
import { useAuth } from "../providers/AuthProvider";
export interface Profile {
  id: string;
  name: string;
  email: string;
  role: "student" | "parent";
  linked_student_id: string | null;
}
export interface Exam {
  id: string;
  slug: string;
  name: string;
  price_kobo: number;
}
export interface Attempt {
  id: string;
  exam_id: string;
  score: number;
  completed_at: string;
}
export function useProfile() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["profile", session?.user.id],
    enabled: Boolean(session && supabase),
    retry: 1,
    queryFn: async ({ signal }) => {
      if (!supabase || !session) throw new Error("Sign in to view your profile.");
      const { data, error } = await supabase
        .from("users")
        .select("id,name,email,role,linked_student_id")
        .eq("id", session.user.id)
        .abortSignal(signal)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}
export function useExams() {
  return useQuery({
    queryKey: ["exams"],
    retry: 1,
    queryFn: async ({ signal }) => {
      if (!supabase) throw new Error("Exam connection is unavailable.");
      const { data, error } = await supabase
        .from("exams")
        .select("id,slug,name,price_kobo")
        .eq("is_active", true)
        .order("name")
        .abortSignal(signal);
      if (error) throw error;
      return data as Exam[];
    },
  });
}
export function useAccess() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["exam-access", session?.user.id],
    enabled: Boolean(session),
    retry: 1,
    queryFn: async ({ signal }) => {
      if (!supabase || !session) throw new Error("Sign in to view exam access.");
      const { data, error } = await supabase
        .from("user_exam_access")
        .select("exam_id")
        .eq("user_id", session.user.id)
        .abortSignal(signal);
      if (error) throw error;
      return data.map((access) => access.exam_id as string);
    },
  });
}
export function useAttempts() {
  const { session } = useAuth();
  const { data: profile } = useProfile();
  const learnerId = progressLearnerId(session?.user.id, profile?.role);
  return useQuery({
    queryKey: ["attempts", learnerId],
    enabled: Boolean(learnerId),
    retry: 1,
    queryFn: async ({ signal }) => {
      if (!supabase || !learnerId) throw new Error("Select a learner to view progress.");
      const { data, error } = await supabase
        .from("mock_attempts")
        .select("id,exam_id,score,completed_at")
        .eq("user_id", learnerId)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(50)
        .abortSignal(signal);
      if (error) throw error;
      return data as Attempt[];
    },
  });
}
