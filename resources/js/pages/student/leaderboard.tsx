import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Medal } from 'lucide-react';
import { FilterTabs } from '@/components/student/leaderboard/filter-tabs';
import { PodiumCard } from '@/components/student/leaderboard/podium-card';
import { RankingRow } from '@/components/student/leaderboard/ranking-row';
import { StickyUserBar } from '@/components/student/leaderboard/sticky-user-bar';
import { leaderboard } from '@/routes/student';
import type { LeaderboardPageProps } from '@/types/leaderboard';

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

export default function LeaderboardPage({ podium, rankings, currentUser, periods, currentPeriod }: LeaderboardPageProps) {
    function handlePeriodChange(key: string) {
        router.reload({
            data: { period: key },
            only: ['podium', 'rankings', 'currentUser', 'currentPeriod'],
            preserveUrl: true,
        });
    }

    return (
        <>
            <Head title="المتصدرين" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6 pb-24"
            >
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Medal className="h-6 w-6 text-amber-500" />
                        <h1 className="text-2xl font-bold text-foreground">المتصدرين</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">ترتيب الطلاب في المسابقات</p>
                </div>

                {/* Period Filter */}
                <FilterTabs periods={periods} currentPeriod={currentPeriod} onChange={handlePeriodChange} />

                {/* Podium Section */}
                {podium.length > 0 && (
                    <div className="flex flex-col items-end justify-center gap-4 pt-4 md:flex-row">
                        <div className="order-1 w-full md:order-1 md:max-w-[200px]">
                            <PodiumCard entry={podium[1] ?? null} rank={2} />
                        </div>
                        <div className="order-2 w-full md:order-2 md:max-w-[220px]">
                            <PodiumCard entry={podium[0] ?? null} rank={1} isFirst />
                        </div>
                        <div className="order-3 w-full md:max-w-[200px]">
                            <PodiumCard entry={podium[2] ?? null} rank={3} />
                        </div>
                    </div>
                )}

                {/* Rankings List */}
                {rankings.length > 0 ? (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-3">
                        {rankings.map((entry) => (
                            <motion.div
                                key={entry.rank}
                                variants={{
                                    hidden: { opacity: 0, y: 12 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
                                }}
                            >
                                <RankingRow entry={entry} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
                        <Medal className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">لا توجد نتائج بعد</p>
                        <p className="max-w-xs text-sm text-muted-foreground/60">
                            ابدأ بحل الاختبارات لتظهر في لوحة المتصدرين
                        </p>
                    </div>
                )}
            </motion.div>

            <StickyUserBar currentUser={currentUser} />
        </>
    );
}

LeaderboardPage.layout = {
    breadcrumbs: [
        { title: 'المتصدرين', href: leaderboard() },
    ],
};
