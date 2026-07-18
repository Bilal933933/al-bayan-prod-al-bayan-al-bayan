import { Layers, Play, Trophy, Flame } from 'lucide-react';
import { StatCard } from '@/components/stat-card';

interface StatsGridProps {
    stats: {
        total_attempts: number;
        completed_attempts: number;
        in_progress_attempts: number;
        average_percentage: number | null;
        streak_days?: number;
    };
}

const statItems = [
    {
        icon: Layers,
        label: 'إجمالي المحاولات',
        getValue: (s: StatsGridProps['stats']) => s.total_attempts,
        iconColor: 'text-palette-1',
        bgColor: 'bg-gradient-to-br from-palette-1/10 to-palette-1/20 dark:from-palette-1/20 dark:to-palette-1/30',
        borderColor: 'border-palette-1/30 dark:border-palette-1/40',
    },
    {
        icon: Trophy,
        label: 'المحاولات المكتملة',
        getValue: (s: StatsGridProps['stats']) => s.completed_attempts,
        iconColor: 'text-palette-2',
        bgColor: 'bg-gradient-to-br from-palette-2/10 to-palette-2/20 dark:from-palette-2/20 dark:to-palette-2/30',
        borderColor: 'border-palette-2/30 dark:border-palette-2/40',
    },
    {
        icon: Play,
        label: 'قيد التنفيذ',
        getValue: (s: StatsGridProps['stats']) => s.in_progress_attempts,
        iconColor: 'text-palette-4',
        bgColor: 'bg-gradient-to-br from-palette-4/10 to-palette-4/20 dark:from-palette-4/20 dark:to-palette-4/30',
        borderColor: 'border-palette-4/30 dark:border-palette-4/40',
    },
    {
        icon: Trophy,
        label: 'متوسط النتيجة',
        getValue: (s: StatsGridProps['stats']) => s.average_percentage !== null ? `${s.average_percentage}%` : '—',
        iconColor: 'text-palette-3',
        bgColor: 'bg-gradient-to-br from-palette-3/10 to-palette-3/20 dark:from-palette-3/20 dark:to-palette-3/30',
        borderColor: 'border-palette-3/30 dark:border-palette-3/40',
    },
    {
        icon: Flame,
        label: 'أيام المواظبة',
        getValue: (s: StatsGridProps['stats']) => s.streak_days !== undefined ? `${s.streak_days} يوم` : '—',
        iconColor: 'text-orange-500',
        bgColor: 'bg-gradient-to-br from-orange-500/10 to-orange-500/20 dark:from-orange-500/20 dark:to-orange-500/30',
        borderColor: 'border-orange-500/30 dark:border-orange-500/40',
    },
];

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
