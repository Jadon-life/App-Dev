"use client";

/**
 * Study Schedule — Editable weekly planner with daily breakdown.
 * Users create their own schedule using a template.
 * Data stored in localStorage (no backend needed for MVP).
 */

import { useState, useEffect } from "react";
import { Plus, X, Clock, BookOpen, Save, RotateCcw } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["Morning (6am-12pm)", "Afternoon (12pm-5pm)", "Evening (5pm-10pm)"];
const SUBJECTS = ["Mathematics", "English Language", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature"];

interface ScheduleEntry {
  subject: string;
  topic: string;
}

interface DaySchedule {
  morning: ScheduleEntry[];
  afternoon: ScheduleEntry[];
  evening: ScheduleEntry[];
}

type WeekSchedule = Record<string, DaySchedule>;

const createEmptyWeek = (): WeekSchedule =>
  Object.fromEntries(DAYS.map(d => [d, { morning: [], afternoon: [], evening: [] }]));

export default function StudySchedulePage() {
  const [schedule, setSchedule] = useState<WeekSchedule>(createEmptyWeek());
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSlot, setAddSlot] = useState<"morning" | "afternoon" | "evening">("morning");
  const [addSubject, setAddSubject] = useState(SUBJECTS[0]);
  const [addTopic, setAddTopic] = useState("");
  const [saved, setSaved] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cryslearn-schedule");
    if (stored) {
      try { setSchedule(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const saveSchedule = () => {
    localStorage.setItem("cryslearn-schedule", JSON.stringify(schedule));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetSchedule = () => {
    if (confirm("Reset your entire schedule? This cannot be undone.")) {
      setSchedule(createEmptyWeek());
      localStorage.removeItem("cryslearn-schedule");
    }
  };

  const addEntry = () => {
    if (!addTopic.trim()) return;
    const updated = { ...schedule };
    updated[selectedDay] = {
      ...updated[selectedDay],
      [addSlot]: [...updated[selectedDay][addSlot], { subject: addSubject, topic: addTopic }],
    };
    setSchedule(updated);
    setAddTopic("");
    setShowAddModal(false);
  };

  const removeEntry = (day: string, slot: "morning" | "afternoon" | "evening", index: number) => {
    const updated = { ...schedule };
    updated[day][slot] = updated[day][slot].filter((_, i) => i !== index);
    setSchedule(updated);
  };

  const getSlotCount = (day: string) => {
    const d = schedule[day];
    return d.morning.length + d.afternoon.length + d.evening.length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-bold text-xl text-text-primary dark:text-text-dark-primary">
            Study Schedule
          </h2>
          <p className="text-text-muted dark:text-text-dark-muted text-sm mt-1">
            Plan your week. Add subjects and topics to each time slot.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetSchedule} className="flex items-center gap-1.5 px-3 py-2 rounded-btn text-xs text-text-muted dark:text-text-dark-muted border border-brand-teal/10 dark:border-brand-frost/[0.06] hover:border-danger/30 hover:text-danger transition-all">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button onClick={saveSchedule} className="btn-primary text-xs px-4 py-2 gap-1.5">
            <Save className="w-3.5 h-3.5" />
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      </div>

      {/* ═══ WEEKLY OVERVIEW GRID ═══ */}
      <div className="dash-card overflow-x-auto">
        <h3 className="font-heading font-bold text-sm text-text-primary dark:text-text-dark-primary mb-4">
          Week Overview
        </h3>
        <div className="grid grid-cols-7 gap-2 min-w-[560px]">
          {DAYS.map((day) => {
            const count = getSlotCount(day);
            const isSelected = day === selectedDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`p-3 rounded-card text-center transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-b from-brand-teal/20 to-brand-purple/10 border-2 border-brand-surf/40"
                    : "border border-brand-teal/[0.06] dark:border-brand-frost/[0.04] hover:border-brand-surf/20"
                }`}
              >
                <p className={`text-xs font-bold ${isSelected ? "text-brand-surf" : "text-text-muted dark:text-text-dark-muted"}`}>
                  {day.slice(0, 3)}
                </p>
                <p className={`text-lg font-heading font-black mt-1 ${isSelected ? "text-text-primary dark:text-text-dark-primary" : "text-text-muted/60 dark:text-text-dark-muted/60"}`}>
                  {count}
                </p>
                <p className="text-[10px] text-text-muted/50 dark:text-text-dark-muted/50">
                  {count === 1 ? "task" : "tasks"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ DAILY BREAKDOWN ═══ */}
      <div className="dash-card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading font-bold text-base text-text-primary dark:text-text-dark-primary">
            {selectedDay}
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-bold bg-brand-surf/10 text-brand-surf border border-brand-surf/20 hover:bg-brand-surf/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        </div>

        <div className="space-y-5">
          {(["morning", "afternoon", "evening"] as const).map((slot, slotIdx) => (
            <div key={slot}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-brand-surf/60" />
                <span className="text-xs font-bold text-text-muted dark:text-text-dark-muted uppercase tracking-wider">
                  {TIME_SLOTS[slotIdx]}
                </span>
              </div>

              {schedule[selectedDay][slot].length === 0 ? (
                <div className="border border-dashed border-brand-teal/10 dark:border-brand-frost/[0.06] rounded-btn p-3 text-center">
                  <p className="text-xs text-text-muted/50 dark:text-text-dark-muted/50">
                    No tasks yet. Click &quot;Add Task&quot; to plan this slot.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {schedule[selectedDay][slot].map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-btn border border-brand-teal/[0.06] dark:border-brand-frost/[0.04] bg-brand-teal/[0.02] dark:bg-brand-frost/[0.02] group"
                    >
                      <div className="w-8 h-8 rounded-btn bg-gradient-to-br from-brand-teal/20 to-brand-purple/20 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-brand-surf" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary truncate">
                          {entry.subject}
                        </p>
                        <p className="text-xs text-text-muted dark:text-text-dark-muted truncate">
                          {entry.topic}
                        </p>
                      </div>
                      <button
                        onClick={() => removeEntry(selectedDay, slot, i)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-danger/60 hover:text-danger hover:bg-danger/10 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ADD TASK MODAL ═══ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={() => setShowAddModal(false)}>
          <div className="dash-card w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-base text-text-primary dark:text-text-dark-primary mb-4">
              Add Study Task
            </h3>

            {/* Time slot */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-text-muted dark:text-text-dark-muted mb-1">Time Slot</label>
              <select value={addSlot} onChange={(e) => setAddSlot(e.target.value as "morning" | "afternoon" | "evening")} className="input-field text-sm">
                <option value="morning">Morning (6am-12pm)</option>
                <option value="afternoon">Afternoon (12pm-5pm)</option>
                <option value="evening">Evening (5pm-10pm)</option>
              </select>
            </div>

            {/* Subject */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-text-muted dark:text-text-dark-muted mb-1">Subject</label>
              <select value={addSubject} onChange={(e) => setAddSubject(e.target.value)} className="input-field text-sm">
                {SUBJECTS.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>

            {/* Topic */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-text-muted dark:text-text-dark-muted mb-1">Topic / What to study</label>
              <input
                type="text"
                value={addTopic}
                onChange={(e) => setAddTopic(e.target.value)}
                className="input-field text-sm"
                placeholder="e.g. Quadratic equations, Past questions 2023..."
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && addEntry()}
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 text-sm py-2">Cancel</button>
              <button onClick={addEntry} disabled={!addTopic.trim()} className="btn-primary flex-1 text-sm py-2 disabled:opacity-40">Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
