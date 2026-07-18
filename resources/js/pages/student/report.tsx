import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { report } from '@/routes/student';

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
};

export default function Report() {
    return (
        <>
            <Head title="الإبلاغ" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6"
            >
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-foreground">الإبلاغ / تواصل معنا</h1>
                    <p className="text-sm text-muted-foreground">للإبلاغ عن مشكلة في سؤال أو محتوى</p>
                </div>

                <EmptyState
                    icon={Flag}
                    title="قريباً"
                    description="نموذج الإبلاغ قيد التطوير، ستتمكن قريباً من الإبلاغ عن أي مشكلة في الأسئلة أو المحتوى."
                />
            </motion.div>
        </>
    );
}

Report.layout = {
    breadcrumbs: [
        { title: 'الإبلاغ', href: report() },
    ],
};
