import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FolderOpen, Layers } from 'lucide-react';
import { useMemo } from 'react';
import { EmptyState } from '@/components/empty-state';
import ContainerSection from '@/components/student/competitions/container-section';
import MyCompetitionsSection from '@/components/student/competitions/my-competitions-section';
import competitions from '@/routes/student/competitions';
import type { Competition } from '@/types/competition';

interface IndexProps {
    competitions: Competition[];
    myCompetitions: Competition[];
    filters: {
        classification: string | null;
    };
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

export default function Index({ competitions: items, myCompetitions }: IndexProps) {
    const { containers, standalone } = useMemo(() => {
        const containers: Competition[] = [];
        const standalone: Competition[] = [];

        for (const c of items) {
            if (c.classification === 'container') {
                containers.push(c);
            } else {
                standalone.push(c);
            }
        }

        return { containers, standalone };
    }, [items]);

    return (
        <>
            <Head title="المسابقات المتاحة" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-8 p-6"
            >
                <div>
                    <h1 className="text-2xl font-bold">المسابقات المتاحة</h1>
                    <p className="mt-1 text-muted-foreground">
                        تصفح المسابقات المتاحة واختر ما يناسبك
                    </p>
                </div>

                {items.length === 0 && myCompetitions.length === 0 && (
                    <EmptyState
                        icon={Layers}
                        title="لا توجد مسابقات متاحة حالياً"
                        description="سيتم إضافة مسابقات جديدة قريباً"
                        className="py-20"
                    />
                )}

                <MyCompetitionsSection competitions={myCompetitions} />

                {containers.length > 0 && (
                    <ContainerSection
                        title="الحاويات"
                        icon={FolderOpen}
                        competitions={containers}
                    />
                )}

                {standalone.length > 0 && (
                    <ContainerSection
                        title="مسابقات مستقلة"
                        icon={Layers}
                        competitions={standalone}
                    />
                )}
            </motion.div>
        </>
    );
}
