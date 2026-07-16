import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Globe, Lock, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import TopicTable from '@/components/admin/topics/topic-table';
import Heading from '@/components/heading';
import { LaravelPagination } from '@/components/laravel-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes/admin';
import topics from '@/routes/admin/topics';
import type { BreadcrumbItem } from '@/types';
import type { PaginationMeta } from '@/types/pagination';
import type { Topic } from '@/types/topic';

export type TopicsVisibilityFilter = 'all' | 'general' | 'private';

interface IndexProps {
    topics: {
        data: Topic[];
    } & PaginationMeta;
    sort: string;
    direction: string;
    search: string;
    filter: TopicsVisibilityFilter;
    stats: {
        total: number;
        active: number;
        general: number;
        private_: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المحاور', href: topics.index() },
];

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const statVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.25 } }),
};

const statCards = [
    { icon: BookOpen, label: 'إجمالي', key: 'total' as const, color: '#3b82f6' },
    { icon: CheckCircle, label: 'نشط', key: 'active' as const, color: '#22c55e' },
    { icon: Globe, label: 'عام', key: 'general' as const, color: '#8b5cf6' },
    { icon: Lock, label: 'خاص', key: 'private_' as const, color: '#f59e0b' },
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
    topics: topicsPage,
    sort = 'created_at',
    direction = 'desc',
    search: currentSearch = '',
    filter = 'all',
    stats,
}: IndexProps) {
    const [searchInput, setSearchInput] = useState(currentSearch);

    useEffect(() => {
        setSearchInput(currentSearch);
    }, [currentSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== currentSearch) {
                navigateWithParams({ search: searchInput || undefined, page: '1' });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput, currentSearch]);

    const allTopics = topicsPage.data;

    const filterTabs: { value: TopicsVisibilityFilter; label: string }[] = [
        { value: 'all', label: 'الكل' },
        { value: 'general', label: 'عام' },
        { value: 'private', label: 'خاص' },
    ];

    return (
        <>
            <Head title="المحاور" />
            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-1 flex-col gap-5 p-6"
            >
                {/* رأس الصفحة */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Heading title="المحاور" description="إدارة محاور الاختبارات" />
                    <Link href={topics.create().url} className="shrink-0">
                        <Button>إضافة محور</Button>
                    </Link>
                </div>

                {/* بطاقات الإحصائيات */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {statCards.map((stat, i) => (
                        <motion.div
                            key={stat.key}
                            custom={i}
                            variants={statVariants}
                            initial="hidden"
                            animate="visible"
                            className="rounded-lg border bg-card p-3"
                            style={{ borderInlineStart: `3px solid ${stat.color}` }}
                        >
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                                <span className="text-xs">{stat.label}</span>
                            </div>
                            <p className="mt-1 text-2xl font-bold">{stats?.[stat.key] ?? topicsPage.total}</p>
                        </motion.div>
                    ))}
                </div>

                {/* شريط البحث والتصفية */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="بحث بالاسم أو الكود..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pe-9"
                        />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {filterTabs.map((tab) => (
                            <Button
                                key={tab.value}
                                variant={filter === tab.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => navigateWithParams({ filter: tab.value === 'all' ? undefined : tab.value, page: '1' })}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* الجدول */}
                <TopicTable
                    topics={allTopics}
                    meta={topicsPage}
                    searchQuery={currentSearch}
                    activeFilter={filter}
                    sort={sort}
                    direction={direction}
                />
                {allTopics.length > 0 && <LaravelPagination meta={topicsPage} />}
            </motion.div>
        </>
    );
}

Index.layout = {
    breadcrumbs,
};