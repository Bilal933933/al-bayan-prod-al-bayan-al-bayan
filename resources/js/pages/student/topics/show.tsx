import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    ChartNoAxesColumn,
    ChevronLeft,
    Clock,
    House,
    Play,
    RotateCcw,
    Sparkles,
    Target,
    Trophy,
} from 'lucide-react';
import VisibilityBadge from '@/components/admin/topics/visibility-badge';
import DateDisplay from '@/components/date-display';
import { AttemptTimeline } from '@/components/student/topics/attempt-timeline';
import { getColor } from '@/components/student/topics/topic-colors';
import TopicDifficultyBars from '@/components/student/topics/topic-difficulty-bars';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import attempts from '@/routes/student/attempts';
import competitions from '@/routes/student/competitions';
import topics from '@/routes/student/topics';
import type { Topic } from '@/types/topic';

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

interface DifficultyInfo {
    count: number;
    percentage: number;
}

interface ShowProps {
    topic: Topic;
    userStats: UserStats;
    hasInProgress: boolean;
    inProgressAttemptId: number | null;
    recentAttempts: RecentAttempt[];
    difficultyDistribution: Record<string, DifficultyInfo>;
    questionsCount: number;
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
} as const;

export default function Show({
    topic,
    userStats,
    hasInProgress,
    inProgressAttemptId,
    recentAttempts,
    difficultyDistribution,
    questionsCount,
}: ShowProps) {
    const color = getColor(topic.id);

    const bestScorePercent = userStats.best_score
        ? Math.round(
              (userStats.best_score.correct_answers /
                  userStats.best_score.total_questions) *
                  100,
          )
        : null;

    const hasStats = userStats.total_attempts > 0;

    function handleStart() {
        router.visit(attempts.create({ query: { topic: topic.id } }).url);
    }

    function handleResume() {
        if (!inProgressAttemptId) {
            return;
        }

        router.visit(`/attempts/${inProgressAttemptId}`);
    }

    return (
        <>
            <Head title={topic.name} />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-4xl px-4 pt-6 pb-12 sm:px-6"
            >
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Link
                        href={competitions.index().url}
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                        <House className="h-3.5 w-3.5" />
                        <span>الرئيسية</span>
                    </Link>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <Link
                        href={topics.index().url}
                        className="transition-colors hover:text-foreground"
                    >
                        التدريب الحر
                    </Link>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">
                        {topic.name}
                    </span>
                </nav>

                {/* Hero Card */}
                <div
                    className={cn(
                        'overflow-hidden rounded-2xl border bg-card shadow-sm',
                        color.border,
                    )}
                >
                    <div
                        className={cn(
                            'bg-gradient-to-br p-6 sm:p-8',
                            color.from,
                        )}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                    نشط
                                </span>
                                <VisibilityBadge
                                    visibility={topic.visibility}
                                />
                            </div>
                            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/50 hover:bg-white/80">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-4 flex items-start gap-4">
                            <div
                                className={cn(
                                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl',
                                    color.bg,
                                )}
                            >
                                <BookOpen
                                    className={cn('h-7 w-7', color.icon)}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-2xl font-black sm:text-3xl">
                                    {topic.name}
                                </h1>
                                <p
                                    className="mt-1 font-mono text-sm text-muted-foreground"
                                    dir="ltr"
                                >
                                    {topic.code}
                                </p>
                            </div>
                        </div>
                    </div>

                    {topic.description && (
                        <div className="px-6 pt-4 pb-2 sm:px-8">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                {topic.description}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-5 border-t px-6 py-4 sm:px-8">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 text-muted-foreground/60" />
                            <span className="font-semibold">
                                {topic.default_duration_minutes
                                    ? `${topic.default_duration_minutes} دقيقة`
                                    : 'بدون مؤقت'}
                            </span>
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4 text-muted-foreground/60" />
                            <span className="font-semibold">
                                {questionsCount} سؤال
                            </span>
                        </span>
                        {bestScorePercent !== null && (
                            <span className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-sm text-amber-700">
                                <Trophy className="h-4 w-4" />
                                <span className="font-semibold">
                                    أفضل نتيجة:{' '}
                                    {userStats.best_score!.correct_answers}/
                                    {userStats.best_score!.total_questions} (
                                    {bestScorePercent}%)
                                </span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Performance Stats */}
                {hasStats && (
                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-2xl border bg-card p-5 text-center shadow-xs">
                            <p className="text-2xl font-black text-foreground">
                                {userStats.total_attempts}
                            </p>
                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                                إجمالي المحاولات
                            </p>
                        </div>
                        {userStats.average_percentage !== null && (
                            <div className="rounded-2xl border bg-card p-5 text-center shadow-xs">
                                <p className="text-2xl font-black text-foreground">
                                    {userStats.average_percentage}%
                                </p>
                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                    متوسط النتيجة
                                </p>
                            </div>
                        )}
                        {bestScorePercent !== null && (
                            <div className="rounded-2xl border bg-card p-5 text-center shadow-xs">
                                <p className="text-2xl font-black text-foreground">
                                    {userStats.best_score!.correct_answers}/
                                    {userStats.best_score!.total_questions}
                                </p>
                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                    أفضل نتيجة
                                </p>
                            </div>
                        )}
                        {userStats.last_practice_at && (
                            <div className="rounded-2xl border bg-card p-5 text-center shadow-xs">
                                <p className="text-base font-black text-foreground">
                                    <DateDisplay
                                        date={userStats.last_practice_at}
                                        format="relative"
                                    />
                                </p>
                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                    آخر تدريب
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Skills + Tips Section */}
                <div className="mt-6 rounded-2xl border bg-card p-6 shadow-xs sm:p-8">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                            <Target className="h-4 w-4 text-teal-600" />
                        </div>
                        المهارات المستهدفة
                    </h2>
                    <ul className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {[
                            'إجراء العمليات الحسابية الأربع على الأعداد الصحيحة والكسور',
                            'التعامل مع النسب المئوية وتطبيقاتها العملية',
                            'حل المسائل الكمية بخطوات منطقية متسلسلة',
                            'إدارة الوقت أثناء حل الأسئلة تحت الضغط',
                        ].map((skill, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                                {skill}
                            </li>
                        ))}
                    </ul>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                        <Sparkles className="h-4 w-4 text-teal-600" />
                        نصائح مذاكرة سريعة
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        راجع القواعد الأساسية للكسور والنسب أولاً قبل الانتقال
                        للمسائل المركبة، وتدرّب على حل الأسئلة بدون آلة حاسبة
                        لتحسين سرعتك، مع التركيز على الأسئلة متوسطة الصعوبة
                        لأنها الأكثر تكرارًا في الاختبار الفعلي.
                    </p>
                </div>

                {/* Difficulty Distribution */}
                {questionsCount > 0 && (
                    <div className="mt-6 rounded-2xl border bg-card p-6 shadow-xs sm:p-8">
                        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-foreground">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                <ChartNoAxesColumn className="h-4 w-4 text-blue-600" />
                            </div>
                            توزيع الصعوبة
                        </h2>
                        <TopicDifficultyBars
                            distribution={difficultyDistribution}
                        />
                    </div>
                )}

                {/* Recent Attempts */}
                <div className="mt-6">
                    <AttemptTimeline
                        attempts={recentAttempts}
                        hasInProgress={hasInProgress}
                    />
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    {hasInProgress ? (
                        <>
                            <Button
                                onClick={handleResume}
                                size="lg"
                                className="gap-2 text-base shadow-lg"
                            >
                                <Play className="h-5 w-5" />
                                استئناف المحاولة
                            </Button>
                            <Button
                                onClick={handleStart}
                                size="lg"
                                variant="outline"
                                className="gap-2 text-base"
                            >
                                <RotateCcw className="h-5 w-5" />
                                بدء تدريب جديد
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={handleStart}
                            size="lg"
                            className="gap-2 text-base shadow-lg"
                        >
                            <Play className="h-5 w-5" />
                            بدء التدريب
                        </Button>
                    )}
                </div>
            </motion.div>
        </>
    );
}
