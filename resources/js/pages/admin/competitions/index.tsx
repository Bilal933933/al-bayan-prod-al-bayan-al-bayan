import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Head, Link, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import competitions from '@/routes/admin/competitions';
import Heading from '@/components/heading';
import CompetitionTable from '@/components/admin/competitions/competition-table';
import { LaravelPagination } from '@/components/laravel-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Layers, FolderOpen, FileText, Trophy, GraduationCap } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { Competition } from '@/types/competition';
import type { PaginationMeta } from '@/types/pagination';

export type ClassificationFilter = 'all' | 'container' | 'standalone' | 'child';

interface IndexProps {
    competitions: {
        data: Competition[];
    } & PaginationMeta;
    sort: string;
    direction: string;
    search: string;
    filter: ClassificationFilter;
    stats: {
        total: number;
        active: number;
        containers: number;
        standalone: number;
        children: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المسابقات', href: competitions.index() },
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
    { icon: Trophy, label: 'إجمالي', key: 'total' as const, color: '#3b82f6' },
    { icon: FileText, label: 'نشط', key: 'active' as const, color: '#22c55e' },
    { icon: FolderOpen, label: 'حاويات', key: 'containers' as const, color: '#f59e0b' },
    { icon: Layers, label: 'مستقلة', key: 'standalone' as const, color: '#8b5cf6' },
    { icon: GraduationCap, label: 'أبناء', key: 'children' as const, color: '#f43f5e' },
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
    competitions: competitionsPage,
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

    const allCompetitions = competitionsPage.data;

    const filterTabs: { value: ClassificationFilter; label: string }[] = [
        { value: 'all', label: 'الكل' },
        { value: 'container', label: 'الحاويات' },
        { value: 'standalone', label: 'المستقلة' },
        { value: 'child', label: 'الأبناء' },
    ];

    return (
        <>
            <Head title="المسابقات" />
            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-1 flex-col gap-5 p-6"
            >
                {/* رأس الصفحة */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Heading title="المسابقات" description="إدارة المسابقات والفروع" />
                    <Link href={competitions.create().url} className="shrink-0">
                        <Button>إضافة مسابقة</Button>
                    </Link>
                </div>

                {/* بطاقات الإحصائيات */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
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
                            <p className="mt-1 text-2xl font-bold">{stats?.[stat.key] ?? competitionsPage.total}</p>
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
                <CompetitionTable
                    competitions={allCompetitions}
                    meta={competitionsPage}
                    searchQuery={currentSearch}
                    activeFilter={filter}
                    sort={sort}
                    direction={direction}
                />
                {allCompetitions.length > 0 && <LaravelPagination meta={competitionsPage} />}
            </motion.div>
        </>
    );
}

Index.layout = {
    breadcrumbs,
};