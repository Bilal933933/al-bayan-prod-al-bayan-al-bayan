import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
import type { LeaderboardEntry } from '@/types/leaderboard';

interface RankingRowProps {
    entry: LeaderboardEntry;
}

const fireEmoji = '\uD83D\uDD25';

export function RankingRow({ entry }: RankingRowProps) {
    if (!entry.user) {
return null;
}

    const avatarUrl = entry.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.user.name)}&background=random&size=44`;

    return (
        <div className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md">
            <div className="flex items-center gap-4">
                <span className="w-6 text-center text-sm font-extrabold text-slate-400 group-hover:text-slate-600">
                    #{entry.rank}
                </span>

                <div className="relative">
                    <div className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-slate-100">
                        <img src={avatarUrl} alt={entry.user.name} className="h-full w-full object-cover" />
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-slate-700 transition-colors group-hover:text-emerald-700">
                        {entry.user.name}
                    </h4>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <span className="block text-sm font-extrabold text-slate-700">
                        <SlidingNumber number={entry.points} thousandSeparator="," inView />
                    </span>
                </div>

                {entry.streak_days > 0 && (
                    <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                        {fireEmoji} <SlidingNumber number={entry.streak_days} inView />
                    </span>
                )}

                {entry.trend === 'up' && (
                    <span className="rounded-xl bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-500">
                        ▲ {entry.trend_value}
                    </span>
                )}
                {entry.trend === 'down' && (
                    <span className="rounded-xl bg-red-50 px-2 py-1 text-xs font-bold text-red-400">
                        ▼ {entry.trend_value}
                    </span>
                )}
                {entry.trend === 'same' && (
                    <span className="rounded-xl bg-slate-50 px-2 py-1 text-xs font-bold text-slate-400">
                        –
                    </span>
                )}
            </div>
        </div>
    );
}
