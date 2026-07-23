import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types/leaderboard';

interface PodiumCardProps {
    entry: LeaderboardEntry | null;
    rank: number;
    isFirst?: boolean;
    className?: string;
}

const crownEmoji = '\uD83D\uDC51';
const fireEmoji = '\uD83D\uDD25';

const rankStyles: Record<number, { ring: string; shadow: string; gradient: string; badge: string }> = {
    1: {
        ring: 'ring-4 ring-amber-400',
        shadow: 'shadow-xl shadow-amber-200/50',
        gradient: 'from-amber-50/80 to-white',
        badge: 'bg-amber-400',
    },
    2: {
        ring: 'ring-2 ring-slate-300',
        shadow: 'shadow-lg shadow-slate-200/50',
        gradient: 'from-slate-50/80 to-white',
        badge: 'bg-slate-400',
    },
    3: {
        ring: 'ring-2 ring-orange-300',
        shadow: 'shadow-lg shadow-orange-200/50',
        gradient: 'from-orange-50/80 to-white',
        badge: 'bg-orange-400',
    },
};

export function PodiumCard({ entry, rank, isFirst, className }: PodiumCardProps) {
    if (!entry || !entry.user) {
return null;
}

    const styles = rankStyles[rank];
    const avatarUrl = entry.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.user.name)}&background=random&size=80`;

    return (
        <div
            className={cn(
                'flex flex-col items-center rounded-3xl border p-6 shadow-sm transition-all duration-300',
                styles.gradient,
                styles.shadow,
                isFirst ? 'z-10 w-full max-w-[220px] -translate-y-4 scale-105 border-amber-100' : 'w-full max-w-[200px] border-slate-100',
                className,
            )}
        >
            <div className="relative">
                {isFirst && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
                        {crownEmoji}
                    </div>
                )}

                <div className={cn('h-20 w-20 overflow-hidden rounded-full', styles.ring)}>
                    <img src={avatarUrl} alt={entry.user.name} className="h-full w-full object-cover" />
                </div>

                <span
                    className={cn(
                        'absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-xs font-bold text-white shadow-sm',
                        styles.badge,
                    )}
                >
                    {rank}
                </span>
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-800">{entry.user.name}</h3>
            <p className={cn('mt-1 text-sm font-extrabold', rank === 1 ? 'text-amber-600' : 'text-slate-600')}>
                <SlidingNumber number={entry.points} thousandSeparator="," inView /> نقطة
            </p>

            {entry.streak_days > 0 && (
                <span className="mt-2 flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                    {fireEmoji} <SlidingNumber number={entry.streak_days} inView /> يوم متتالي
                </span>
            )}
        </div>
    );
}
