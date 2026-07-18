import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, History } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AttemptCard } from '@/components/student/attempts/attempt-card';
import { AttemptStatsBar } from '@/components/student/attempts/attempt-stats-bar';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import attempts from '@/routes/student/attempts';
import type { Attempt } from '@/types/attempt';
import type { PaginationLink, PaginationMeta } from '@/types/pagination';
import { cn } from '@/lib/utils';

interface AttemptStats {
    total: number;
    completed: number;
    in_progress: number;
    average_percentage: number | null;
}

interface IndexProps {
    attempts: {
        data: Attempt[];
        meta: PaginationMeta;
        links: PaginationLink[];
    };
    filters: {
        type: string | null;
    };
    stats: AttemptStats;
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

const typeLabels: Record<string, string> = {
    practice: 'تدريب',
    exam: 'محاكاة',
};

const filterTabs = [
    { key: null, label: 'الكل' },
    { key: 'practice', label: 'تدريب' },
    { key: 'exam', label: 'محاكاة' },
] as const;

function getGroupKey(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'اليوم';
    if (diffDays <= 7) return 'هذا الأسبوع';
    if (diffDays <= 30) return 'هذا الشهر';
    if (diffDays <= 60) return 'الشهر الماضي';

    return 'أقدم';
}

const groupOrder = ['اليوم', 'هذا الأسبوع', 'هذا الشهر', 'الشهر الماضي', 'أقدم'];

export default function Index({ attempts: paginated, filters, stats }: IndexProps) {
    const [search, setSearch] = useState('');

    const grouped = useMemo(() => {
        const filtered = paginated.data.filter((a) => {
            if (!search.trim()) return true;
            const q = search.trim().toLowerCase();
            return a.subject_name.toLowerCase().includes(q);
        });

        const groups: Record<string, Attempt[]> = {};
        for (const attempt of filtered) {
            const key = getGroupKey(attempt.started_at);
            if (!groups[key]) groups[key] = [];
            groups[key].push(attempt);
        }

        return Object.entries(groups).sort(
            ([a], [b]) => groupOrder.indexOf(a) - groupOrder.indexOf(b),
        );
    }, [paginated.data, search]);

    function handleFilterChange(type: string | null) {
        router.get(
            attempts.index().url,
            { ...(type ? { type } : {}) },
            { preserveScroll: true, preserveState: true },
        );
    }

    const hasInProgress = paginated.data.some((a) => a.status === 'in_progress');

    return (
        <>
            <Head title="محاولاتي" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-4xl flex-col gap-6 p-6"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">محاولاتي</h1>
                        <p className="mt-1 text-muted-foreground">
                            سجل جميع محاولاتك السابقة
                        </p>
                    </div>
                </div>

                <AttemptStatsBar stats={stats} />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ابحث باسم المحاولة..."
                        className="h-9 max-w-xs"
                    />

                    <div className="flex gap-1 rounded-lg bg-muted p-1">
                        {filterTabs.map((tab) => {
                            const isActive = filters.type === tab.key;
                            return (
                                <Button
                                    key={tab.key ?? 'all'}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleFilterChange(tab.key)}
                                    className={cn(
                                        'relative flex-1 text-sm',
                                        isActive && 'bg-background shadow-xs',
                                    )}
                                >
                                    {tab.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {paginated.data.length === 0 ? (
                    <EmptyState
                        icon={History}
                        title={filters.type
                            ? `لا توجد محاولات ${typeLabels[filters.type] ?? ''} سابقة`
                            : 'لا توجد محاولات سابقة'}
                        description="ابدأ تدريباً حراً أو شارك في مسابقة لتظهر محاولاتك هنا"
                        actionLabel="ابدأ التدريب"
                        actionHref={attempts.create().url}
                        className="py-20"
                    />
                ) : grouped.length === 0 ? (
                    <EmptyState
                        icon={History}
                        title="لا توجد نتائج للبحث"
                        description="حاول تغيير كلمة البحث"
                        className="py-16"
                    />
                ) : (
                    <div className="space-y-6">
                        {hasInProgress && (
                            <section>
                                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-warning">
                                    <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                                    نشط
                                </h2>
                                <div className="space-y-2">
                                    {paginated.data
                                        .filter((a) => a.status === 'in_progress')
                                        .map((attempt) => (
                                            <AttemptCard
                                                key={attempt.id}
                                                attempt={attempt}
                                                href={attempts.show({ attempt: attempt.id }).url}
                                            />
                                        ))}
                                </div>
                            </section>
                        )}

                        {grouped.map(([groupName, groupAttempts]) => {
                            if (groupName === 'اليوم' && hasInProgress) {
                                const completedToday = groupAttempts.filter(
                                    (a) => a.status !== 'in_progress',
                                );
                                if (completedToday.length === 0) return null;
                                return (
                                    <section key={groupName}>
                                        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                                            {groupName}
                                        </h2>
                                        <div className="space-y-2">
                                            {completedToday.map((attempt) => (
                                                <AttemptCard
                                                    key={attempt.id}
                                                    attempt={attempt}
                                                    href={attempts.show({ attempt: attempt.id }).url}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                );
                            }

                            return (
                                <section key={groupName}>
                                    <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                                        {groupName}
                                    </h2>
                                    <div className="space-y-2">
                                        {groupAttempts.map((attempt) => (
                                            <AttemptCard
                                                key={attempt.id}
                                                attempt={attempt}
                                                href={attempts.show({ attempt: attempt.id }).url}
                                            />
                                        ))}
                                    </div>
                                </section>
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
