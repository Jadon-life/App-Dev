"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { BookOpen, Check, Clock3, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import { EXAMS } from "@shared/constants/exams";
import { useAuth } from "@/hooks/useAuth";
import {
  STUDY_DAYS,
  STUDY_SLOTS,
  countStudyTasks,
  createEmptyWeek,
  parseStudySchedule,
  scheduleStorageKey,
  type StudyDay,
  type StudySlot,
  type WeekSchedule,
} from "@/lib/study-schedule";

const SUBJECTS = Array.from(new Set(Object.values(EXAMS).flatMap((exam) => exam.subjects)));
const SLOT_LABELS = {
  morning: "Morning · 6 am–12 pm",
  afternoon: "Afternoon · 12–5 pm",
  evening: "Evening · 5–10 pm",
};

export default function StudySchedulePage() {
  const { user, loading } = useAuth();
  const userId = user?.id;
  const [schedule, setSchedule] = useState<WeekSchedule>(createEmptyWeek);
  const [selectedDay, setSelectedDay] = useState<StudyDay>(STUDY_DAYS[0]);
  const [ready, setReady] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [storageError, setStorageError] = useState("");
  const [legacyAvailable, setLegacyAvailable] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addSlot, setAddSlot] = useState<StudySlot>("morning");
  const [addSubject, setAddSubject] = useState(SUBJECTS[0]);
  const [addTopic, setAddTopic] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const topicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSchedule(createEmptyWeek());
    setReady(false);
    setDirty(false);
    setMessage("");
    setStorageError("");
    setLegacyAvailable(false);
    if (!userId) return;
    try {
      const stored = localStorage.getItem(scheduleStorageKey(userId));
      if (stored) {
        const restored = parseStudySchedule(stored);
        if (restored) setSchedule(restored);
        else
          setStorageError(
            "This browser’s saved planner could not be read. It has been kept unchanged. You can create and save a new plan.",
          );
      } else {
        setLegacyAvailable(!!localStorage.getItem("cryslearn-schedule"));
      }
    } catch {
      setStorageError(
        "Browser storage is unavailable. You can plan here, but changes cannot be saved on this device.",
      );
    }
    setReady(true);
  }, [userId]);

  useEffect(() => {
    if (!dirty) return;
    const preventLoss = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", preventLoss);
    return () => window.removeEventListener("beforeunload", preventLoss);
  }, [dirty]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (showAdd && dialog && !dialog.open) {
      dialog.showModal();
      // React's mount-time autofocus runs while this persistent dialog is closed.
      topicInputRef.current?.focus();
    } else if (!showAdd && dialog?.open) dialog.close();
  }, [showAdd]);

  const changeSchedule = (updated: WeekSchedule) => {
    setSchedule(updated);
    setDirty(true);
    setMessage("");
  };

  const saveSchedule = () => {
    if (!user || !ready) return;
    try {
      localStorage.setItem(scheduleStorageKey(user.id), JSON.stringify(schedule));
      setDirty(false);
      setStorageError("");
      setMessage("Your plan is saved on this browser.");
    } catch {
      setStorageError(
        "Your plan could not be saved. Browser storage may be full or blocked. Keep this page open to retain your changes.",
      );
    }
  };

  const importLegacyPlan = () => {
    try {
      const stored = localStorage.getItem("cryslearn-schedule");
      const restored = stored ? parseStudySchedule(stored) : null;
      if (!restored) {
        setStorageError(
          "The earlier planner could not be read. Your stored data has not been changed.",
        );
        return;
      }
      changeSchedule(restored);
      setLegacyAvailable(false);
      setMessage("Earlier plan imported. Save it to this account on this browser.");
    } catch {
      setStorageError("The earlier planner could not be accessed in this browser.");
    }
  };

  const addEntry = (event: FormEvent) => {
    event.preventDefault();
    if (!addTopic.trim() || schedule[selectedDay][addSlot].length >= 50) return;
    changeSchedule({
      ...schedule,
      [selectedDay]: {
        ...schedule[selectedDay],
        [addSlot]: [
          ...schedule[selectedDay][addSlot],
          { subject: addSubject, topic: addTopic.trim() },
        ],
      },
    });
    setAddTopic("");
    setShowAdd(false);
  };

  if (loading)
    return (
      <p role="status" className="page-intro py-10">
        Loading your planner…
      </p>
    );
  if (!user)
    return (
      <div className="dash-card max-w-xl">
        <h1 className="page-title">Make room for progress.</h1>
        <p className="page-intro mt-3">
          Sign in to keep a study plan for your account on this browser.
        </p>
        <Link className="btn-primary mt-5" href="/login">
          Sign in
        </Link>
      </div>
    );

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="page-kicker">Your weekly rhythm</p>
          <h1 className="page-title">A little structure. A lot of progress.</h1>
          <p className="page-intro mt-3">
            Pick a day, choose a topic, and make the time. Saved on this browser for your account.
          </p>
        </div>
        <button onClick={saveSchedule} disabled={!ready || !dirty} className="btn-primary gap-2">
          <Save size={16} />
          Save plan
        </button>
      </div>
      <div
        className="flex flex-wrap items-center justify-between gap-3 text-sm text-text-muted dark:text-text-dark-muted"
        aria-live="polite"
      >
        <p>
          {countStudyTasks(schedule)} study {countStudyTasks(schedule) === 1 ? "task" : "tasks"}{" "}
          this week
        </p>
        <p className="inline-flex items-center gap-2">
          {dirty ? (
            "You have unsaved changes"
          ) : (
            <>
              <Check size={15} />
              {message || "No unsaved changes"}
            </>
          )}
        </p>
      </div>
      {storageError && (
        <p
          role="alert"
          className="rounded-btn border border-danger/30 bg-danger/5 p-4 text-sm text-danger"
        >
          {storageError}
        </p>
      )}
      {legacyAvailable && (
        <div className="dash-card flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-xl text-sm text-text-muted dark:text-text-dark-muted">
            An earlier planner exists on this browser. Import it only if it belongs to you.
          </p>
          <button className="btn-secondary" onClick={importLegacyPlan}>
            Import earlier plan
          </button>
        </div>
      )}
      <section aria-label="Choose a study day" className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {STUDY_DAYS.map((day) => (
          <button
            key={day}
            aria-pressed={selectedDay === day}
            onClick={() => setSelectedDay(day)}
            className={`min-h-[92px] rounded-card border p-3 text-left transition-colors ${selectedDay === day ? "border-brand-teal bg-brand-teal/10 dark:border-brand-surf" : "border-brand-teal/15 bg-surface-light dark:border-brand-frost/15 dark:bg-surface-dark"}`}
          >
            <span className="block text-sm font-medium text-text-primary dark:text-text-dark-primary">
              {day.slice(0, 3)}
            </span>
            <span className="mt-3 block text-xs text-text-muted dark:text-text-dark-muted">
              {countStudyTasks(schedule, day)}{" "}
              {countStudyTasks(schedule, day) === 1 ? "task" : "tasks"}
            </span>
          </button>
        ))}
      </section>
      <section className="dash-card">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-heading text-2xl font-bold text-text-primary dark:text-text-dark-primary">
            {selectedDay}&apos;s plan
          </h2>
          <button
            className="btn-secondary gap-2"
            onClick={() => setShowAdd(true)}
            disabled={!ready}
          >
            <Plus size={16} />
            Add a task
          </button>
        </div>
        <div className="space-y-7">
          {STUDY_SLOTS.map((slot) => (
            <section key={slot} aria-labelledby={`${slot}-label`}>
              <h3
                id={`${slot}-label`}
                className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-dark-muted"
              >
                <Clock3 size={14} />
                {SLOT_LABELS[slot]}
              </h3>
              {schedule[selectedDay][slot].length === 0 ? (
                <p className="border-t border-brand-teal/10 py-4 text-sm text-text-muted dark:border-brand-frost/10 dark:text-text-dark-muted">
                  A little breathing room. Add a topic when you&apos;re ready.
                </p>
              ) : (
                <ul className="divide-y divide-brand-teal/10 dark:divide-brand-frost/10">
                  {schedule[selectedDay][slot].map((entry, index) => (
                    <li key={`${entry.subject}-${index}`} className="flex items-center gap-4 py-4">
                      <BookOpen
                        size={19}
                        className="shrink-0 text-brand-teal dark:text-brand-surf"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-text-primary dark:text-text-dark-primary">
                          {entry.subject}
                        </p>
                        <p className="mt-1 break-words text-sm text-text-muted dark:text-text-dark-muted">
                          {entry.topic}
                        </p>
                      </div>
                      <button
                        aria-label={`Remove ${entry.topic} from ${selectedDay} ${slot}`}
                        className="flex min-h-touch min-w-[44px] items-center justify-center rounded-btn text-text-muted hover:bg-danger/10 hover:text-danger dark:text-text-dark-muted"
                        onClick={() =>
                          changeSchedule({
                            ...schedule,
                            [selectedDay]: {
                              ...schedule[selectedDay],
                              [slot]: schedule[selectedDay][slot].filter(
                                (_, current) => current !== index,
                              ),
                            },
                          })
                        }
                      >
                        <Trash2 size={17} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-xs leading-relaxed text-text-muted dark:text-text-dark-muted">
          This plan does not sync across devices. Save before leaving, and avoid storing private
          information in task descriptions.
        </p>
        <button
          className="btn-secondary gap-2 text-sm"
          disabled={!ready || !countStudyTasks(schedule)}
          onClick={() => {
            if (
              window.confirm(
                "Clear every task in your weekly plan? Save afterward to keep this change.",
              )
            )
              changeSchedule(createEmptyWeek());
          }}
        >
          <RotateCcw size={15} />
          Clear week
        </button>
      </div>
      <dialog
        ref={dialogRef}
        aria-labelledby="add-task-title"
        onClose={() => setShowAdd(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setShowAdd(false);
        }}
        className="w-[calc(100%_-_2rem)] max-w-md rounded-section border border-brand-teal/15 bg-surface-light p-0 text-text-primary shadow-elevated backdrop:bg-black/50 dark:bg-surface-dark dark:text-text-dark-primary"
      >
        <form onSubmit={addEntry} className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 id="add-task-title" className="font-heading text-2xl font-bold">
              A task for {selectedDay}
            </h2>
            <button
              type="button"
              aria-label="Close add task"
              className="flex min-h-touch min-w-[44px] items-center justify-center"
              onClick={() => setShowAdd(false)}
            >
              <X size={19} />
            </button>
          </div>
          <div>
            <label htmlFor="task-slot" className="mb-2 block text-sm font-medium">
              Time of day
            </label>
            <select
              id="task-slot"
              value={addSlot}
              onChange={(event) => setAddSlot(event.target.value as StudySlot)}
              className="input-field"
            >
              {STUDY_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {SLOT_LABELS[slot]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-subject" className="mb-2 block text-sm font-medium">
              Subject
            </label>
            <select
              id="task-subject"
              value={addSubject}
              onChange={(event) => setAddSubject(event.target.value)}
              className="input-field"
            >
              {SUBJECTS.map((subject) => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-topic" className="mb-2 block text-sm font-medium">
              What will you work on?
            </label>
            <input
              ref={topicInputRef}
              id="task-topic"
              required
              maxLength={180}
              value={addTopic}
              onChange={(event) => setAddTopic(event.target.value)}
              className="input-field"
              placeholder="For example, quadratic equations"
            />
            <p className="mt-2 text-xs text-text-muted dark:text-text-dark-muted">
              Be specific. One topic is a good start.
            </p>
          </div>
          {schedule[selectedDay][addSlot].length >= 50 && (
            <p role="alert" className="text-sm text-danger">
              This time slot already has 50 tasks. Remove one before adding another.
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={!addTopic.trim() || schedule[selectedDay][addSlot].length >= 50}
              className="btn-primary"
            >
              Add task
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
