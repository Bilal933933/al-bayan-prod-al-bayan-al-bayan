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
            iconColor: 'text-brand-teal',
            bgColor: 'bg-gradient-to-br from-brand-teal/10 to-brand-teal/20',
            borderColor: 'border-brand-teal/20',
        },
        {
            icon: Gauge,
            label: 'متوسط النتيجة',
            value:
                stats.avg_score_percentage !== null
                    ? `${stats.avg_score_percentage}%`
                    : '—',
            iconColor: 'text-brand-sky',
            bgColor: 'bg-gradient-to-br from-brand-sky/10 to-brand-sky/20',
            borderColor: 'border-brand-sky/20',
        },
        {
            icon: Trophy,
            label: 'مسابقات',
            value: stats.competitions_count,
            iconColor: 'text-brand-gold',
            bgColor: 'bg-gradient-to-br from-brand-gold/10 to-brand-gold/20',
            borderColor: 'border-brand-gold/20',
        },
        {
            icon: Clock,
            label: 'متوسط الوقت',
            value: stats.avg_time_formatted,
            iconColor: 'text-brand-brick',
            bgColor: 'bg-gradient-to-br from-brand-brick/10 to-brand-brick/20',
            borderColor: 'border-brand-brick/20',
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
