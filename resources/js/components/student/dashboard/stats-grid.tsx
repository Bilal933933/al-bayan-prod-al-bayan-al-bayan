import { Layers, Play, Trophy } from 'lucide-react';
import { StatCard } from '@/components/stat-card';

interface StatsGridProps {
    stats: {
        total_attempts: number;
        completed_attempts: number;
        in_progress_attempts: number;
        average_percentage: number | null;
    };
}

const statItems = [
    {
        icon: Layers,
        label: 'إجمالي المحاولات',
        getValue: (s: StatsGridProps['stats']) => s.total_attempts,
        iconColor: 'text-blue-600',
        bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/40',
        borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
        icon: Trophy,
        label: 'المحاولات المكتملة',
        getValue: (s: StatsGridProps['stats']) => s.completed_attempts,
        iconColor: 'text-emerald-600',
        bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/40',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
    {
        icon: Play,
        label: 'قيد التنفيذ',
        getValue: (s: StatsGridProps['stats']) => s.in_progress_attempts,
        iconColor: 'text-amber-600',
        bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/40',
        borderColor: 'border-amber-200 dark:border-amber-800',
    },
    {
        icon: Trophy,
        label: 'متوسط النتيجة',
        getValue: (s: StatsGridProps['stats']) => s.average_percentage !== null ? `${s.average_percentage}%` : '—',
        iconColor: 'text-purple-600',
        bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/40',
        borderColor: 'border-purple-200 dark:border-purple-800',
    },
];

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map(({ icon, label, getValue, iconColor, bgColor, borderColor }) => (
                <StatCard
                    key={label}
                    icon={icon}
                    label={label}
                    value={getValue(stats)}
                    iconColor={iconColor}
                    bgColor={bgColor}
                    borderColor={borderColor}
                />
            ))}
        </div>
    );
}
