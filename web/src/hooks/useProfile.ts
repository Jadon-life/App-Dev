"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import type { Database, UserRole } from "@/types/database";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

export function useProfile() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async ({ signal }) => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("users")
        .select("id, email, name, role, created_at, linked_student_id")
        .eq("id", user.id)
        .abortSignal(signal)
        .single();
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: { name?: string; role?: UserRole }) => {
      if (!user) throw new Error("Not authenticated");
      if (
        updates.name !== undefined &&
        (!updates.name.trim() || updates.name.trim().length > 100)
      ) {
        throw new Error("Enter a name between 1 and 100 characters.");
      }
      const { data, error } = await supabase
        .from("users")
        .update({
          ...updates,
          ...(updates.name !== undefined ? { name: updates.name.trim() } : {}),
        })
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile", user?.id], data);
    },
  });

  return {
    profile: profileQuery.data,
    loading: authLoading || (!!user && profileQuery.isPending),
    error: profileQuery.error || (authError ? new Error(authError) : null),
    updateProfile: updateProfile.mutate,
    updateProfileAsync: updateProfile.mutateAsync,
    updateError: updateProfile.error,
    refetch: profileQuery.refetch,
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
