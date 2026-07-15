import { BarChart3, BookOpen, Clock, TrendingUp } from 'lucide-react';

interface TopicStatsBarProps {
    totalAttempts: number;
    uniqueTopics: number;
    averageScore: number | null;
    lastPracticeLabel: string | null;
}

export function TopicStatsBar({ totalAttempts, uniqueTopics, averageScore, lastPracticeLabel }: TopicStatsBarProps) {
    if (totalAttempts === 0) return null;

    const items = [
        {
            icon: BarChart3,
            label: 'إجمالي المحاولات',
            value: totalAttempts,
        },
        {
            icon: BookOpen,
            label: 'محاور تم تدربها',
            value: uniqueTopics,
        },
        ...(averageScore !== null
            ? [{ icon: TrendingUp, label: 'متوسط النتيجة', value: `${Math.round(averageScore)}%` }]
            : []),
        ...(lastPracticeLabel
            ? [{ icon: Clock, label: 'آخر تدريب', value: lastPracticeLabel }]
            : []),
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((item) => (
                <div key={item.label} className="rounded-lg border bg-card px-4 py-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <item.icon className="h-3.5 w-3.5" />
                        <span>{item.label}</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold">{item.value}</p>
                </div>
            ))}
        </div>
    );
}
