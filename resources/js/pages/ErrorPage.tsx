import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    FileQuestion,
    Home,
    LockKeyhole,
    ServerCrash,
    Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const defaults: Record<
    number,
    {
        icon: React.ComponentType<{ className?: string }>;
        title: string;
        description: string;
    }
> = {
    403: {
        icon: LockKeyhole,
        title: 'غير مصرح بالوصول',
        description: 'ليس لديك صلاحية كافية لعرض هذه الصفحة',
    },
    404: {
        icon: FileQuestion,
        title: 'الصفحة غير موجودة',
        description: 'عذراً، الصفحة التي تبحث عنها غير متوفرة',
    },
    500: {
        icon: ServerCrash,
        title: 'خطأ في الخادم',
        description: 'حدث خطأ غير متوقع، حاول مرة أخرى لاحقاً',
    },
    503: {
        icon: Wrench,
        title: 'الخدمة غير متوفرة',
        description: 'نعمل على تحسين الخدمة حالياً، يرجى المحاولة لاحقاً',
    },
};

interface ErrorPageProps {
    status: number;
    title?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
}

export default function ErrorPage({
    status,
    title,
    description,
    actionLabel,
    actionHref,
}: ErrorPageProps) {
    const config = defaults[status] ?? defaults[404];
    const Icon = config.icon;
    const finalTitle = title ?? config.title;
    const finalDescription = description ?? config.description;

    return (
        <>
            <Head title={`خطأ ${status}`} />

            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex flex-col items-center gap-6 text-center"
                >
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeOut',
                            delay: 0.1,
                        }}
                        className={cn(
                            'font-heading text-[120px] leading-none select-none sm:text-[160px]',
                            'bg-gradient-to-b from-brand-teal to-brand-teal-deep bg-clip-text text-transparent',
                        )}
                    >
                        {status}
                    </motion.span>

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                        <Icon className="h-8 w-8 text-muted-foreground" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            {finalTitle}
                        </h1>
                        <p className="mx-auto max-w-sm text-muted-foreground">
                            {finalDescription}
                        </p>
                    </div>

                    {actionLabel && actionHref ? (
                        <Link href={actionHref}>
                            <Button size="lg" className="gap-2">
                                {actionLabel}
                                <Home className="h-4 w-4" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/">
                            <Button size="lg" className="gap-2">
                                العودة للرئيسية
                                <Home className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                </motion.div>
            </div>
        </>
    );
}
