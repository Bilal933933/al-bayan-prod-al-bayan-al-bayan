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
    parent?: Competition | null;
    children_count?: number;
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
    image: string | null;
    color: string | null;
    icon: string | null;
    description: string | null;
    is_active: boolean;
    image_file?: File | null;
}
