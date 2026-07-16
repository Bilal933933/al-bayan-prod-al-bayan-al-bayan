import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, House, List, Map, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    FILTERS,
    formatDuration,
    getDurationSeconds,
    statusConfig,
    typeLabels,
} from '@/components/attempts/AttemptHelpers';
import NavigationGrid from '@/components/attempts/NavigationGrid';
import ScoreCircle from '@/components/attempts/ScoreCircle';
import SectionBlock from '@/components/attempts/SectionBlock';
import StatBadge from '@/components/attempts/StatBadge';
import AttemptUserCard from '@/components/admin/attempts/attempt-user-card';
import DateDisplay from '@/components/date-display';
import DeleteDialog from '@/components/delete-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { dashboard } from '@/routes';
import attempts from '@/routes/admin/attempts';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import type { Attempt } from '@/types/attempt';

interface ShowProps {
    attempt: Attempt;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المحاولات', href: attempts.index() },
    { title: 'عرض', href: '#' },
];

export default function Show({ attempt }: ShowProps) {
    const [filter, setFilter] = useState<string>('all');
    const [navOpen, setNavOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const statusInfo = statusConfig[attempt.status] ?? { label: attempt.status, classes: 'bg-gray-100 text-gray-600' };

    const correctCount = attempt.sections.reduce((acc, s) => acc + s.questions.filter((q) => q.is_correct === true).length, 0);
    const wrongCount = attempt.sections.reduce((acc, s) => acc + s.questions.filter((q) => q.is_correct === false).length, 0);
    const unansweredCount = attempt.sections.reduce((acc, s) => acc + s.questions.filter((q) => q.is_correct === null).length, 0);
    const percentage = attempt.total_questions > 0 ? Math.round((correctCount / attempt.total_questions) * 100) : 0;

    const durationSeconds = getDurationSeconds(attempt.started_at, attempt.finished_at);

    const allQuestions = attempt.sections.flatMap((s) =>
        s.questions.map((q) => ({ question_id: q.question_id, is_correct: q.is_correct, order: q.order })),
    );

    const filteredQuestionIds = new Set(
        attempt.sections.flatMap((s) => {
            const qs = s.questions.filter((q) => {
                if (filter === 'wrong') return q.is_correct === false;
                if (filter === 'unanswered') return q.is_correct === null;
                return true;
            });
            return qs.map((q) => q.question_id);
        }),
    );

    const filteredNavQuestions = allQuestions.filter((q) => filteredQuestionIds.has(q.question_id));

    function handleDelete() {
        setDeleting(true);
        router.delete(attempts.destroy({ attempt: attempt.id }).url, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteOpen(false);
            },
        });
    }

    const sidebarContent = (
        <>
            <div className="flex flex-col items-center gap-4 py-6">
                <ScoreCircle percentage={percentage} />
                <div className="flex items-center justify-center gap-5">
                    <StatBadge count={correctCount} label="صحيحة" color="text-emerald-600" />
                    <StatBadge count={wrongCount} label="خاطئة" color="text-rose-600" />
                    {unansweredCount > 0 && (
                        <StatBadge count={unansweredCount} label="لم تُجب" color="text-slate-400" />
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
            <Head title={`عرض محاولة #${attempt.id}`} />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="min-h-screen bg-slate-50"
            >
                <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:grid lg:grid-cols-[1fr_320px]">
                    <div className="flex flex-col gap-5">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1.5 px-5 text-sm text-muted-foreground sm:px-6">
                            <Link href={dashboard()} className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
                                <House className="h-3.5 w-3.5" />
                                <span>لوحة التحكم</span>
                            </Link>
                            <span className="text-slate-300">/</span>
                            <Link href={attempts.index()} className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
                                <List className="h-3.5 w-3.5" />
                                <span>المحاولات</span>
                            </Link>
                            <span className="text-slate-300">/</span>
                            <span className="font-medium text-foreground">عرض محاولة #{attempt.id}</span>
                        </nav>

                        {/* Header */}
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <Heading title={`عرض محاولة #${attempt.id}`} description={`${attempt.user?.name ?? '—'} - ${attempt.subject_name}`} />
                            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                                <Trash2 className="h-4 w-4" />
                                حذف
                            </Button>
                        </div>

                        {/* User Card */}
                        {attempt.user && <AttemptUserCard user={attempt.user} />}

                        {/* Hero */}
                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/50 sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-xl font-bold sm:text-2xl">{attempt.subject_name}</h1>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <span className={cn('rounded-full border px-2.5 py-0.5 text-[11px] font-medium', statusInfo.classes)}>
                                            {statusInfo.label}
                                        </span>
                                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                                            {typeLabels[attempt.type] ?? attempt.type}
                                        </span>
                                        <span className="text-xs text-slate-400">{attempt.total_questions} سؤال</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatDuration(durationSeconds)}
                                    </span>
                                    <span className="text-slate-300">|</span>
                                    <DateDisplay date={attempt.started_at} format="full" />
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
                                        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all',
                                        filter === f.value
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
                                    )}
                                >
                                    {f.label}
                                    {f.countKey && (
                                        <span
                                            className={cn(
                                                'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                                                filter === f.value ? 'bg-white/20' : 'bg-slate-100 text-slate-500',
                                            )}
                                        >
                                            {f.countKey === 'wrong' ? wrongCount : unansweredCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Section Blocks */}
                        {attempt.sections.map((section) => (
                            <SectionBlock key={section.id} section={section} attempt={attempt} filter={filter} />
                        ))}
                    </div>

                    {/* Sidebar (Desktop) */}
                    <div className="hidden flex-col gap-5 lg:sticky lg:top-6 lg:flex lg:self-start">
                        <div className="flex flex-col items-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                            {sidebarContent}
                        </div>
                    </div>
                </div>

                {/* Mobile FAB + Sheet */}
                <div className="fixed bottom-6 right-6 z-50 lg:hidden">
                    <Sheet open={navOpen} onOpenChange={setNavOpen}>
                        <SheetTrigger asChild>
                            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                                <Map className="h-5 w-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="rounded-t-2xl">
                            <div className="pb-4">
                                {sidebarContent}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </motion.div>

            <DeleteDialog
                open={deleteOpen}
                onOpenChange={(open) => { if (!open) setDeleteOpen(false); }}
                description="هل أنت متأكد من حذف هذه المحاولة؟ هذا الإجراء لا يمكن التراجع عنه."
                onDelete={handleDelete}
                processing={deleting}
            />
        </>
    );
}

Show.layout = {
    breadcrumbs,
};
