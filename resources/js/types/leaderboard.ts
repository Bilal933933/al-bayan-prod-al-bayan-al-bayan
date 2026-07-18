export interface LeaderboardUser {
    id: number;
    name: string;
    avatar: string | null;
}

export interface LeaderboardEntry {
    rank: number;
    user: LeaderboardUser | null;
    points: number;
    points_formatted: string;
    streak_days: number;
    trend: 'up' | 'down' | 'same' | null;
    trend_value: number;
}

export interface CurrentUserInfo {
    rank: number;
    points: number;
    points_formatted: string;
    streak_days: number;
    points_to_next_rank: number;
    points_to_next_rank_formatted: string;
}

export interface PeriodOption {
    key: 'weekly' | 'monthly' | 'all_time';
    label: string;
}

export interface LeaderboardPageProps {
    podium: LeaderboardEntry[];
    rankings: LeaderboardEntry[];
    currentUser: CurrentUserInfo | null;
    periods: PeriodOption[];
    currentPeriod: string;
}
