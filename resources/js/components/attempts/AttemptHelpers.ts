export const typeLabels: Record<string, string> = {
    practice: 'تدريب حر',
    exam: 'محاكاة اختبار',
};

export const statusConfig: Record<string, { label: string; classes: string }> =
    {
        in_progress: {
            label: 'قيد التنفيذ',
            classes: 'bg-info/20 text-info border-info/30',
        },
        completed: {
            label: 'مكتمل',
            classes: 'bg-success/20 text-success border-success/30',
        },
        abandoned: {
            label: 'ملغي',
            classes: 'bg-muted text-muted-foreground border-border',
        },
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

function timeWord(
    count: number,
    singular: string,
    dual: string,
    plural: string,
): string {
    if (count === 1) {
        return `${singular} واحدة`;
    }

    if (count === 2) {
        return dual;
    }

    if (count <= 10) {
        return `${count} ${plural}`;
    }

    return `${count} ${singular}`;
}

export function formatDuration(seconds: number): string {
    const abs = Math.abs(seconds);
    const h = Math.floor(abs / 3600);
    const m = Math.floor((abs % 3600) / 60);
    const s = Math.floor(abs % 60);

    const parts: string[] = [];

    if (h > 0) {
        parts.push(timeWord(h, 'ساعة', 'ساعتان', 'ساعات'));
    }

    if (m > 0) {
        parts.push(timeWord(m, 'دقيقة', 'دقيقتان', 'دقائق'));
    }

    if (s > 0) {
        parts.push(timeWord(s, 'ثانية', 'ثانيتان', 'ثوانٍ'));
    }

    if (parts.length === 0) {
        return '0 ثوانٍ';
    }

    if (parts.length === 1) {
        return parts[0];
    }

    return parts.slice(0, -1).join(' و ') + ' و ' + parts[parts.length - 1];
}

export function getDurationSeconds(
    startedAt: string,
    finishedAt: string | null,
): number {
    if (!finishedAt) {
        return 0;
    }

    return Math.max(
        0,
        Math.round(
            (new Date(finishedAt).getTime() - new Date(startedAt).getTime()) /
                1000,
        ),
    );
}

export const FILTERS = [
    { value: 'all', label: 'الكل', countKey: undefined },
    { value: 'wrong', label: 'الخاطئة', countKey: 'wrong' as const },
    { value: 'unanswered', label: 'لم تُجب', countKey: 'unanswered' as const },
] as const;
