import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ReportForm } from '@/components/student/report/report-form';
import { ReportList } from '@/components/student/report/report-list';
import { report } from '@/routes/student';
import type { ReportItem } from '@/types/report';

interface RecentQuestion {
    id: number;
    text: string;
}

interface ReportPageProps {
    reports: ReportItem[];
    recent_questions: RecentQuestion[];
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
};

export default function ReportPage({ reports, recent_questions }: ReportPageProps) {
    return (
        <>
            <Head title="الإبلاغ" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-2xl flex-col gap-6 p-6"
            >
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-foreground">الإبلاغ / تواصل معنا</h1>
                    <p className="text-sm text-muted-foreground">للإبلاغ عن مشكلة في سؤال أو محتوى</p>
                </div>

                                <ReportForm recentQuestions={recent_questions} />
                                <ReportList reports={reports} />
            </motion.div>
        </>
    );
}

ReportPage.layout = {
    breadcrumbs: [
        { title: 'الإبلاغ', href: report() },
    ],
};
