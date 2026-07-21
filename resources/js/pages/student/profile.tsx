import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { AchievementsList } from '@/components/student/profile/achievements-list';
import { BadgesGrid } from '@/components/student/profile/badges-grid';
import { ProfileHeader } from '@/components/student/profile/profile-header';
import { ProfileStatsGrid } from '@/components/student/profile/profile-stats';
import { ProfileTabs } from '@/components/student/profile/profile-tabs';
import { ProgressChart } from '@/components/student/profile/progress-chart';
import { TopicProgressList } from '@/components/student/profile/topic-progress';
import { profile } from '@/routes/student';
import type { ProfileData } from '@/types/profile';

interface ProfilePageProps {
    profileData: ProfileData;
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
};

export default function ProfilePage({ profileData }: ProfilePageProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const { user, stats, streak_days, total_points, monthly_scores, topic_progress, badges, achievements } = profileData;

    return (
        <>
            <Head title="الملف الشخصي" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-3xl flex-col gap-6 p-6"
            >
                <ProfileHeader
                    name={user.name}
                    email={user.email}
                    initial={user.initial}
                    streakDays={streak_days}
                    totalPoints={total_points}
                />

                <ProfileStatsGrid stats={stats} />

                <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border bg-card p-5 shadow-xs">
                            <ProgressChart data={monthly_scores} />
                        </div>
                        <div className="rounded-2xl border bg-card p-5 shadow-xs">
                            <TopicProgressList data={topic_progress} />
                        </div>
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border bg-card p-5 shadow-xs">
                            <BadgesGrid badges={badges} />
                        </div>
                        <div className="rounded-2xl border bg-card p-5 shadow-xs">
                            <AchievementsList achievements={achievements} />
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="rounded-2xl border bg-card p-12 shadow-xs">
                        <div className="text-center text-muted-foreground">
                            <div className="mb-3 text-5xl">📅</div>
                            <div className="mb-1 font-semibold">سجل النشاطات</div>
                            <div className="text-sm">قريباً</div>
                        </div>
                    </div>
                )}
            </motion.div>
        </>
    );
}

ProfilePage.layout = {
    breadcrumbs: [
        { title: 'الملف الشخصي', href: profile() },
    ],
};
