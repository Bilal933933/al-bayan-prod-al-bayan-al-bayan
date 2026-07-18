import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import type { Competition } from '@/types/competition';

interface JoinProps {
    competition: Competition;
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
};

export default function Join({ competition }: JoinProps) {
    return (
        <>
            <Head title={`الانضمام إلى ${competition.name}`} />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6"
            >
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-foreground">الانضمام إلى المسابقة</h1>
                    <p className="text-sm text-muted-foreground">{competition.name}</p>
                </div>

                <EmptyState
                    icon={UserPlus}
                    title="قريباً"
                    description="صفحة الانضمام إلى المسابقة قيد التطوير، ستتمكن قريباً من التسجيل والمشاركة في هذه المسابقة."
                />
            </motion.div>
        </>
    );
}
