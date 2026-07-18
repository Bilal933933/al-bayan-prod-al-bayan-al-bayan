import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { onboarding } from '@/routes/student';

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
};

export default function Onboarding() {
    return (
        <>
            <Head title="مرحباً بك" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6"
            >
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-foreground">مرحباً بك</h1>
                    <p className="text-sm text-muted-foreground">تجربة دخول أول مرة</p>
                </div>

                <EmptyState
                    icon={Sparkles}
                    title="قريباً"
                    description="Experience الإعداد الأولي قيد التطوير، ستتمكن قريباً من تخصيص تجربتك الأولى."
                />
            </motion.div>
        </>
    );
}

Onboarding.layout = {
    breadcrumbs: [
        { title: 'ترحيب', href: onboarding() },
    ],
};
