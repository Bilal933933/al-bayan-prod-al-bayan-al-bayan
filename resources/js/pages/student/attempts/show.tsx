import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, House, List, Map } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    FILTERS,
    typeLabels,
    statusConfig,
    formatDuration,
    getDurationSeconds,
} from '@/components/attempts/AttemptHelpers';
import NavigationGrid from '@/components/attempts/NavigationGrid';
import ScoreCircle from '@/components/attempts/ScoreCircle';
import SectionBlock from '@/components/attempts/SectionBlock';
import StatBadge from '@/components/attempts/StatBadge';
import DateDisplay from '@/components/date-display';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import attempts from '@/routes/student/attempts';
import type { Attempt } from '@/types/attempt';

interface ShowProps {
    attempt: Attempt;
}

export default function Show({ attempt }: ShowProps) {
    const [filter, setFilter] = useState<string>('all');
    const [navOpen, setNavOpen] = useState(false);
    const statusInfo = statusConfig[attempt.status] ?? {
        label: attempt.status,
        classes: 'bg-muted text-muted-foreground',
    };

    const { correctCount, wrongCount, unansweredCount, percentage } =
        useMemo(() => {
            const correct = attempt.sections.reduce(
                (acc, s) =>
                    acc +
                    s.questions.filter((q) => q.is_correct === true).length,
                0,
            );
            const wrong = attempt.sections.reduce(
                (acc, s) =>
                    acc +
                    s.questions.filter((q) => q.is_correct === false).length,
                0,
            );
            const unanswered = attempt.sections.reduce(
                (acc, s) =>
                    acc +
                    s.questions.filter((q) => q.is_correct === null).length,
                0,
            );
            const pct =
                attempt.total_questions > 0
                    ? Math.round((correct / attempt.total_questions) * 100)
                    : 0;

            return {
                correctCount: correct,
                wrongCount: wrong,
                unansweredCount: unanswered,
                percentage: pct,
            };
        }, [attempt.sections, attempt.total_questions]);

    const durationSeconds = useMemo(
        () => getDurationSeconds(attempt.started_at, attempt.finished_at),
        [attempt.started_at, attempt.finished_at],
    );

    const { allQuestions, filteredNavQuestions } = useMemo(() => {
        const all = attempt.sections.flatMap((s) =>
            s.questions.map((q) => ({
                question_id: q.question_id,
                is_correct: q.is_correct,
                order: q.order,
            })),
        );

        const filteredIds = new Set(
            attempt.sections.flatMap((s) => {
                const qs = s.questions.filter((q) => {
                    if (filter === 'wrong') {
                        return q.is_correct === false;
                    }

                    if (filter === 'unanswered') {
                        return q.is_correct === null;
                    }

                    return true;
                });

                return qs.map((q) => q.question_id);
            }),
        );

        return {
            allQuestions: all,
            filteredNavQuestions: all.filter((q) =>
                filteredIds.has(q.question_id),
            ),
        };
    }, [attempt.sections, filter]);

    const sidebarContent = (
        <>
            <div className="flex flex-col items-center gap-4 py-6">
                <ScoreCircle percentage={percentage} />
                <div className="flex items-center justify-center gap-5">
                    <StatBadge
                        count={correctCount}
                        label="صحيحة"
                        color="text-success"
                    />
                    <StatBadge
                        count={wrongCount}
                        label="خاطئة"
                        color="text-destructive"
                    />
                    {unansweredCount > 0 && (
                        <StatBadge
                            count={unansweredCount}
                            label="لم تُجب"
                            color="text-muted-foreground"
                        />
                    )}
                </div>
            </div>

            <NavigationGrid
                questions={filteredNavQuestions}
                allQuestions={allQuestions}
                onQuestionClick={() => setNavOpen(false)}
            />
        </>
    );

    return (
        <>
            <Head title={`مراجعة ${typeLabels[attempt.type] ?? 'محاولة'}`} />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="min-h-screen bg-background"
            >
                <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:grid lg:grid-cols-[1fr_320px]">
                    {/* Main Content */}
                    <div className="flex flex-col gap-5">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1.5 px-5 text-sm text-muted-foreground sm:px-6">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                            >
                                <House className="h-3.5 w-3.5" />
                                <span>الرئيسية</span>
                            </Link>
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <Link
                                href={attempts.index()}
                                className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                            >
                                <List className="h-3.5 w-3.5" />
                                <span>محاولاتي</span>
                            </Link>
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span className="font-medium text-foreground">
                                مراجعة
                            </span>
                        </nav>

                        {/* Compact Hero */}
                        <div className="rounded-2xl bg-card p-5 shadow-sm ring-border/50 sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-xl font-bold sm:text-2xl">
                                        {attempt.subject_name}
                                    </h1>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <span
                                            className={cn(
                                                'rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
                                                statusInfo.classes,
                                            )}
                                        >
                                            {statusInfo.label}
                                        </span>
                                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                                            {typeLabels[attempt.type] ??
                                                attempt.type}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {attempt.total_questions} سؤال
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatDuration(durationSeconds)}
                                    </span>
                                    <span className="text-muted-foreground/50">
                                        |
                                    </span>
                                    <DateDisplay
                                        date={attempt.started_at}
                                        format="relative"
                                        showTooltip
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex items-center gap-1.5 overflow-x-auto">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilter(f.value)}
                                    className={cn(
                                        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all',
                                        filter === f.value
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-card text-muted-foreground ring-border hover:bg-muted',
                                    )}
                                >
                                    {f.label}
                                    {f.countKey && (
                                        <span
                                            className={cn(
                                                'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                                                filter === f.value
                                                    ? 'bg-primary-foreground/20'
                                                    : 'bg-muted text-muted-foreground',
                                            )}
                                        >
                                            {f.countKey === 'wrong'
                                                ? wrongCount
                                                : unansweredCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Section Blocks */}
                        {attempt.sections.map((section) => (
                            <SectionBlock
                                key={section.id}
                                section={section}
                                attempt={attempt}
                                filter={filter}
                            />
                        ))}
                    </div>

                    {/* Sidebar (Desktop) */}
                    <div className="hidden flex-col gap-5 lg:sticky lg:top-6 lg:flex lg:self-start">
                        <div className="flex flex-col items-center rounded-2xl bg-card shadow-sm ring-border/50">
                            {sidebarContent}
                        </div>
                    </div>
                </div>

                {/* Mobile FAB + Sheet */}
                <div className="fixed right-6 bottom-6 z-50 lg:hidden">
                    <Sheet open={navOpen} onOpenChange={setNavOpen}>
                        <SheetTrigger asChild>
                            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                                <Map className="h-5 w-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="rounded-t-2xl">
                            <div className="pb-4">{sidebarContent}</div>
                        </SheetContent>
                    </Sheet>
                </div>
            </motion.div>
        </>
    );
}
