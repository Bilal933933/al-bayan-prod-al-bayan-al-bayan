import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { AttemptCard } from '@/components/student/attempts/attempt-card';
import { EmptyState } from '@/components/empty-state';
import { SectionHeader } from '@/components/section-header';
import attempts from '@/routes/student/attempts';
import type { Attempt } from '@/types/attempt';

interface RecentAttemptsProps {
    attempts: Attempt[];
}

export function RecentAttempts({ attempts: items }: RecentAttemptsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            {items.length > 0 && (
                <SectionHeader title="آخر المحاولات" href={attempts.index().url} />
            )}

            {items.length > 0 ? (
                <div className="space-y-4">
                    {items.map((attempt, index) => (
                        <motion.div
                            key={attempt.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                        >
                            <AttemptCard
                                attempt={attempt}
                                href={attempts.show({ attempt: attempt.id }).url}
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                    <EmptyState
                        icon={Layers}
                        title="لا توجد محاولات سابقة"
                        description="ابدأ تدريباً أو شارك في مسابقة لتظهر محاولاتك هنا"
                        actionLabel="ابدأ التدريب"
                        actionHref={attempts.create().url}
                    />
                </motion.div>
            )}
        </motion.div>
    );
}
