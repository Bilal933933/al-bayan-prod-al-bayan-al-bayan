export interface KpiStats {
    students_count: number;
    active_streaks: number;
    attempts: {
        total: number;
        in_progress: number;
        completion_rate: number;
    };
    questions: {
        total: number;
        distribution: { easy: number; medium: number; hard: number };
    };
    competitions: {
        total: number;
        containers: number;
    };
}

export interface RecentAttempt {
    id: number;
    type: 'practice' | 'exam';
    status: 'in_progress' | 'completed' | 'abandoned';
    correct_answers: number;
    total_questions: number;
    created_at: string;
    user: { id: number; name: string; streak_days: number };
    competition?: {
        id: number;
        name: string;
        color: string;
        icon: string;
    } | null;
    topic?: { id: number; name: string } | null;
    score?: { points: number } | null;
}

export interface TopicAnalytic {
    name: string;
    fail_rate: number;
}

export interface CompetitionMonitorData {
    name: string;
    students_count: number;
    abandoned_attempts: number;
}

export interface DashboardProps {
    stats: KpiStats;
    recentAttempts: RecentAttempt[];
    topicPerformance: TopicAnalytic[];
    competitionsMonitor: CompetitionMonitorData[];
    systemHealthCount: number;
}
