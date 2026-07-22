import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import CompetitionCard from '@/components/student/competitions/competition-card';
import competitions from '@/routes/student/competitions';
import type { Competition } from '@/types/competition';

interface SidebarProps {
    activeCompetitions: (Competition & { topics_count: number })[];
    recentCompetitions: (Competition & { topics_count: number })[];
    upcomingCompetitions: (Competition & { topics_count: number })[];
}

const tips = [
    'التدريب المنتظم يحسن النتائج',
    'راجع إجاباتك الخاطئة',
    'ابدأ بالأسئلة السهلة',
];

export function DashboardSidebar({ activeCompetitions, recentCompetitions, upcomingCompetitions }: SidebarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start"
        >
            {activeCompetitions.length > 0 && (
                <>
                    <SectionHeader title="مسابقات نشطة" />
                    <div className="space-y-3">
                        {activeCompetitions.map((competition, index) => (
                            <motion.div
                                key={competition.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                                <CompetitionCard competition={competition} />
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {recentCompetitions.length > 0 && (
                <>
                    <SectionHeader title="مسابقاتك الأخيرة" href={competitions.index().url} />
                    <div className="space-y-3">
                        {recentCompetitions.map((competition, index) => (
                            <motion.div
                                key={competition.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                                <CompetitionCard competition={competition} />
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {upcomingCompetitions.length > 0 && (
                <>
                    <SectionHeader title="مسابقات قادمة" />
                    <div className="space-y-3">
                        {upcomingCompetitions.map((competition, index) => (
                            <motion.div
                                key={competition.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                                <CompetitionCard competition={competition} />
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            <TipsCard />
        </motion.div>
    );
}

function TipsCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl bg-gradient-to-br from-info/10 to-info/20 dark:from-info/20 dark:to-info/20 border-2 border-info/30 dark:border-info/30 p-5"
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info text-info-foreground">
                    <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-info dark:text-info">نصائح سريعة</h3>
            </div>
            <ul className="space-y-2 text-sm text-info dark:text-info">
                {tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                        <span className="text-info">•</span>
                        <span>{tip}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}
