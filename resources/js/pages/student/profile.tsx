import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserCircle } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { profile } from '@/routes/student';

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
};

export default function Profile() {
    return (
        <>
            <Head title="الملف الشخصي" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6"
            >
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-foreground">الملف الشخصي</h1>
                    <p className="text-sm text-muted-foreground">إحصائيات متقدمة، شارات، وإنجازات</p>
                </div>

                <EmptyState
                    icon={UserCircle}
                    title="قريباً"
                    description="صفحة الملف الشخصي قيد التطوير، ستتمكن قريباً من متابعة تطورك عبر الزمن والاطلاع على شاراتك وإنجازاتك."
                />
            </motion.div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        { title: 'الملف الشخصي', href: profile() },
    ],
};
