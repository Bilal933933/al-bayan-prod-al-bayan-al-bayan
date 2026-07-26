import { AnimatePresence, motion } from 'framer-motion';
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

const tabVariants = {
    enter: { opacity: 0, y: 12 },
    center: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0, 0, 0.2, 1] as [number, number, number, number],
        },
    },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function ProfilePage({ profileData }: ProfilePageProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const {
        user,
        stats,
        streak_days,
        total_points,
        monthly_scores,
        topic_progress,
        badges,
        achievements,
    } = profileData;

    return (
        <>
            <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
                <ProfileHeader
                    name={user.name}
                    email={user.email}
                    initial={user.initial}
                    avatar={user.avatar}
                    streakDays={streak_days}
                    totalPoints={total_points}
                />

                <ProfileStatsGrid stats={stats} />

                <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            variants={tabVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-6"
                        >
                            <ProgressChart data={monthly_scores} />
                            <TopicProgressList data={topic_progress} />
                        </motion.div>
                    )}

                    {activeTab === 'achievements' && (
                        <motion.div
                            key="achievements"
                            variants={tabVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-6"
                        >
                            <BadgesGrid badges={badges} />
                            <AchievementsList achievements={achievements} />
                        </motion.div>
                    )}

                    {activeTab === 'history' && (
                        <motion.div
                            key="history"
                            variants={tabVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            <div className="rounded-2xl border bg-card p-12 shadow-xs">
                                <div className="text-center text-muted-foreground">
                                    <div className="mb-3 text-5xl">📅</div>
                                    <div className="mb-1 font-semibold">
                                        سجل النشاطات
                                    </div>
                                    <div className="text-sm">قريباً</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

ProfilePage.layout = {
    breadcrumbs: [{ title: 'الملف الشخصي', href: profile() }],
};
