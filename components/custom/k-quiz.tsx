"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, CheckCircle2, Circle, Play, Timer } from "lucide-react";
import confetti from "canvas-confetti";

// Hooks & Types
import { useGetAllQna } from "@/features/knowledge-boost/hooks/qna/use-get-all-qna";
import { useProfile } from "@/context/use-profile";
import { useFindProfile } from "@/features/access-control/hooks/profile/use-find-profile";

const DEBUG_MODE = false;
const STORAGE_KEY = "sr_qna_memory_v1";
const LAST_SHOWN_KEY = "sr_qna_last_timestamp";
const COOLDOWN_DURATION = 15 * 60 * 1000; // 15 minutes
const DISPLAY_DURATION = 60; // seconds

type QnaMemory = {
    question: string;
    ease: number;
    interval: number;
    repetitions: number;
    due: number;
};

export default function KnowledgeQuiz() {
    const { user } = useProfile();
    const { data: profileData, isLoading: profileLoading } = useFindProfile({
        email: user?.email as string
    });
    const { data: qnaList } = useGetAllQna();

    const [activeQuiz, setActiveQuiz] = useState<{
        id: number;
        question: string;
        options: string[];
        answer: string;
    } | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timeLeft, setTimeLeft] = useState(DISPLAY_DURATION);

    const memoryRef = useRef<Record<string, QnaMemory>>({});

    // 1. Feature Gate logic
    const isEnabled = useMemo(() => {
        const profile = profileData?.[0];
        if (!profile?.settings) return false;
        try {
            const settings = typeof profile.settings === "string"
                ? JSON.parse(profile.settings)
                : profile.settings;
            return !!settings?.qna?.on;
        } catch { return false; }
    }, [profileData]);

    // 2. SRS Logic initialization
    useEffect(() => {
        if (isEnabled && typeof window !== "undefined") {
            const raw = localStorage.getItem(STORAGE_KEY);
            memoryRef.current = raw ? JSON.parse(raw) : {};
        }
    }, [isEnabled]);

    // Timer Logic: Auto-dismiss and Visual Countdown
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (activeQuiz && !selectedOption) {
            if (timeLeft <= 0) {
                setActiveQuiz(null);
                return;
            }

            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [activeQuiz, selectedOption, timeLeft]);

    const updateSrs = (questionText: string, success: boolean) => {
        let mem = memoryRef.current[questionText] || {
            question: questionText,
            ease: 2.5,
            interval: 1,
            repetitions: 0,
            due: Date.now(),
        };

        if (success) {
            if (mem.repetitions === 0) mem.interval = 1;
            else if (mem.repetitions === 1) mem.interval = 6;
            else mem.interval = Math.round(mem.interval * mem.ease);
            mem.repetitions += 1;
        } else {
            mem.repetitions = 0;
            mem.interval = 1;
            mem.ease = Math.max(1.3, mem.ease - 0.2);
        }

        mem.due = Date.now() + mem.interval * 60 * 1000;
        memoryRef.current[questionText] = mem;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryRef.current));
    };

    const triggerQuiz = (ignoreCooldown = false) => {
        const now = Date.now();
        const lastShownStr = localStorage.getItem(LAST_SHOWN_KEY);
        const lastShownTime = lastShownStr ? parseInt(lastShownStr) : 0;

        if (!ignoreCooldown && (now - lastShownTime < COOLDOWN_DURATION)) {
            return;
        }

        if (!qnaList || qnaList.length === 0) return;

        const dueQuestions = qnaList.filter(q => {
            if (ignoreCooldown) return true;
            const mem = memoryRef.current[q.question];
            return !mem || mem.due <= now;
        });

        const pool = dueQuestions.length > 0 ? dueQuestions : qnaList;
        const picked = pool[Math.floor(Math.random() * pool.length)];

        localStorage.setItem(LAST_SHOWN_KEY, now.toString());

        // Reset timer for new quiz
        setTimeLeft(DISPLAY_DURATION);

        setActiveQuiz({
            id: picked.id,
            question: picked.question,
            answer: picked.answer,
            options: picked.options.split(",").map((o: string) => o.trim()),
        });
    };

    useEffect(() => {
        if (!isEnabled || !qnaList) return;
        triggerQuiz();
        const interval = setInterval(() => triggerQuiz(), 60000);
        return () => clearInterval(interval);
    }, [isEnabled, qnaList]);

    useEffect(() => {
        if (!isEnabled) return;
        const handler = () => triggerQuiz(true);
        window.addEventListener("show-random-quiz", handler);
        return () => window.removeEventListener("show-random-quiz", handler);
    }, [isEnabled, qnaList]);

    const handleOptionSelect = (option: string) => {
        if (selectedOption) return;

        setSelectedOption(option);
        const correct = option.trim().toLowerCase() === activeQuiz?.answer.trim().toLowerCase();
        setIsCorrect(correct);
        updateSrs(activeQuiz!.question, correct);

        if (correct) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.8, x: 0.9 },
                colors: ['#10b981', '#3b82f6', '#f59e0b']
            });
        }

        setTimeout(() => {
            setActiveQuiz(null);
            setSelectedOption(null);
            setIsCorrect(null);
        }, 3000);
    };

    if (profileLoading || !isEnabled) return null;

    return (
        <>
            {DEBUG_MODE && (
                <button
                    onClick={() => triggerQuiz(true)}
                    className="fixed top-20 right-4 z-[60] flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg font-bold text-xs transition-all active:scale-95"
                >
                    <Play className="w-3 h-3 fill-current" />
                    FORCE SHOW QUIZ
                </button>
            )}

            <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96">
                <AnimatePresence>
                    {activeQuiz && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                            Quick Quiz
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Enhanced Timer UI */}
                                        {!selectedOption && (
                                            <motion.div
                                                animate={timeLeft <= 10 ? { scale: [1, 1.05, 1] } : {}}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] font-bold tabular-nums transition-colors ${timeLeft <= 10
                                                    ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800"
                                                    : "bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
                                                    }`}
                                            >
                                                <Timer className={`w-3 h-3 ${timeLeft <= 10 ? "animate-pulse" : ""}`} />
                                                <span>{timeLeft}s</span>
                                            </motion.div>
                                        )}

                                        <button
                                            onClick={() => setActiveQuiz(null)}
                                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-4 leading-tight">
                                    {activeQuiz.question}
                                </h3>

                                <div className="space-y-2">
                                    {activeQuiz.options.map((option, idx) => {
                                        const isSelected = selectedOption === option;
                                        const isThisCorrect = option.trim().toLowerCase() === activeQuiz.answer.trim().toLowerCase();

                                        let variantClass = "border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800";
                                        if (isSelected) {
                                            variantClass = isCorrect
                                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                                : "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                                        } else if (selectedOption && isThisCorrect) {
                                            variantClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                disabled={!!selectedOption}
                                                onClick={() => handleOptionSelect(option)}
                                                className={`w-full flex items-start justify-between p-3 rounded-xl border text-sm font-medium transition-all ${variantClass}`}
                                            >
                                                {/* 1. Removed 'truncate' and 'pr-2' */}
                                                {/* 2. Added 'text-left' and 'leading-normal' for better readability when wrapped */}
                                                <span className="text-left leading-normal wrap-break-words">
                                                    {option}
                                                </span>

                                                {/* 3. Changed parent to 'items-start' so the icon stays at the top if text is long */}
                                                <div className="mt-0.5 ml-2">
                                                    {isSelected ? (
                                                        isCorrect ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 shrink-0 opacity-20" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Progress bar reflects the 1-minute timeout */}
                            <div className="h-1 bg-zinc-100 dark:bg-zinc-800">
                                {!selectedOption && (
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: DISPLAY_DURATION, ease: "linear" }}
                                        className="h-full bg-indigo-500"
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}