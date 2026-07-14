import { motion } from 'framer-motion';
import { Head } from '@inertiajs/react';
import BreadcrumbTrail from '@/components/student/competitions/breadcrumb-trail';
import CompetitionHero from '@/components/student/competitions/competition-hero';
import CompetitionGrid from '@/components/student/competitions/competition-grid';
import StartExamButton from '@/components/student/competitions/start-exam-button';
import type { Competition } from '@/types/competition';

interface ShowProps {
    competition: Competition & {
        parent: Competition | null;
    };
    children?: Competition[];
}

const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut', delay: 0.1 },
    },
};

export default function Show({ competition, children }: ShowProps) {
    const childrenCount = children?.length ?? 0;

    return (
        <>
            <Head title={competition.name} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6"
            >
                <BreadcrumbTrail
                    parent={competition.parent}
                    currentName={competition.name}
                    classification={competition.classification}
                />

                <CompetitionHero
                    competition={competition}
                    childrenCount={childrenCount}
                />

                {competition.classification === 'container' && children && (
                    <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {childrenCount === 0 ? (
                            <div className="rounded-xl border border-dashed border-border bg-muted/10 py-12 text-center">
                                <p className="text-muted-foreground">
                                    لا توجد مسابقات فرعية تابعة لهذه الحاوية حالياً.
                                </p>
                            </div>
                        ) : (
                            <CompetitionGrid competitions={children} />
                        )}
                    </motion.div>
                )}

                {competition.classification !== 'container' && (
                    <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center gap-8"
                    >
                        <div className="max-w-md text-center">
                            <p className="text-muted-foreground">
                                هذه المسابقة جاهزة للبدء. تأكد من استعدادك ثم ابدأ الاختبار.
                            </p>
                        </div>

                        <StartExamButton code={competition.code} />
                    </motion.div>
                )}
            </motion.div>
        </>
    );
}
