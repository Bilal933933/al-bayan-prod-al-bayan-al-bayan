import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Medal } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { leaderboard } from '@/routes/student';

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
};

export default function Leaderboard() {
    return (
        <>
            <Head title="المتصدرين" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6"
            >
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-foreground">المتصدرين</h1>
                    <p className="text-sm text-muted-foreground">ترتيب الطلاب في المسابقات</p>
                </div>

                <EmptyState
                    icon={Medal}
                    title="قريباً"
                    description="صفحة المتصدرين قيد التطوير، ستتمكن قريباً من رؤية ترتيبك وترتيب الطلاب الآخرين في المسابقات."
                />
            </motion.div>
        </>
    );
}

Leaderboard.layout = {
    breadcrumbs: [
        { title: 'لوحة التحكم', href: leaderboard() },
    ],
};
