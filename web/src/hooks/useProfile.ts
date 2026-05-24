"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import type { UserRole } from "@/types/database";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  linked_student_id: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: { name?: string; role?: UserRole; linked_student_id?: string | null }) => {
      if (!user) throw new Error("Not authenticated");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("users")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  return {
    profile: profileQuery.data,
    loading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isPending,
  };
}

export function useExamAccess() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["exam-access", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_exam_access")
        .select("*, exams(*)")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
