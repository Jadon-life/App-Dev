export const STUDY_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const STUDY_SLOTS = ["morning", "afternoon", "evening"] as const;
export type StudyDay = (typeof STUDY_DAYS)[number];
export type StudySlot = (typeof STUDY_SLOTS)[number];
export interface ScheduleEntry {
  subject: string;
  topic: string;
}
export type WeekSchedule = Record<StudyDay, Record<StudySlot, ScheduleEntry[]>>;

export function createEmptyWeek(): WeekSchedule {
  const week = {} as WeekSchedule;
  for (const day of STUDY_DAYS) {
    week[day] = { morning: [], afternoon: [], evening: [] };
  }
  return week;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Browser storage is untrusted: validate every day, slot and task before rendering. */
export function parseStudySchedule(stored: string): WeekSchedule | null {
  try {
    const value: unknown = JSON.parse(stored);
    if (!isRecord(value)) return null;
    const schedule = createEmptyWeek();
    for (const day of STUDY_DAYS) {
      const dayValue = value[day];
      if (!isRecord(dayValue)) return null;
      for (const slot of STUDY_SLOTS) {
        const entries = dayValue[slot];
        if (!Array.isArray(entries) || entries.length > 50) return null;
        for (const entry of entries) {
          if (
            !isRecord(entry) ||
            typeof entry.subject !== "string" ||
            !entry.subject.trim() ||
            entry.subject.length > 80 ||
            typeof entry.topic !== "string" ||
            !entry.topic.trim() ||
            entry.topic.length > 180
          ) {
            return null;
          }
          schedule[day][slot].push({ subject: entry.subject.trim(), topic: entry.topic.trim() });
        }
      }
    }
    return schedule;
  } catch {
    return null;
  }
}

export function scheduleStorageKey(userId: string): string {
  return `cryslearn-schedule:${userId}`;
}

export function countStudyTasks(schedule: WeekSchedule, day?: StudyDay): number {
  let total = 0;
  for (const currentDay of day ? [day] : STUDY_DAYS) {
    for (const slot of STUDY_SLOTS) total += schedule[currentDay][slot].length;
  }
  return total;
}
