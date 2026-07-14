import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Clock, House } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Attempt } from '@/types/attempt';

interface ShowProps {
    attempt: Attempt;
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

const typeLabels: Record<string, string> = {
    practice: 'تدريب حر',
    exam: 'محاكاة اختبار',
};

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    in_progress: { label: 'قيد التنفيذ', variant: 'default' },
    completed: { label: 'مكتمل', variant: 'secondary' },
    abandoned: { label: 'ملغي', variant: 'outline' },
};

export default function Show({ attempt }: ShowProps) {
    const statusInfo = statusLabels[attempt.status] ?? { label: attempt.status, variant: 'outline' };

    return (
        <>
            <Head title={`محاولة ${typeLabels[attempt.type] ?? attempt.type}`} />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6"
            >
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <House className="h-3.5 w-3.5" />
                        <span>الرئيسية</span>
                    </Link>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">
                        {typeLabels[attempt.type] ?? 'محاولة'}
                    </span>
                </nav>

                <div className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <div className="relative p-6 sm:p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-bold">
                                        {typeLabels[attempt.type] ?? 'محاولة'}
                                    </h1>
                                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {attempt.total_questions} سؤال
                                    {attempt.correct_answers > 0 && (
                                        <> &middot; {attempt.correct_answers} إجابة صحيحة</>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-6 border-t pt-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {attempt.sections.length} قسم
                            </span>
                            {attempt.sections.some(s => s.duration_minutes) && (
                                <span className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {attempt.sections.reduce((acc, s) => acc + (s.duration_minutes ?? 0), 0)} دقيقة
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
