"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Flame, HelpCircle, X, Play } from "lucide-react";

// Hooks
import { useHelpNotes } from "@/features/knowledge-boost/hooks/help-notes/use-help-notes";
import { useProfile } from "@/context/use-profile";
import { useFindProfile } from "@/features/access-control/hooks/profile/use-find-profile";

const DEBUG_MODE = false;
const STORAGE_KEY = "sr_notes_memory_v1";
const LAST_SHOWN_KEY = "sr_notes_last_timestamp"; // Key for persistence
const VISIBLE_DURATION = 60000; // 1 minute visibility
const COOLDOWN_DURATION = 10 * 60 * 1000; // 10 minutes cooldown

type ToastNote = {
  id: number;
  text: string;
  priority?: number;
};

type NoteMemory = {
  text: string;
  priority?: number;
  ease: number;
  interval: number;
  repetitions: number;
  due: number;
};

export default function DoYouKnow() {
  /* 1. Profile & Feature Gate Logic */
  const { user } = useProfile();
  const { data: profileData, isLoading: profileLoading } = useFindProfile({
    email: user?.email as string,
  });

  const isEnabled = useMemo(() => {
    const profile = profileData?.[0];
    if (!profile?.settings) return false;

    try {
      const settings = typeof profile.settings === "string"
        ? JSON.parse(profile.settings)
        : profile.settings;

      return !!settings?.doYouKnow?.on;
    } catch (e) {
      console.error("DoYouKnow: Error parsing settings", e);
      return false;
    }
  }, [profileData]);

  /* 2. Knowledge Base Hooks */
  const helpNotes = useHelpNotes();
  const { loaded: notesLoaded } = (helpNotes as any) || {};

  /* 3. State & Refs */
  const [toasts, setToasts] = useState<ToastNote[]>([]);
  const memoryRef = useRef<Record<string, NoteMemory>>({});

  // -----------------------------
  // SRS Memory Management
  // -----------------------------
  const loadMemory = (): Record<string, NoteMemory> => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  };

  const saveMemory = (mem: Record<string, NoteMemory>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mem));
  };

  useEffect(() => {
    if (isEnabled) {
      memoryRef.current = loadMemory();
    }
  }, [isEnabled]);

  const initNote = (text: string, priority: number = 1): NoteMemory => ({
    text,
    priority,
    ease: 2.5,
    interval: 1,
    repetitions: 0,
    due: Date.now(),
  });

  const updateSchedule = (note: NoteMemory) => {
    const now = Date.now();
    const quality = 4; // Assuming "Success" on every view

    if (quality >= 3) {
      if (note.repetitions === 0) note.interval = 1;
      else if (note.repetitions === 1) note.interval = 6;
      else note.interval = Math.round(note.interval * note.ease);
      note.repetitions += 1;
    } else {
      note.repetitions = 0;
      note.interval = 1;
    }

    note.ease = Math.max(1.3, note.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    const priorityFactor = Math.max(1, note.priority || 1);
    const finalIntervalMinutes = Math.max(0.5, note.interval / priorityFactor);

    note.due = now + finalIntervalMinutes * 60 * 1000;
    return note;
  };

  // -----------------------------
  // Selection & Toast Trigger
  // -----------------------------
  const pickNote = () => {
    if (!notesLoaded) return null;
    const notes = helpNotes?.notes || [];
    const now = Date.now();

    const dueNotes = notes.filter((n: any) => {
      if (DEBUG_MODE) return true;
      const mem = memoryRef.current[n.notes];
      return !mem || mem.due <= now;
    });

    if (!dueNotes.length) return null;

    const weightedNotes = dueNotes.map((n: any) => {
      const basePriority = Math.max(1, n.priority || 1);
      const createdAt = n.created_at ? new Date(n.created_at).getTime() : 0;
      const ageInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      const recencyBoost = Math.max(1, 5 / (1 + ageInDays * 0.1));

      return { note: n, weight: basePriority * recencyBoost };
    });

    const totalWeight = weightedNotes.reduce((acc, curr) => acc + curr.weight, 0);
    let randomThreshold = Math.random() * totalWeight;

    for (const item of weightedNotes) {
      randomThreshold -= item.weight;
      if (randomThreshold <= 0) return item.note;
    }
    return weightedNotes[0].note;
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (ignoreCooldown: boolean = false) => {
    const now = Date.now();

    // PERSISTENT COOLDOWN CHECK
    const lastShownStr = localStorage.getItem(LAST_SHOWN_KEY);
    const lastShownTime = lastShownStr ? parseInt(lastShownStr) : 0;

    if (!ignoreCooldown && (now - lastShownTime < COOLDOWN_DURATION)) {
      if (DEBUG_MODE) {
        console.log(`Cooldown active: ${Math.round((COOLDOWN_DURATION - (now - lastShownTime)) / 1000)}s left`);
      }
      return;
    }

    const note = pickNote();
    if (!note) return;

    // Update the timestamp in localStorage immediately
    localStorage.setItem(LAST_SHOWN_KEY, now.toString());

    const id = now;
    const text = note.notes;

    let memory = memoryRef.current[text] || initNote(text, note.priority);
    memory = updateSchedule(memory);

    memoryRef.current[text] = memory;
    saveMemory(memoryRef.current);

    setToasts([{ id, text, priority: note.priority }]);

    const timeoutId = setTimeout(() => removeToast(id), VISIBLE_DURATION);
    return () => clearTimeout(timeoutId);
  };

  // -----------------------------
  // Interval & Event Effects
  // -----------------------------
  useEffect(() => {
    if (!isEnabled || !notesLoaded) return;

    // Trigger on mount (addToast handles the 10-min check internally)
    addToast();

    // Check periodically (every 30 seconds) if it's time to show a new one
    const interval = setInterval(() => addToast(), 30000);

    return () => clearInterval(interval);
  }, [isEnabled, notesLoaded]);

  useEffect(() => {
    if (!isEnabled || !notesLoaded) return;

    const handler = () => addToast(true); // Ignore cooldown for manual events
    window.addEventListener("show-random-note", handler);
    return () => window.removeEventListener("show-random-note", handler);
  }, [isEnabled, notesLoaded]);

  const getStyle = (priority: number = 1) => {
    if (priority >= 10) return { icon: <Flame className="w-5 h-5 text-red-600 animate-pulse" />, bar: "bg-red-600" };
    if (priority >= 5) return { icon: <Flame className="w-5 h-5 text-orange-500" />, bar: "bg-orange-500" };
    if (priority >= 3) return { icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, bar: "bg-amber-500" };
    return { icon: <HelpCircle className="w-5 h-5 text-sky-500" />, bar: "bg-sky-500" };
  };

  if (profileLoading || !isEnabled) return null;

  return (
    <>
      {DEBUG_MODE && (
        <button
          onClick={() => addToast(true)}
          className="fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg font-bold text-xs transition-all active:scale-95"
        >
          <Play className="w-3 h-3 fill-current" />
          FORCE SHOW NOTE
        </button>
      )}

      <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {toasts.map((toast) => {
            const style = getStyle(toast.priority);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="relative overflow-hidden group p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800"
              >
                <button
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex gap-3 items-start pr-6">
                  <div className="shrink-0 mt-0.5">{style.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Do You Know?
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-200">
                      {toast.text}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: VISIBLE_DURATION / 1000, ease: "linear" }}
                    className={`h-full ${style.bar}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}