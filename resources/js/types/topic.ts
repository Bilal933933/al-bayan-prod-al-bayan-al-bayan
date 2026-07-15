export interface BestScore {
    correct: number;
    total: number;
}

export interface Topic {
    id: number;
    code: string;
    name: string;
    visibility: 'general' | 'private';
    description: string | null;
    default_questions_count: number;
    default_duration_minutes: number | null;
    is_active: boolean;
    competitions_count?: number;
    user_attempts_count?: number;
    has_in_progress?: boolean;
    in_progress_attempt_id?: number | null;
    best_score?: BestScore | null;
    created_at: string;
    updated_at: string;
}

export interface CompetitionTopicPivot {
    questions_count: number;
    duration_minutes: number;
    difficulty_distribution: Record<string, number> | null;
}

export interface TopicWithPivot extends Topic {
    pivot: CompetitionTopicPivot;
}

export interface TopicFormData {
    code: string;
    name: string;
    visibility: 'general' | 'private';
    description: string | null;
    default_questions_count: number;
    default_duration_minutes: number | null;
    is_active: boolean;
}
