export interface ProfileStats {
    total_attempts: number;
    avg_score_percentage: number | null;
    competitions_count: number;
    avg_time_formatted: string;
}

export interface MonthlyScore {
    month: string;
    percentage: number;
}

export interface TopicProgress {
    name: string;
    percentage: number;
}

export interface Badge {
    emoji: string;
    name: string;
}

export interface Achievement {
    icon: string;
    iconBg: string;
    title: string;
    description: string;
    date: string;
}

export interface ProfileData {
    user: {
        name: string;
        email: string;
        initial: string;
    };
    stats: ProfileStats;
    streak_days: number;
    total_points: number;
    monthly_scores: MonthlyScore[];
    topic_progress: TopicProgress[];
    badges: Badge[];
    achievements: Achievement[];
}
