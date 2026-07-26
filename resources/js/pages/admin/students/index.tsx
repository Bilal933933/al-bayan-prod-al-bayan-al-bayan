import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Search, Users, UserCheck, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import StudentTable from '@/components/admin/students/student-table';
import Heading from '@/components/heading';
import { LaravelPagination } from '@/components/laravel-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes/admin';
import students from '@/routes/admin/students';
import type { BreadcrumbItem } from '@/types';
import type { User } from '@/types';
import type { PaginationMeta } from '@/types/pagination';

interface StudentRow extends User {
    attempts_count?: number;
    competitions_count?: number;
}

interface IndexProps {
    students: {
        data: StudentRow[];
    } & PaginationMeta;
    sort: string;
    direction: string;
    search: string;
    verifiedFilter: string;
    stats: {
        total: number;
        verified: number;
        new_this_week: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'الطلاب', href: students.index() },
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
        icon: Users,
        label: 'إجمالي الطلاب',
        key: 'total' as const,
        color: '#3b82f6',
    },
    {
        icon: UserCheck,
        label: 'مفعل',
        key: 'verified' as const,
        color: '#22c55e',
    },
    {
        icon: UserPlus,
        label: 'جديد هذا الأسبوع',
        key: 'new_this_week' as const,
        color: '#f59e0b',
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
    students: studentsPage,
    sort = 'created_at',
    direction = 'desc',
    search: currentSearch = '',
    verifiedFilter = 'all',
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

    const allStudents = studentsPage.data;

    const filterTabs: { value: string; label: string }[] = [
        { value: 'all', label: 'الكل' },
        { value: 'verified', label: 'مفعل' },
        { value: 'unverified', label: 'غير مفعل' },
    ];

    return (
        <>
            <Head title="الطلاب" />
            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-1 flex-col gap-5 p-6"
            >
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Heading
                        title="الطلاب"
                        description="إدارة الطلاب المسجلين"
                    />
                    <Link href={students.create().url} className="shrink-0">
                        <Button>إضافة طالب</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-3">
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
                            placeholder="بحث بالاسم أو البريد..."
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
                                    verifiedFilter === tab.value
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                    navigateWithParams({
                                        verified:
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

                <StudentTable
                    students={allStudents}
                    meta={studentsPage}
                    searchQuery={currentSearch}
                    sort={sort}
                    direction={direction}
                />
                {allStudents.length > 0 && (
                    <LaravelPagination meta={studentsPage} />
                )}
            </motion.div>
        </>
    );
}

Index.layout = {
    breadcrumbs,
};
