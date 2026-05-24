// PrepHQ Exam Constants — Source of truth for exam metadata
// Used by both web and mobile apps

import type { ExamSlug } from "../types";

export interface ExamConfig {
  slug: ExamSlug;
  name: string;
  fullName: string;
  price_kobo: number;
  priceFormatted: string;
  subjects: string[];
  mockDurationMinutes: number;
  mockQuestionCount: number;
}

export const EXAMS: Record<ExamSlug, ExamConfig> = {
  jamb: {
    slug: "jamb",
    name: "JAMB",
    fullName: "Joint Admissions and Matriculation Board (UTME)",
    price_kobo: 350000,
    priceFormatted: "₦3,500",
    subjects: [
      "Mathematics",
      "English Language",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "Government",
      "Literature in English",
      "Commerce",
      "Accounting",
      "CRS/IRS",
      "Geography",
    ],
    mockDurationMinutes: 90,
    mockQuestionCount: 60,
  },
  waec: {
    slug: "waec",
    name: "WAEC",
    fullName: "West African Examinations Council (SSCE)",
    price_kobo: 350000,
    priceFormatted: "₦3,500",
    subjects: [
      "Mathematics",
      "English Language",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "Government",
      "Literature in English",
      "Commerce",
      "Accounting",
      "Geography",
      "Civic Education",
    ],
    mockDurationMinutes: 60,
    mockQuestionCount: 50,
  },
  neco: {
    slug: "neco",
    name: "NECO",
    fullName: "National Examinations Council (SSCE)",
    price_kobo: 350000,
    priceFormatted: "₦3,500",
    subjects: [
      "Mathematics",
      "English Language",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "Government",
      "Literature in English",
      "Commerce",
      "Accounting",
      "Geography",
      "Civic Education",
    ],
    mockDurationMinutes: 60,
    mockQuestionCount: 50,
  },
  "post-utme": {
    slug: "post-utme",
    name: "Post-UTME",
    fullName: "Post-UTME University Screening",
    price_kobo: 500000,
    priceFormatted: "₦5,000",
    subjects: [
      "Mathematics",
      "English Language",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "General Knowledge",
    ],
    mockDurationMinutes: 45,
    mockQuestionCount: 40,
  },
};

export const EXAM_SLUGS: ExamSlug[] = ["jamb", "waec", "neco", "post-utme"];
