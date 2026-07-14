import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import TopicCard from '@/components/student/topics/topic-card';
import topicsRoutes from '@/routes/student/topics';
import competitions from '@/routes/student/competitions';
import { ChevronLeft, House, Layers } from 'lucide-react';
import type { Topic } from '@/types/topic';

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

                {topics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
                        <Layers className="mb-2 h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">لا توجد محاور تدريب متاحة حالياً</p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                            سيتم إضافة محاور تدريبية جديدة قريباً
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {topics.map((topic) => (
                            <TopicCard
                                key={topic.id}
                                code={topic.code}
                                name={topic.name}
                                visibility={topic.visibility}
                                description={topic.description}
                                questionsCount={topic.default_questions_count}
                                durationMinutes={topic.default_duration_minutes}
                                href={topicsRoutes.show({ topic: topic.id }).url}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </>
    );
}
