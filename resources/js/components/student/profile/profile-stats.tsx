import { Clock, Gauge, Layers, Trophy } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import type { ProfileStats } from '@/types/profile';

interface ProfileStatsGridProps {
    stats: ProfileStats;
}

export function ProfileStatsGrid({ stats }: ProfileStatsGridProps) {
    const items = [
        {
            icon: Layers,
            label: 'محاولات',
            value: stats.total_attempts,
            iconColor: 'text-blue-600',
            bgColor: 'bg-gradient-to-br from-blue-500/10 to-blue-500/20',
            borderColor: 'border-blue-500/30',
        },
        {
            icon: Gauge,
            label: 'متوسط النتيجة',
            value: stats.avg_score_percentage !== null ? `${stats.avg_score_percentage}%` : '—',
            iconColor: 'text-emerald-600',
            bgColor: 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/20',
            borderColor: 'border-emerald-500/30',
        },
        {
            icon: Trophy,
            label: 'مسابقات',
            value: stats.competitions_count,
            iconColor: 'text-amber-600',
            bgColor: 'bg-gradient-to-br from-amber-500/10 to-amber-500/20',
            borderColor: 'border-amber-500/30',
        },
        {
            icon: Clock,
            label: 'متوسط الوقت',
            value: stats.avg_time_formatted,
            iconColor: 'text-purple-600',
            bgColor: 'bg-gradient-to-br from-purple-500/10 to-purple-500/20',
            borderColor: 'border-purple-500/30',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((item) => (
                <StatCard key={item.label} {...item} />
            ))}
        </div>
    );
}
