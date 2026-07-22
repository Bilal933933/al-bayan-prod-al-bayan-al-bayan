export interface OnboardingTopic {
    id: number;
    name: string;
}

export interface OnboardingData {
    topics: OnboardingTopic[];
}

export interface OnboardingPayload {
    topic_ids: number[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    notifications: {
        daily: boolean;
        comp: boolean;
        streak: boolean;
    };
}
