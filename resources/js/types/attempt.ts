import type { Question, QuestionOption } from './question';

export interface AttemptQuestion {
    id: number;
    attempt_section_id: number;
    question_id: number;
    selected_option_id: number | null;
    is_correct: boolean | null;
    order: number;
    question: Question;
    selected_option?: QuestionOption | null;
}

export interface AttemptSection {
    id: number;
    attempt_id: number;
    topic_id: number;
    topic?: { id: number; name: string } | null;
    questions_count: number;
    duration_minutes: number | null;
    order: number;
    questions: AttemptQuestion[];
    submitted_at?: string | null;
    started_at?: string | null;
}

export interface Attempt {
    id: number;
    user_id: number;
    type: 'practice' | 'exam';
    subject_name: string;
    topic_id: number | null;
    competition_id: number | null;
    status: 'in_progress' | 'completed' | 'abandoned';
    started_at: string;
    finished_at: string | null;
    total_questions: number;
    correct_answers: number;
    sections: AttemptSection[];
    created_at: string;
    updated_at: string;
}
