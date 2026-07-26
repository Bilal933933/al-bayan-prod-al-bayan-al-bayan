import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { ReportForm } from '@/components/student/report/report-form';
import { ReportList } from '@/components/student/report/report-list';
import { report as reportRoute } from '@/routes/student';
import reportRoutes from '@/routes/student/report';
import type { ReportItem } from '@/types/report';

interface RecentQuestion {
    id: number;
    text: string;
}

interface ReportPageProps {
    reports: ReportItem[];
    unread_count: number;
    recent_questions: RecentQuestion[];
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const },
    },
};

export default function ReportPage({
    reports,
    unread_count,
    recent_questions,
}: ReportPageProps) {
    useEffect(() => {
        if (unread_count > 0) {
            router.patch(
                reportRoutes.readAll().url,
                {},
                { preserveScroll: true, preserveState: true },
            );
        }
    }, [unread_count]);

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
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-foreground">
                            الإبلاغ / تواصل معنا
                        </h1>
                        {unread_count > 0 && (
                            <span className="flex h-6 items-center gap-1 rounded-full bg-brand-gold/15 px-2.5 text-xs font-bold text-brand-gold">
                                {unread_count} ردود جديدة
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        للإبلاغ عن مشكلة في سؤال أو محتوى
                    </p>
                </div>

                <ReportForm recentQuestions={recent_questions} />
                <ReportList reports={reports} />
            </motion.div>
        </>
    );
}

ReportPage.layout = {
    breadcrumbs: [{ title: 'الإبلاغ', href: reportRoute() } as const],
};
