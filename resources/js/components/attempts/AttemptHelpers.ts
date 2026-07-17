export const typeLabels: Record<string, string> = {
    practice: 'تدريب حر',
    exam: 'محاكاة اختبار',
};

export const statusConfig: Record<string, { label: string; classes: string }> = {
    in_progress: { label: 'قيد التنفيذ', classes: 'bg-info/20 text-info border-info/30' },
    completed: { label: 'مكتمل', classes: 'bg-success/20 text-success border-success/30' },
    abandoned: { label: 'ملغي', classes: 'bg-muted text-muted-foreground border-border' },
};

export const difficultyLabels: Record<string, string> = {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
};

export const difficultyColors: Record<string, string> = {
    easy: 'bg-success/20 text-success',
    medium: 'bg-warning/20 text-warning',
    hard: 'bg-destructive/20 text-destructive',
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
