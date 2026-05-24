// PrepHQ Database Types — Generated from Document 05 Backend Schema

export type UserRole = "student" | "parent";
export type ExamSlug = "jamb" | "waec" | "neco" | "post-utme";
export type OptionLabel = "A" | "B" | "C" | "D";

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
      };
      mock_attempts: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string;
          subjects: string[];
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
        };
      };
    };
  };
}
