import type { CurrentUserInfo } from '@/types/leaderboard';

interface StickyUserBarProps {
    currentUser: CurrentUserInfo | null;
}

export function StickyUserBar({ currentUser }: StickyUserBarProps) {
    if (!currentUser) {
return null;
}

    if (currentUser.rank <= 10) {
return null;
}

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-slate-400">#{currentUser.rank}</span>
                    <div>
                        <span className="text-sm font-bold text-slate-700">
                            {currentUser.points_formatted} نقطة
                        </span>
                    </div>
                </div>

                {currentUser.points_to_next_rank > 0 && (
                    <div className="text-center text-sm text-slate-500">
                        يفصلك{' '}
                        <span className="font-bold text-emerald-600">
                            {currentUser.points_to_next_rank_formatted}
                        </span>{' '}
                        نقطة للوصول إلى المركز العاشر!
                    </div>
                )}

                <div className="text-right">
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                        <span aria-hidden="true">🔥</span> {currentUser.streak_days} يوم متتالي
                    </span>
                </div>
            </div>
        </div>
    );
}
