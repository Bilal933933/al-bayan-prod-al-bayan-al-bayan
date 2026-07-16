import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/section-header';
import TopicCard from '@/components/student/topics/topic-card';
import topics from '@/routes/student/topics';
import type { Topic } from '@/types/topic';

interface RecommendedTopicsProps {
    topics: (Topic & { questions_count: number })[];
}

export function RecommendedTopics({ topics: items }: RecommendedTopicsProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4"
        >
            <SectionHeader title="مقترحة للتدريب" href={topics.index().url} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((topic, index) => (
                    <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                        <TopicCard
                            id={topic.id}
                            name={topic.name}
                            description={topic.description}
                            questionsCount={topic.questions_count}
                            durationMinutes={topic.default_duration_minutes}
                            href={topics.show({ topic: topic.id }).url}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
