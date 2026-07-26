import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Flag, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReportTable from '@/components/admin/reports/report-table';
import Heading from '@/components/heading';
import { LaravelPagination } from '@/components/laravel-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes/admin';
import reports from '@/routes/admin/reports';
import type { BreadcrumbItem } from '@/types';
import type { PaginationMeta } from '@/types/pagination';
import type { ReportItem } from '@/types/report';

interface IndexProps {
    reports: {
        data: ReportItem[];
    } & PaginationMeta;
    sort: string;
    direction: string;
    search: string;
    statusFilter: string;
    stats: {
        total: number;
        pending: number;
        reviewed: number;
        resolved: number;
        rejected: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'البلاغات', href: reports.index() },
];

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const statVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.25 },
    }),
};

const statCards = [
    {
        icon: Flag,
        label: 'إجمالي',
        key: 'total' as const,
        color: '#3b82f6',
        bg: 'bg-blue-500/10',
    },
    {
        icon: Flag,
        label: 'قيد المراجعة',
        key: 'pending' as const,
        color: '#f59e0b',
        bg: 'bg-amber-500/10',
    },
    {
        icon: Flag,
        label: 'تمت المراجعة',
        key: 'reviewed' as const,
        color: '#8b5cf6',
        bg: 'bg-purple-500/10',
    },
    {
        icon: Flag,
        label: 'تم العلاج',
        key: 'resolved' as const,
        color: '#22c55e',
        bg: 'bg-green-500/10',
    },
    {
        icon: Flag,
        label: 'غير مقبول',
        key: 'rejected' as const,
        color: '#ef4444',
        bg: 'bg-red-500/10',
    },
];

function navigateWithParams(overrides: Record<string, string | undefined>) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined || value === '') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
    }

    router.visit(url.pathname + '?' + params.toString(), {
        preserveState: true,
        preserveScroll: true,
    });
}

export default function Index({
    reports: reportsPage,
    sort = 'created_at',
    direction = 'desc',
    search: currentSearch = '',
    statusFilter = 'all',
    stats,
}: IndexProps) {
    const [searchInput, setSearchInput] = useState(currentSearch || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== currentSearch) {
                navigateWithParams({
                    search: searchInput || undefined,
                    page: '1',
                });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput, currentSearch]);

    const allReports = reportsPage.data;

    const filterTabs: { value: string; label: string }[] = [
        { value: 'all', label: 'الكل' },
        { value: 'pending', label: 'قيد المراجعة' },
        { value: 'reviewed', label: 'تمت المراجعة' },
        { value: 'resolved', label: 'تم العلاج' },
        { value: 'rejected', label: 'غير مقبول' },
    ];

    return (
        <>
            <Head title="البلاغات" />
            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-1 flex-col gap-5 p-6"
            >
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Heading
                        title="البلاغات"
                        description="إدارة بلاغات الطلاب"
                    />
                </div>

                <div className="grid grid-cols-5 gap-3">
                    {statCards.map((stat, i) => (
                        <motion.div
                            key={stat.key}
                            custom={i}
                            variants={statVariants}
                            initial="hidden"
                            animate="visible"
                            className="rounded-lg border bg-card p-3"
                            style={{
                                borderInlineStart: `3px solid ${stat.color}`,
                            }}
                        >
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <stat.icon
                                    className="h-4 w-4"
                                    style={{ color: stat.color }}
                                />
                                <span className="text-xs">{stat.label}</span>
                            </div>
                            <p className="mt-1 text-2xl font-bold">
                                {stats?.[stat.key] ?? 0}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="بحث بالوصف أو اسم المرسل..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pe-9"
                        />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {filterTabs.map((tab) => (
                            <Button
                                key={tab.value}
                                variant={
                                    statusFilter === tab.value
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                    navigateWithParams({
                                        status:
                                            tab.value === 'all'
                                                ? undefined
                                                : tab.value,
                                        page: '1',
                                    })
                                }
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <ReportTable
                    reports={allReports}
                    meta={reportsPage}
                    searchQuery={currentSearch}
                    sort={sort}
                    direction={direction}
                />
                {allReports.length > 0 && (
                    <LaravelPagination meta={reportsPage} />
                )}
            </motion.div>
        </>
    );
}

Index.layout = {
    breadcrumbs,
};
