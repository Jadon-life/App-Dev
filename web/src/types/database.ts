// CrysLearn Database Types — Generated from Document 05 Backend Schema

export type UserRole = "student" | "parent";
export type ExamSlug = "jamb" | "waec" | "neco" | "post-utme";
export type OptionLabel = "A" | "B" | "C" | "D";
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface QuestionOption {
  label: OptionLabel;
  text: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: UserRole;
          created_at: string;
          linked_student_id: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: UserRole;
          created_at?: string;
          linked_student_id?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: UserRole;
          created_at?: string;
          linked_student_id?: string | null;
        };
        Relationships: [];
      };
      exams: {
        Row: {
          id: string;
          slug: ExamSlug;
          name: string;
          price_kobo: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          slug: ExamSlug;
          name: string;
          price_kobo: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          slug?: ExamSlug;
          name?: string;
          price_kobo?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          exam_id: string;
          subject: string;
          year: number;
          question_text: string;
          options: QuestionOption[];
          correct_option: OptionLabel;
          explanation: string;
        };
        Insert: {
          id?: string;
          exam_id: string;
          subject: string;
          year: number;
          question_text: string;
          options: QuestionOption[];
          correct_option: OptionLabel;
          explanation: string;
        };
        Update: {
          id?: string;
          exam_id?: string;
          subject?: string;
          year?: number;
          question_text?: string;
          options?: QuestionOption[];
          correct_option?: OptionLabel;
          explanation?: string;
        };
        Relationships: [];
      };
      user_exam_access: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string;
          payment_ref: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_id: string;
          payment_ref: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_id?: string;
          payment_ref?: string;
          unlocked_at?: string;
        };
        Relationships: [];
      };
      mock_attempts: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string;
          subjects: string[];
          question_ids: string[];
          expires_at: string | null;
          answer_revision: number;
          review_snapshot: Json | null;
          answers: Record<string, OptionLabel>;
          score: number;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_id: string;
          subjects: string[];
          answers: Record<string, OptionLabel>;
          score: number;
          started_at?: string;
          completed_at?: string | null;
          question_ids?: string[];
          expires_at?: string | null;
          answer_revision?: number;
          review_snapshot?: Json | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_id?: string;
          subjects?: string[];
          answers?: Record<string, OptionLabel>;
          score?: number;
          started_at?: string;
          completed_at?: string | null;
          question_ids?: string[];
          expires_at?: string | null;
          answer_revision?: number;
          review_snapshot?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
