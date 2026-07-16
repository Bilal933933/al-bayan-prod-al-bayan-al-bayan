import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AttemptFilters from '@/components/admin/attempts/attempt-filters';
import AttemptTable from '@/components/admin/attempts/attempt-table';
import Heading from '@/components/heading';
import { dashboard } from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';
import type { Attempt } from '@/types/attempt';
import type { PaginationMeta } from '@/types/pagination';

interface IndexProps {
    attempts: {
        data: Attempt[];
    } & PaginationMeta;
    filters: {
        search: string;
        type: string | null;
        status: string | null;
        topic_id: string | null;
        competition_id: string | null;
    };
    topics: { id: number; name: string }[];
    competitions: { id: number; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المحاولات', href: '#' },
];

export default function Index({ attempts: paginated, filters, topics, competitions }: IndexProps) {
    return (
        <>
            <Head title="إدارة المحاولات" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-5 p-6"
            >
                <Heading title="المحاولات" description="عرض وإدارة محاولات المستخدمين" />

                <AttemptFilters
                    filters={filters}
                    topics={topics}
                    competitions={competitions}
                />

                <AttemptTable attempts={paginated} />
            </motion.div>
        </>
    );
}

Index.layout = {
    breadcrumbs,
};
