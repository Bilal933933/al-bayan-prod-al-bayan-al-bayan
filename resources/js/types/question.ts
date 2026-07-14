export interface QuestionOption {
    id?: number;
    text: string;
    is_correct: boolean;
}

export interface Question {
    id: number;
    topic_id: number;
    type: 'mcq' | 'true_false';
    text: string;
    difficulty: 'easy' | 'medium' | 'hard';
    explanation: string | null;
    is_active: boolean;
    topic?: { id: number; name: string };
    options?: QuestionOption[];
    options_count?: number;
    created_at: string;
    updated_at: string;
}

export interface QuestionFormData {
    topic_id: number | string;
    type: 'mcq' | 'true_false';
    text: string;
    difficulty: 'easy' | 'medium' | 'hard';
    explanation: string | null;
    is_active: boolean;
    options: { text: string; is_correct: boolean }[];
}
