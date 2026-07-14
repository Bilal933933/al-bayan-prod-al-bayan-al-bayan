import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Globe, Lock } from 'lucide-react';
import { useMemo } from 'react';
import TopicTable from '@/components/admin/topics/topic-table';
import Heading from '@/components/heading';
import { LaravelPagination } from '@/components/laravel-pagination';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import topics from '@/routes/admin/topics';
import type { BreadcrumbItem } from '@/types';
import type { PaginationMeta } from '@/types/pagination';
import type { Topic } from '@/types/topic';

interface IndexProps {
    topics: {
        data: Topic[];
    } & PaginationMeta;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المحاور', href: topics.index() },
];

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 },
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

export default function Index({ topics: topicsPage }: IndexProps) {
    const allTopics = topicsPage.data;

    const stats = useMemo(() => {
        const total = topicsPage.total ?? allTopics.length;
        const active = allTopics.filter((t) => t.is_active).length;
        const general = allTopics.filter((t) => t.visibility === 'general').length;
        const private_ = allTopics.filter((t) => t.visibility === 'private').length;

        return { total, active, general, private_ };
    }, [allTopics, topicsPage.total]);

    const statCards = [
        { icon: BookOpen, label: 'إجمالي', value: stats.total },
        { icon: CheckCircle, label: 'نشط', value: stats.active },
        { icon: Globe, label: 'عام', value: stats.general },
        { icon: Lock, label: 'خاص', value: stats.private_ },
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
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Heading title="المحاور" description="إدارة محاور الاختبارات" />
                    <Link href={topics.create().url} className="shrink-0">
                        <Button>إضافة محور</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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

                <TopicTable topics={allTopics} meta={topicsPage} />
                <LaravelPagination meta={topicsPage} />
            </motion.div>
        </>
    );
}

Index.layout = {
    breadcrumbs,
};
