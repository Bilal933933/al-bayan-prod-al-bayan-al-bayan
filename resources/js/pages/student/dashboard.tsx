import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { InProgressBanner } from '@/components/student/dashboard/in-progress-banner';
import { QuickActions } from '@/components/student/dashboard/quick-actions';
import { RecentAttempts } from '@/components/student/dashboard/recent-attempts';
import { RecommendedTopics } from '@/components/student/dashboard/recommended-topics';
import { DashboardSidebar } from '@/components/student/dashboard/sidebar';
import { StatsGrid } from '@/components/student/dashboard/stats-grid';
import { WelcomeSection } from '@/components/student/dashboard/welcome-section';
import { dashboard } from '@/routes/student';
import type { Attempt } from '@/types/attempt';
import type { Competition } from '@/types/competition';
import type { Topic } from '@/types/topic';

interface InProgressAttempt extends Attempt {
    topic?: { id: number; name: string } | null;
    competition?: { id: number; name: string } | null;
}

interface DashboardProps {
    user: {
        name: string;
        email?: string;
    };
    inProgressAttempt: InProgressAttempt | null;
    recentAttempts: Attempt[];
    stats: {
        total_attempts: number;
        completed_attempts: number;
        in_progress_attempts: number;
        average_percentage: number | null;
        streak_days?: number;
    };
    activeCompetitions: (Competition & { topics_count: number })[];
    recommendedTopics: (Topic & { questions_count: number })[];
    recentCompetitions: (Competition & { topics_count: number })[];
    upcomingCompetitions: (Competition & { topics_count: number })[];
    lastActivityAt: string | null;
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const },
    },
};

export default function Dashboard({
    user,
    inProgressAttempt,
    recentAttempts,
    stats,
    activeCompetitions,
    recommendedTopics,
    recentCompetitions,
    upcomingCompetitions,
}: DashboardProps) {
    return (
        <>
            <Head title="لوحة التحكم" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-7xl flex-col gap-6 p-6"
            >
                <WelcomeSection user={user} stats={stats} />

                <QuickActions />

                {inProgressAttempt && (
                    <InProgressBanner attempt={inProgressAttempt} />
                )}

                <StatsGrid stats={stats} />

                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                    <div className="flex flex-col gap-6">
                        <RecentAttempts attempts={recentAttempts} />

                        <RecommendedTopics topics={recommendedTopics} />
                    </div>

                    <DashboardSidebar
                        activeCompetitions={activeCompetitions}
                        recentCompetitions={recentCompetitions}
                        upcomingCompetitions={upcomingCompetitions}
                    />
                </div>
            </motion.div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'لوحة التحكم',
            href: dashboard(),
        },
    ],
};
