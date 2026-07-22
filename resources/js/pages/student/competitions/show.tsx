import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Folder, House, Play, Loader2 } from 'lucide-react';
import { useState } from 'react';
import CompetitionCard from '@/components/student/competitions/competition-card';
import CompetitionInfoTabs from '@/components/student/competitions/competition-info-tabs';
import CompetitionShowHero from '@/components/student/competitions/competition-show-hero';
import CompetitionShowStats from '@/components/student/competitions/competition-show-stats';
import TopicCard from '@/components/student/topics/topic-card';
import competitions from '@/routes/student/competitions';
import { start as startCompetitionAttempt } from '@/routes/student/competitions/attempts';
import { show as topicShow } from '@/routes/student/topics';
import type { Competition } from '@/types/competition';
import type { TopicWithPivot } from '@/types/topic';

interface ShowProps {
    competition: Competition & { parent: Competition | null };
    children: Competition[];
    topics: TopicWithPivot[];
    is_joined: boolean;
    total_questions: number;
    total_minutes: number;
    users_count: number;
    avg_score_percentage: number | null;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, ease: 'easeOut' },
    },
} as const;

export default function Show({ competition, children, topics, is_joined, total_questions, total_minutes, users_count, avg_score_percentage }: ShowProps) {
    const [starting, setStarting] = useState(false);
    const sectionTitleClass = 'flex items-center gap-2 border-r-4 border-primary pr-3';
    const sectionIconClass = 'h-5 w-5 text-primary';
    const sectionHeadingClass = 'text-lg font-bold text-foreground';
    const emptyClass = 'rounded-2xl border border-dashed border-border bg-card py-12 text-center text-muted-foreground';

    function handleStartExam() {
        setStarting(true);
        router.post(startCompetitionAttempt.url({ competition: competition.slug }));
    }

    return (
        <>
            <Head title={competition.name} />

            <div className="min-h-screen bg-background pb-12">
                {/* Breadcrumb */}
                <div className="border-b border-border bg-card py-3 sm:py-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <nav className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-medium text-muted-foreground sm:text-sm">
                            <Link href="/" className="flex items-center gap-1 transition-colors hover:text-foreground">
                                <House className="h-3.5 w-3.5" />
                                <span>الرئيسية</span>
                            </Link>
                            <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60" />
                            <Link href="/student/competitions" className="transition-colors hover:text-foreground">
                                المسابقات
                            </Link>
                            {competition.parent && (
                                <>
                                    <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60" />
                                    <Link
                                        href={`/student/competitions/${competition.parent.slug}`}
                                        className="truncate transition-colors hover:text-foreground"
                                    >
                                        {competition.parent.name}
                                    </Link>
                                </>
                            )}
                            <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60" />
                            <span className="max-w-[200px] truncate font-semibold text-foreground sm:max-w-none">
                                {competition.name}
                            </span>
                        </nav>
                    </div>
                </div>

                {/* Hero */}
                <CompetitionShowHero competition={competition} />

                {/* Stats Cards */}
                {competition.classification !== 'container' && topics.length > 0 && (
                    <CompetitionShowStats
                        totalMinutes={total_minutes}
                        totalQuestions={total_questions}
                        usersCount={users_count}
                        avgScorePercentage={avg_score_percentage}
                    />
                )}

                {/* Content */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                    {competition.classification === 'container' ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className={sectionTitleClass}>
                                <Folder className={sectionIconClass} />
                                <h2 className={sectionHeadingClass}>المسابقات الفرعية</h2>
                            </div>

                            <div className="mt-6">
                                {children.length > 0 ? (
                                    <CompetitionCardList competitions={children} />
                                ) : (
                                    <div className={emptyClass}>
                                        لا توجد مسابقات فرعية متاحة حالياً داخل هذه الحاوية.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className={sectionTitleClass}>
                                <BookOpen className={sectionIconClass} />
                                <h2 className={sectionHeadingClass}>محاور الاختبار</h2>
                                <span className="text-sm font-normal text-muted-foreground/60">({topics.length})</span>
                            </div>

                            <div className="mt-6">
                                {topics.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {topics.map((topic) => (
                                            <TopicCard
                                                key={topic.id}
                                                id={topic.id}
                                                name={topic.name}
                                                description={topic.description}
                                                questionsCount={topic.pivot.questions_count}
                                                durationMinutes={topic.pivot.duration_minutes}
                                                userAttemptsCount={topic.user_attempts_count}
                                                hasInProgress={topic.has_in_progress}
                                                inProgressAttemptId={topic.in_progress_attempt_id}
                                                bestScore={topic.best_score}
                                                href={topicShow.url({ topic: topic.id })}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className={emptyClass}>
                                        لم يتم ربط أي محاور بهذه المسابقة بعد.
                                    </div>
                                )}
                            </div>

                            {/* Info Tabs */}
                            <div className="mt-12">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
                                        <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-foreground">معلومات عامة</h2>
                                </div>
                                <CompetitionInfoTabs />
                            </div>

                            <div className="mt-10 flex justify-center">
                                {is_joined ? (
                                    <button
                                        onClick={handleStartExam}
                                        disabled={starting}
                                        className="inline-flex items-center gap-2.5 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {starting ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <Play className="h-5 w-5 fill-white" />
                                        )}
                                        {starting ? 'جارٍ إنشاء الاختبار...' : 'ابدأ اختبار المحاكاة'}
                                    </button>
                                ) : (
                                    <Link
                                        href={competitions.join.url({ competition: competition.slug })}
                                        className="inline-flex items-center gap-2.5 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95"
                                    >
                                        الانضمام إلى المسابقة
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}

function CompetitionCardList({ competitions }: { competitions: Competition[] }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((child) => (
                <motion.div key={child.id} variants={itemVariants}>
                    <CompetitionCard competition={child} />
                </motion.div>
            ))}
        </div>
    );
}
