export interface OverallStats {
    total_attempts: number;
    completed_count: number;
    in_progress_count: number;
    average_percentage: number | null;
    best_score: number;
    total_seconds: number;
}

export interface Evaluation {
    level: 'excellent' | 'very_good' | 'good' | 'passable' | 'weak' | 'no_data';
    label: string;
    color: 'emerald' | 'blue' | 'amber' | 'orange' | 'red' | 'gray';
}

export interface TopicBreakdownItem {
    topic_id: number;
    topic_name: string;
    attempts_count: number;
    average_percentage: number;
    best_score: number;
    status: 'strength' | 'average' | 'weakness';
}

export interface CompetitionBreakdownItem {
    competition_id: number;
    competition_name: string;
    attempts_count: number;
    average_percentage: number;
    best_score: number;
}

export interface RecentResult {
    id: number;
    type: 'practice' | 'exam';
    subject_name: string;
    correct_answers: number;
    total_questions: number;
    percentage: number;
    created_at: string;
}

export interface ProgressPoint {
    date: string;
    percentage: number;
    type: 'practice' | 'exam';
}
