import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, House, Layers } from 'lucide-react';
import TopicCard from '@/components/student/topics/topic-card';
import { TopicSearch } from '@/components/student/topics/topic-search';
import { TopicStatsBar } from '@/components/student/topics/topic-stats-bar';
import competitions from '@/routes/student/competitions';
import topicsRoutes from '@/routes/student/topics';
import type { Topic } from '@/types/topic';
import { useMemo, useState } from 'react';

interface IndexProps {
    topics: Topic[];
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

export default function Index({ topics }: IndexProps) {
    const [search, setSearch] = useState('');
    const [visibilityFilter, setVisibilityFilter] = useState<string | null>(null);

    const filtered = useMemo(() => {
        let result = topics;

        if (visibilityFilter) {
            result = result.filter((t) => t.visibility === visibilityFilter);
        }

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter(
                (t) => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q),
            );
        }

        return result;
    }, [topics, search, visibilityFilter]);

    const counts = useMemo(() => ({
        all: topics.length,
        general: topics.filter((t) => t.visibility === 'general').length,
        private: topics.filter((t) => t.visibility === 'private').length,
    }), [topics]);

    const stats = useMemo(() => {
        const totalAttempts = topics.reduce((sum, t) => sum + (t.user_attempts_count ?? 0), 0);
        const uniqueTopics = topics.filter((t) => (t.user_attempts_count ?? 0) > 0).length;

        const scores = topics
            .map((t) => t.best_score)
            .filter((s): s is { correct: number; total: number } => s !== null && s !== undefined);

        const averageScore = scores.length > 0
            ? (scores.reduce((sum, s) => sum + (s.correct / s.total) * 100, 0) / scores.length)
            : null;

        let lastPracticeLabel: string | null = null;

        return { totalAttempts, uniqueTopics, averageScore, lastPracticeLabel };
    }, [topics]);

    const showEmptyResult = filtered.length === 0 && (search || visibilityFilter);

    return (
        <>
            <Head title="التدريب الحر" />

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
                    <span className="font-medium text-foreground">التدريب الحر</span>
                </nav>

                <div>
                    <h1 className="text-2xl font-bold">التدريب الحر</h1>
                    <p className="mt-1 text-muted-foreground">
                        اختر محوراً للتدرب عليه بشكل مستقل
                    </p>
                </div>

                <TopicStatsBar {...stats} />

                <TopicSearch
                    search={search}
                    onSearchChange={setSearch}
                    visibilityFilter={visibilityFilter}
                    onVisibilityChange={setVisibilityFilter}
                    counts={counts}
                />

                {topics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
                        <Layers className="mb-2 h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">لا توجد محاور تدريب متاحة حالياً</p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                            سيتم إضافة محاور تدريبية جديدة قريباً
                        </p>
                    </div>
                ) : showEmptyResult ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                        <Layers className="mb-2 h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">لا توجد نتائج للبحث</p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                            حاول تغيير كلمة البحث أو إزالة الفلتر
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((topic) => (
                            <TopicCard
                                key={topic.id}
                                id={topic.id}
                                code={topic.code}
                                name={topic.name}
                                visibility={topic.visibility}
                                description={topic.description}
                                questionsCount={topic.default_questions_count}
                                durationMinutes={topic.default_duration_minutes}
                                href={topicsRoutes.show({ topic: topic.id }).url}
                                userAttemptsCount={topic.user_attempts_count}
                                hasInProgress={topic.has_in_progress}
                                inProgressAttemptId={topic.in_progress_attempt_id}
                                bestScore={topic.best_score}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </>
    );
}
