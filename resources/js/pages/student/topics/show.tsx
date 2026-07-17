import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ChartNoAxesColumn, ChevronLeft, Clock, House, Play, RotateCcw, Trophy } from 'lucide-react';
import { useState } from 'react';
import VisibilityBadge from '@/components/admin/topics/visibility-badge';
import { AttemptTimeline } from '@/components/student/topics/attempt-timeline';
import { DifficultySelector } from '@/components/student/topics/difficulty-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getColor } from '@/components/student/topics/topic-colors';
import competitions from '@/routes/student/competitions';
import topics from '@/routes/student/topics';
import type { Topic } from '@/types/topic';
import DateDisplay from '@/components/date-display';
import { cn } from '@/lib/utils';

interface UserStats {
    total_attempts: number;
    last_practice_at: string | null;
    best_score: { correct_answers: number; total_questions: number } | null;
    average_percentage: number | null;
}

interface RecentAttempt {
    id: number;
    status: 'in_progress' | 'completed' | 'abandoned';
    correct_answers: number;
    total_questions: number;
    created_at: string;
}

interface ShowProps {
    topic: Topic;
    userStats: UserStats;
    hasInProgress: boolean;
    inProgressAttemptId: number | null;
    recentAttempts: RecentAttempt[];
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

export default function Show({ topic, userStats, hasInProgress, inProgressAttemptId, recentAttempts }: ShowProps) {
    const [difficulty, setDifficulty] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(false);
    const color = getColor(topic.id);

    const bestScorePercent = userStats.best_score
        ? Math.round((userStats.best_score.correct_answers / userStats.best_score.total_questions) * 100)
        : null;

    function handleStart() {
        if (isStarting) return;
        setIsStarting(true);

        const options = difficulty
            ? { query: { difficulty } }
            : {};

        router.post(
            topics.attempts.start({ topic: topic.id }).url,
            {},
            { ...options, preserveScroll: true },
        );
    }

    function handleResume() {
        if (!inProgressAttemptId) return;
        router.visit(`/attempts/${inProgressAttemptId}`);
    }

    return (
        <>
            <Head title={topic.name} />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-4xl flex-col gap-6 p-6"
            >
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Link
                        href={competitions.index().url}
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <House className="h-3.5 w-3.5" />
                        <span>الرئيسية</span>
                    </Link>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <Link
                        href={topics.index().url}
                        className="hover:text-foreground transition-colors"
                    >
                        التدريب الحر
                    </Link>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">{topic.name}</span>
                </nav>

                {/* Hero Card */}
                <div className={cn('relative overflow-hidden rounded-xl border bg-card shadow-sm', color.border)}>
                    <div className={cn('absolute inset-0 bg-gradient-to-br', color.from, 'to-transparent')} />
                    <div className="relative p-6 sm:p-8">
                        <div className="flex items-start gap-4">
                            <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-lg', color.bg)}>
                                <BookOpen className={cn('h-6 w-6', color.icon)} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-bold">{topic.name}</h1>
                                    <VisibilityBadge visibility={topic.visibility} />
                                    <Badge variant={topic.is_active ? 'default' : 'destructive'}>
                                        {topic.is_active ? 'نشط' : 'غير نشط'}
                                    </Badge>
                                </div>
                                <p className="mt-1 font-mono text-sm text-muted-foreground" dir="ltr">{topic.code}</p>
                            </div>
                        </div>

                        {topic.description && (
                            <p className="mt-5 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                                {topic.description}
                            </p>
                        )}

                        <div className="mt-6 flex flex-wrap items-center gap-6 border-t pt-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {topic.default_questions_count} سؤال
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {topic.default_duration_minutes ? `${topic.default_duration_minutes} دقيقة` : 'بدون مؤقت'}
                            </span>
                            {bestScorePercent !== null && (
                                <span className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-warning" />
                                    أفضل نتيجة: {userStats.best_score!.correct_answers}/{userStats.best_score!.total_questions} ({bestScorePercent}%)
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Stats */}
                {userStats.total_attempts > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-lg border bg-card px-4 py-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <ChartNoAxesColumn className="h-3.5 w-3.5" />
                                <span>إجمالي المحاولات</span>
                            </div>
                            <p className="mt-1 text-lg font-semibold">{userStats.total_attempts}</p>
                        </div>
                        {userStats.last_practice_at && (
                            <div className="rounded-lg border bg-card px-4 py-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>آخر تدريب</span>
                                </div>
                                <p className="mt-1 text-sm font-medium"><DateDisplay date={userStats.last_practice_at} format="relative" /></p>
                            </div>
                        )}
                        {bestScorePercent !== null && (
                            <div className="rounded-lg border bg-card px-4 py-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Trophy className="h-3.5 w-3.5" />
                                    <span>أفضل نتيجة</span>
                                </div>
                                <p className="mt-1 text-lg font-semibold">
                                    {userStats.best_score!.correct_answers}/{userStats.best_score!.total_questions}
                                </p>
                            </div>
                        )}
                        {userStats.average_percentage !== null && (
                            <div className="rounded-lg border bg-card px-4 py-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ChartNoAxesColumn className="h-3.5 w-3.5" />
                                    <span>متوسط النتيجة</span>
                                </div>
                                <p className="mt-1 text-lg font-semibold">{userStats.average_percentage}%</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Recent Attempts */}
                <AttemptTimeline attempts={recentAttempts} hasInProgress={hasInProgress} />

                {/* Difficulty Selector */}
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <DifficultySelector value={difficulty} onChange={setDifficulty} />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    {hasInProgress ? (
                        <>
                            <Button onClick={handleResume} size="lg" className="gap-2 text-base">
                                <Play className="h-5 w-5" />
                                استئناف المحاولة
                            </Button>
                            <Button onClick={handleStart} size="lg" variant="outline" className="gap-2 text-base">
                                <RotateCcw className="h-5 w-5" />
                                بدء تدريب جديد
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleStart} disabled={isStarting} size="lg" className="gap-2 text-base">
                            <Play className="h-5 w-5" />
                            {isStarting ? 'جاري البدء...' : 'بدء التدريب'}
                        </Button>
                    )}
                </div>
            </motion.div>
        </>
    );
}
