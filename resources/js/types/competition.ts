export interface ChildCompetition {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
    description: string | null;
}

export interface Competition {
    id: number;
    parent_id: number | null;
    classification: 'container' | 'standalone' | 'child';
    order: number;
    code: string;
    slug: string;
    name: string;
    image: string | null;
    image_url: string | null;
    color: string | null;
    icon: string | null;
    description: string | null;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    parent?: Competition | null;
    children_count?: number;
    users_count?: number;
    topics_count?: number;
    user_attempts_count?: number;
    last_attempt_at?: string | null;
    joined_at?: string | null;
    can_have_topics?: boolean;
    created_at: string;
    updated_at: string;
}

export interface CompetitionFormData {
    parent_id: number | null;
    classification: 'container' | 'standalone' | 'child';
    order: number;
    code: string;
    name: string;
    slug?: string | null;
    image: string | null;
    color: string | null;
    icon: string | null;
    description: string | null;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    image_file?: File | null;
}
