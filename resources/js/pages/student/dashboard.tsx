import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Clock, Trophy, Layers, ChevronRight, BookOpen, GraduationCap } from 'lucide-react';
import { AttemptCard } from '@/components/student/attempts/attempt-card';
import CompetitionCard from '@/components/student/competitions/competition-card';
import TopicCard from '@/components/student/topics/topic-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes/student';
import attempts from '@/routes/student/attempts';
import competitions from '@/routes/student/competitions';
import topics from '@/routes/student/topics';
import type { Attempt } from '@/types/attempt';
import type { Competition } from '@/types/competition';
import type { Topic } from '@/types/topic';

interface InProgressAttempt extends Attempt {
    topic?: { id: number; name: string } | null;
    competition?: { id: number; name: string } | null;
}

interface DashboardProps {
    inProgressAttempt: InProgressAttempt | null;
    recentAttempts: Attempt[];
    stats: {
        total_attempts: number;
        completed_attempts: number;
        in_progress_attempts: number;
        average_percentage: number | null;
    };
    activeCompetitions: (Competition & { topics_count: number })[];
    recommendedTopics: (Topic & { questions_count: number })[];
    recentCompetitions: (Competition & { topics_count: number })[];
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Dashboard({
    inProgressAttempt,
    recentAttempts,
    stats,
    activeCompetitions,
    recommendedTopics,
    recentCompetitions,
}: DashboardProps) {
    const handleContinueAttempt = () => {
        if (inProgressAttempt) {
            router.visit(attempts.show({ attempt: inProgressAttempt.id }).url);
        }
    };

    const handleStartNewAttempt = (attempt: InProgressAttempt) => {
        if (!confirm('لديك محاولة جارية. هل تريد بدء محاولة جديدة بدلاً من استئناف الحالية؟')) {
            return;
        }

        router.visit(attempts.show({ attempt: attempt.id }).url);
    };

    return (
        <>
            <Head title="لوحة التحكم" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6"
            >
                {/* Quick Action Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href={attempts.create().url}
                        className="group relative flex items-start gap-4 rounded-xl border-2 border-muted bg-card p-5 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">تدريب حر</h3>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                اختر محوراً وتدرب على أسئلته بمستوى الصعوبة الذي تختاره
                            </p>
                        </div>
                        <ChevronRight className="mr-auto mt-3 h-5 w-5 text-muted-foreground shrink-0" />
                    </Link>

                    <Link
                        href={attempts.create().url}
                        className="group relative flex items-start gap-4 rounded-xl border-2 border-muted bg-card p-5 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">اختبار محاكاة</h3>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                شارك في مسابقة بمحاور متعددة ووقت محدد
                            </p>
                        </div>
                        <ChevronRight className="mr-auto mt-3 h-5 w-5 text-muted-foreground shrink-0" />
                    </Link>
                </div>

                {/* In-Progress Attempt Banner */}
                {inProgressAttempt && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5"
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                                    <Clock className="h-7 w-7" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">لديك محاولة جارية</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {inProgressAttempt.topic?.name ?? inProgressAttempt.competition?.name ?? 'محاولة غير محددة'}
                                        {' '}
                                        <span className="font-mono">
                                            {inProgressAttempt.sections?.[0]?.questions_count ?? 0} سؤال
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button onClick={handleContinueAttempt} size="lg" className="gap-2">
                                    <Play className="h-4 w-4" />
                                    استئناف المحاولة
                                </Button>
                                <Button variant="outline" onClick={() => handleStartNewAttempt(inProgressAttempt)} className="gap-2">
                                    <RotateCcw className="h-4 w-4" />
                                    محاولة جديدة
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={Layers}
                        label="إجمالي المحاولات"
                        value={stats.total_attempts}
                        iconColor="text-blue-600"
                        bgColor="bg-blue-50 dark:bg-blue-900/20"
                    />
                    <StatCard
                        icon={Trophy}
                        label="المحاولات المكتملة"
                        value={stats.completed_attempts}
                        iconColor="text-emerald-600"
                        bgColor="bg-emerald-50 dark:bg-emerald-900/20"
                    />
                    <StatCard
                        icon={Play}
                        label="قيد التنفيذ"
                        value={stats.in_progress_attempts}
                        iconColor="text-amber-600"
                        bgColor="bg-amber-50 dark:bg-amber-900/20"
                    />
                    <StatCard
                        icon={Trophy}
                        label="متوسط النتيجة"
                        value={stats.average_percentage !== null ? `${stats.average_percentage}%` : '—'}
                        iconColor="text-purple-600"
                        bgColor="bg-purple-50 dark:bg-purple-900/20"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                    {/* Main Content */}
                    <div className="flex flex-col gap-6">
                        {/* Recent Attempts */}
                        {recentAttempts.length > 0 && (
                            <SectionHeader title="آخر المحاولات" href={attempts.index().url} />
                        )}

                        {recentAttempts.length > 0 ? (
                            <div className="space-y-3">
                                {recentAttempts.map((attempt) => (
                                    <AttemptCard
                                        key={attempt.id}
                                        attempt={attempt}
                                        href={attempts.show({ attempt: attempt.id }).url}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Layers}
                                title="لا توجد محاولات سابقة"
                                description="ابدأ تدريباً أو شارك في مسابقة لتظهر محاولاتك هنا"
                                actionLabel="استكشاف المسابقات"
                                actionHref={competitions.index().url}
                            />
                        )}

                        {/* Recommended Topics */}
                        {recommendedTopics.length > 0 && (
                            <>
                                <SectionHeader title="مقترحة للتدريب" href={topics.index().url} />
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {recommendedTopics.map((topic) => (
                                        <TopicCard
                                            key={topic.id}
                                            id={topic.id}
                                            name={topic.name}
                                            description={topic.description}
                                            questionsCount={topic.questions_count}
                                            durationMinutes={topic.default_duration_minutes}
                                            href={topics.show({ topic: topic.id }).url}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
                        {/* Active Competitions */}
                        {activeCompetitions.length > 0 && (
                            <SectionHeader title="مسابقات نشطة" />
                        )}

                        {activeCompetitions.length > 0 ? (
                            <div className="space-y-3">
                                {activeCompetitions.map((competition) => (
                                    <CompetitionCard key={competition.id} competition={competition} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Layers}
                                title="لا توجد مسابقات نشطة"
                                description="تحقق لاحقاً للمسابقات القادمة"
                            />
                        )}

                        {/* Recent Competitions */}
                        {recentCompetitions.length > 0 && (
                            <>
                                <SectionHeader title="مسابقاتك الأخيرة" href={competitions.index().url} />
                                <div className="space-y-3">
                                    {recentCompetitions.map((competition) => (
                                        <CompetitionCard key={competition.id} competition={competition} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    iconColor,
    bgColor,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    iconColor: string;
    bgColor: string;
}) {
    return (
        <Card className={cn('relative overflow-hidden', bgColor)}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
                    </div>
                    <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', iconColor, bgColor.replace('bg-', 'bg-').replace('/20', '/30'))}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function SectionHeader({ title, href }: { title: string; href?: string }) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            {href && (
                <Link
                    href={href}
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                    عرض الكل
                    <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            )}
        </div>
    );
}

function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <Icon className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-muted-foreground">{title}</p>
            <p className="text-sm text-muted-foreground/60 max-w-xs">{description}</p>
            {actionLabel && actionHref && (
                <Link href={actionHref}>
                    <Button variant="outline" size="sm" className="mt-2 gap-1.5">
                        {actionLabel}
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </Link>
            )}
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'لوحة التحكم',
            href: dashboard(),
        },
    ],
};
