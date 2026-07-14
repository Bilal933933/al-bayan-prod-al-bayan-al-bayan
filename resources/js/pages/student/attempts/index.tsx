import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, History, Layers, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import attempts from '@/routes/student/attempts';
import type { Attempt } from '@/types/attempt';
import type { PaginationLink, PaginationMeta } from '@/types/pagination';

interface IndexProps {
    attempts: {
        data: Attempt[];
        meta: PaginationMeta;
        links: PaginationLink[];
    };
    filters: {
        type: string | null;
    };
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

const typeBadgeVariants: Record<string, 'default' | 'secondary'> = {
    practice: 'secondary',
    exam: 'default',
};

const typeLabels: Record<string, string> = {
    practice: 'تدريب',
    exam: 'محاكاة',
};

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    in_progress: { label: 'قيد التنفيذ', variant: 'default' },
    completed: { label: 'مكتمل', variant: 'secondary' },
    abandoned: { label: 'ملغي', variant: 'outline' },
};

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Index({ attempts: paginated, filters }: IndexProps) {
    function handleFilterChange(type: string | null) {
        router.get(
            attempts.index().url,
            { ...(type ? { type } : {}) },
            { preserveScroll: true, preserveState: true },
        );
    }

    return (
        <>
            <Head title="محاولاتي" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">محاولاتي</h1>
                        <p className="mt-1 text-muted-foreground">
                            سجل جميع محاولاتك السابقة
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {[null, 'practice', 'exam'].map((value) => (
                            <Button
                                key={value ?? 'all'}
                                variant={filters.type === value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange(value)}
                            >
                                {value === null ? 'الكل' : typeLabels[value]}
                            </Button>
                        ))}
                    </div>
                </div>

                {paginated.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
                        <History className="mb-2 h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                            {filters.type
                                ? `لا توجد محاولات ${
                                      typeLabels[filters.type] ?? ''
                                  } سابقة`
                                : 'لا توجد محاولات سابقة'}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                            ابدأ تدريباً حراً أو شارك في مسابقة لتظهر محاولاتك هنا
                        </p>
                    </div>
                ) : (
                    <div className="divide-y overflow-hidden rounded-xl border">
                        {paginated.data.map((attempt) => {
                            const statusInfo = statusLabels[attempt.status] ?? {
                                label: attempt.status,
                                variant: 'outline',
                            };

                            return (
                                <div
                                    key={attempt.id}
                                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                                >
                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge
                                                variant={
                                                    typeBadgeVariants[
                                                        attempt.type
                                                    ] ?? 'outline'
                                                }
                                            >
                                                {typeLabels[attempt.type] ?? attempt.type}
                                            </Badge>
                                            <Badge variant={statusInfo.variant}>
                                                {statusInfo.label}
                                            </Badge>
                                            <span className="text-sm font-medium">
                                                {attempt.subject_name}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <span className="inline-flex items-center gap-1">
                                                <Trophy className="h-3.5 w-3.5" />
                                                {attempt.correct_answers} / {attempt.total_questions}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {formatDate(attempt.started_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href={attempts.show({ attempt: attempt.id }).url}
                                        className="shrink-0"
                                    >
                                        <Button variant="outline" size="sm">
                                            {attempt.status === 'in_progress'
                                                ? 'متابعة'
                                                : 'عرض النتيجة'}
                                        </Button>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}

                {paginated.meta && paginated.meta.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1" dir="ltr">
                        {paginated.meta.prev_page_url && (
                            <Link href={paginated.meta.prev_page_url} preserveScroll>
                                <Button variant="outline" size="sm">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        {paginated.links?.filter(l => !['&laquo; Previous', '&raquo; Next'].includes(l.label)).map((link) => (
                            <Link
                                key={link.label}
                                href={link.url ?? '#'}
                                preserveScroll
                                preserveState
                            >
                                <Button
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    className="min-w-[36px]"
                                >
                                    {link.label}
                                </Button>
                            </Link>
                        ))}
                        {paginated.meta.next_page_url && (
                            <Link href={paginated.meta.next_page_url} preserveScroll>
                                <Button variant="outline" size="sm">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </motion.div>
        </>
    );
}
