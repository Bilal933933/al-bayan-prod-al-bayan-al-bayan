import { BarChart3, BookCheck, Clock, Play } from 'lucide-react';

interface AttemptStats {
    total: number;
    completed: number;
    in_progress: number;
    average_percentage: number | null;
}

export function AttemptStatsBar({ stats }: { stats: AttemptStats }) {
    if (stats.total === 0) {
        return null;
    }

    const items = [
        { icon: BarChart3, label: 'إجمالي المحاولات', value: stats.total },
        { icon: BookCheck, label: 'مكتملة', value: stats.completed },
        { icon: Play, label: 'قيد التنفيذ', value: stats.in_progress },
        ...(stats.average_percentage !== null
            ? [
                  {
                      icon: Clock,
                      label: 'متوسط النتيجة',
                      value: `${Math.round(stats.average_percentage)}%`,
                  },
              ]
            : []),
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((item) => (
                <div
                    key={item.label}
                    className="rounded-lg border bg-card px-4 py-3"
                >
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
