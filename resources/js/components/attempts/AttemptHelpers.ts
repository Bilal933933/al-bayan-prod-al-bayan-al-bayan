export const typeLabels: Record<string, string> = {
    practice: 'تدريب حر',
    exam: 'محاكاة اختبار',
};

export const statusConfig: Record<string, { label: string; classes: string }> = {
    in_progress: { label: 'قيد التنفيذ', classes: 'bg-blue-100 text-blue-700 border-blue-200' },
    completed: { label: 'مكتمل', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    abandoned: { label: 'ملغي', classes: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export const difficultyLabels: Record<string, string> = {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
};

export const difficultyColors: Record<string, string> = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
};

export function formatDuration(seconds: number): string {
    const abs = Math.abs(seconds);
    const h = Math.floor(abs / 3600);
    const m = Math.floor((abs % 3600) / 60);
    const s = Math.floor(abs % 60);

    if (h > 0) {
return `${h}س ${m}د`;
}

    if (m > 0) {
return `${m}د ${s}ث`;
}

    return `${s}ث`;
}

export function getDurationSeconds(startedAt: string, finishedAt: string | null): number {
    if (!finishedAt) {
return 0;
}

    return Math.max(0, Math.round((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000));
}

export const FILTERS = [
    { value: 'all', label: 'الكل', countKey: undefined },
    { value: 'wrong', label: 'الخاطئة', countKey: 'wrong' as const },
    { value: 'unanswered', label: 'لم تُجب', countKey: 'unanswered' as const },
] as const;
