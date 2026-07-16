import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Folder, House, Play, Loader2 } from 'lucide-react';
import { useState } from 'react';
import CompetitionCard from '@/components/student/competitions/competition-card';
import CompetitionShowHero from '@/components/student/competitions/competition-show-hero';
import TopicCard from '@/components/student/topics/topic-card';
import { show as topicShow } from '@/routes/student/topics';
import { start as startCompetitionAttempt } from '@/routes/student/competitions/attempts';
import type { Competition } from '@/types/competition';
import type { TopicWithPivot } from '@/types/topic';

interface ShowProps {
    competition: Competition & { parent: Competition | null };
    children: Competition[];
    topics: TopicWithPivot[];
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
};

export default function Show({ competition, children, topics }: ShowProps) {
    const [starting, setStarting] = useState(false);
    const sectionTitleClass = 'flex items-center gap-2 border-r-4 border-primary pr-3';
    const sectionIconClass = 'h-5 w-5 text-primary';
    const sectionHeadingClass = 'text-lg font-bold text-slate-800';
    const emptyClass = 'rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-400';

    function handleStartExam() {
        setStarting(true);
        router.post(startCompetitionAttempt.url({ competition }));
    }

    return (
        <>
            <Head title={competition.name} />

            <div className="min-h-screen bg-slate-50 pb-12">
                {/* Breadcrumb */}
                <div className="border-b border-slate-200 bg-white py-3">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-sm">
                            <Link href="/" className="flex items-center gap-1 transition-colors hover:text-slate-800">
                                <House className="h-3.5 w-3.5" />
                                <span>الرئيسية</span>
                            </Link>
                            <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
                            <Link href="/student/competitions" className="transition-colors hover:text-slate-800">
                                المسابقات
                            </Link>
                            {competition.parent && (
                                <>
                                    <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
                                    <Link
                                        href={`/student/competitions/${competition.parent.id}`}
                                        className="truncate transition-colors hover:text-slate-800"
                                    >
                                        {competition.parent.name}
                                    </Link>
                                </>
                            )}
                            <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
                            <span className="max-w-[200px] truncate font-semibold text-slate-900 sm:max-w-none">
                                {competition.name}
                            </span>
                        </nav>
                    </div>
                </div>

                {/* Hero */}
                <CompetitionShowHero competition={competition} />

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
                                <span className="text-sm font-normal text-slate-400">({topics.length})</span>
                            </div>

                            <div className="mt-6">
                                {topics.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

                            <div className="mt-10 flex justify-center">
                                <button
                                    onClick={handleStartExam}
                                    disabled={starting}
                                    className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-200/50 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-200/60 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {starting ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Play className="h-5 w-5 fill-white" />
                                    )}
                                    {starting ? 'جارٍ إنشاء الاختبار...' : 'ابدأ اختبار المحاكاة'}
                                </button>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((child) => (
                <motion.div key={child.id} variants={itemVariants}>
                    <CompetitionCard competition={child} />
                </motion.div>
            ))}
        </div>
    );
}
