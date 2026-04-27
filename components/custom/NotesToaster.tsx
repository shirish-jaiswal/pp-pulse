"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Flame, HelpCircle, X } from "lucide-react";
import { useHelpNotes } from "@/features/knowledge-boost/hooks/help-notes/use-help-notes";

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

const STORAGE_KEY = "sr_notes_memory_v1";
const VISIBLE_DURATION = 60000; // 1 minute
const COOLDOWN_DURATION = 60000; // 10 minutes

export default function NotesToaster() {
  const helpNotes = useHelpNotes();
  const { loaded } = helpNotes as any;

  const [toasts, setToasts] = useState<ToastNote[]>([]);
  const lastShownRef = useRef<number>(0);
  const memoryRef = useRef<Record<string, NoteMemory>>({});

  // -----------------------------
  // Memory Management
  // -----------------------------
  const loadMemory = (): Record<string, NoteMemory> => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveMemory = (mem: Record<string, NoteMemory>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mem));
  };

  useEffect(() => {
    memoryRef.current = loadMemory();
  }, []);

  const initNote = (text: string, priority?: number): NoteMemory => ({
    text,
    priority,
    ease: 2.0,
    interval: 1,
    repetitions: 0,
    due: Date.now(),
  });

  const updateSchedule = (note: NoteMemory) => {
    const now = Date.now();
    const quality = 3;

    if (quality >= 3) {
      if (note.repetitions === 0) note.interval = 1;
      else if (note.repetitions === 1) note.interval = 5;
      else if (note.repetitions === 2) note.interval = 30;
      else note.interval = Math.round(note.interval * note.ease);
      note.repetitions += 1;
    } else {
      note.repetitions = 0;
      note.interval = 1;
    }

    note.ease = Math.max(
      1.3,
      note.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    note.due = now + note.interval * 60 * 1000;
    return note;
  };

  // -----------------------------
  // Toast Logic
  // -----------------------------
  const pickNote = () => {
    if (!loaded) return null;

    const notes = helpNotes?.notes || [];
    const now = Date.now();

    const dueNotes = notes.filter((n: any) => {
      const mem = memoryRef.current[n.notes];
      if (!mem) return true;
      return mem.due <= now;
    });

    if (!dueNotes.length) return null;

    const weighted = dueNotes.flatMap((n: any) => {
      const weight = n.priority === 3 ? 6 : n.priority === 2 ? 3 : 1;
      return Array(weight).fill(n);
    });

    return weighted[Math.floor(Math.random() * weighted.length)];
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = () => {
    const now = Date.now();

    // Enforce 10-minute cooldown
    if (now - lastShownRef.current < COOLDOWN_DURATION) {
      console.log("Toast cooldown active.");
      return;
    }

    const note = pickNote();
    if (!note) return;

    const id = now;
    const text = note.notes;
    lastShownRef.current = now;

    let memory = memoryRef.current[text] || initNote(text, note.priority);
    memory = updateSchedule(memory);

    memoryRef.current[text] = memory;
    saveMemory(memoryRef.current);

    // Set as an array with one item to ensure only one toast shows at a time
    setToasts([{ id, text, priority: note.priority }]);

    // Auto-remove after 1 minute
    setTimeout(() => removeToast(id), VISIBLE_DURATION);
  };

  // -----------------------------
  // Effects
  // -----------------------------
  useEffect(() => {
    const handler = () => addToast();
    window.addEventListener("show-random-note", handler);
    return () => window.removeEventListener("show-random-note", handler);
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    // Check every 10 minutes
    const interval = setInterval(() => {
      addToast();
    }, COOLDOWN_DURATION);

    return () => clearInterval(interval);
  }, [loaded]);

  const getStyle = (priority?: number) => {
    if (priority === 3) {
      return {
        icon: <Flame className="w-5 h-5 text-red-500" />,
        bar: "bg-red-500",
      };
    }
    if (priority === 2) {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        bar: "bg-amber-500",
      };
    }
    return {
      icon: <HelpCircle className="w-5 h-5 text-sky-500" />,
      bar: "bg-sky-500",
    };
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 flex flex-col gap-3">
      <AnimatePresence>
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
              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-all"
                aria-label="Close note"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex gap-3 items-start pr-6">
                <div className="shrink-0 mt-0.5">{style.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-200">
                    {toast.text}
                  </p>
                </div>
              </div>

              {/* Progress Bar (Visual Timer) */}
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
  );
}