import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import competitions from '@/routes/admin/competitions';
import Heading from '@/components/heading';
import CompetitionTable from '@/components/admin/competitions/competition-table';
import { LaravelPagination } from '@/components/laravel-pagination';
import { Button } from '@/components/ui/button';
import { Layers, ListChecks, FolderOpen, FileText } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { Competition } from '@/types/competition';
import type { PaginationMeta } from '@/types/pagination';

interface IndexProps {
    competitions: {
        data: Competition[];
    } & PaginationMeta;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المسابقات', href: competitions.index() },
];

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

const statVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.25 },
    }),
};

export default function Index({ competitions: competitionsPage }: IndexProps) {
    const allCompetitions = competitionsPage.data;

    const stats = useMemo(() => {
        const total = competitionsPage.total ?? allCompetitions.length;
        const active = allCompetitions.filter((c) => c.is_active).length;
        const containers = allCompetitions.filter((c) => c.classification === 'container').length;
        const standalone = allCompetitions.filter((c) => c.classification === 'standalone').length;
        const children = allCompetitions.filter((c) => c.classification === 'child').length;
        return { total, active, containers, standalone, children };
    }, [allCompetitions, competitionsPage.total]);

    const statCards = [
        { icon: ListChecks, label: 'إجمالي', value: stats.total },
        { icon: FileText, label: 'نشط', value: stats.active },
        { icon: FolderOpen, label: 'حاويات', value: stats.containers },
        { icon: Layers, label: 'مستقلة', value: stats.standalone },
        { icon: ListChecks, label: 'أبناء', value: stats.children },
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
                            key={stat.label}
                            custom={i}
                            variants={statVariants}
                            initial="hidden"
                            animate="visible"
                            className="rounded-lg border bg-card p-3"
                        >
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <stat.icon className="h-4 w-4" />
                                <span className="text-xs">{stat.label}</span>
                            </div>
                            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* الجدول */}
                <CompetitionTable competitions={allCompetitions} meta={competitionsPage} />
                <LaravelPagination meta={competitionsPage} />
            </motion.div>
        </>
    );
}

Index.layout = {
    breadcrumbs,
};
