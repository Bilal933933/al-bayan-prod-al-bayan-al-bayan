import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Clock, House, Play } from 'lucide-react';
import VisibilityBadge from '@/components/admin/topics/visibility-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import competitions from '@/routes/student/competitions';
import topics from '@/routes/student/topics';
import type { Topic } from '@/types/topic';

interface ShowProps {
    topic: Topic;
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

export default function Show({ topic }: ShowProps) {
    function startPractice() {
        router.post(
            topics.attempts.start({ topic: topic.id }).url,
            {},
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title={topic.name} />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6"
            >
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Link
                        href={competitions.index().url}
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <House className="h-3.5 w-3.5" />
                        <span>الرئيسية</span>
                    </Link>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <Link
                        href={topics.index().url}
                        className="hover:text-foreground transition-colors"
                    >
                        التدريب الحر
                    </Link>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">{topic.name}</span>
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
                                    <h1 className="text-2xl font-bold">{topic.name}</h1>
                                    <VisibilityBadge visibility={topic.visibility} />
                                    <Badge variant={topic.is_active ? 'default' : 'destructive'}>
                                        {topic.is_active ? 'نشط' : 'غير نشط'}
                                    </Badge>
                                </div>
                                <p className="mt-1 font-mono text-sm text-muted-foreground" dir="ltr">{topic.code}</p>
                            </div>
                        </div>

                        {topic.description && (
                            <p className="mt-5 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                                {topic.description}
                            </p>
                        )}

                        <div className="mt-6 flex flex-wrap items-center gap-6 border-t pt-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {topic.default_questions_count} سؤال
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {topic.default_duration_minutes ? `${topic.default_duration_minutes} دقيقة` : 'بدون مؤقت'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button onClick={startPractice} size="lg" className="gap-2 text-base">
                        <Play className="h-5 w-5" />
                        بدء التدريب الحر
                    </Button>
                </div>
            </motion.div>
        </>
    );
}
