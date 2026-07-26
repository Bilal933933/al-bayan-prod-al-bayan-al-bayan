import { Link } from '@inertiajs/react';
import { Award, ChevronLeft, Medal } from 'lucide-react';
import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
import { Button } from '@/components/ui/button';
import { PreviewBadge } from '@/components/welcome/preview-badge';
import { cn } from '@/lib/utils';
import { register } from '@/routes';
import type { LeaderboardEntry } from '@/types/leaderboard';

interface PodiumTeaserProps {
    podium: LeaderboardEntry[];
    isPreview?: boolean;
}

const rankMeta: Record<number, { color: string; bg: string; label: string }> = {
    1: {
        color: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        label: 'الأول',
    },
    2: {
        color: 'text-slate-400',
        bg: 'bg-slate-50 dark:bg-slate-400/10',
        label: 'الثاني',
    },
    3: {
        color: 'text-orange-400',
        bg: 'bg-orange-50 dark:bg-orange-400/10',
        label: 'الثالث',
    },
};

export function PodiumTeaser({ podium, isPreview }: PodiumTeaserProps) {
    if (podium.length === 0) return null;

    return (
        <div className="mt-20 w-full max-w-5xl">
            <div className="mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold">أبرز المتصدرين</h2>
                {isPreview && <PreviewBadge />}
            </div>

            <div className="rounded-2xl border bg-card/50 p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {podium.map((entry) => {
                        const meta = rankMeta[entry.rank];
                        const avatarUrl =
                            entry.user?.avatar ??
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.user?.name ?? '')}&background=1F6F5C&color=fff&size=64`;

                        return (
                            <div
                                key={entry.rank}
                                className={cn(
                                    'flex flex-col items-center gap-3 rounded-xl p-5 text-center transition-all',
                                    meta.bg,
                                    entry.rank === 1 &&
                                        'sm:-translate-y-2 sm:scale-105',
                                )}
                            >
                                <div className="relative">
                                    <div
                                        className={cn(
                                            'h-16 w-16 overflow-hidden rounded-full ring-2',
                                            entry.rank === 1
                                                ? 'ring-amber-400'
                                                : 'ring-slate-300',
                                        )}
                                    >
                                        {entry.user?.avatar ? (
                                            <img
                                                src={avatarUrl}
                                                alt={entry.user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-bold text-primary">
                                                {entry.user?.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            'absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[11px] font-bold text-white shadow-xs',
                                            entry.rank === 1
                                                ? 'bg-amber-500'
                                                : entry.rank === 2
                                                  ? 'bg-slate-400'
                                                  : 'bg-orange-400',
                                        )}
                                    >
                                        <Medal className="inline h-3 w-3" />{' '}
                                        {meta.label}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm font-bold">
                                        {entry.user?.name ?? '—'}
                                    </p>
                                    <p
                                        className={cn(
                                            'text-xs font-extrabold',
                                            meta.color,
                                        )}
                                    >
                                        <SlidingNumber
                                            number={entry.points}
                                            thousandSeparator=","
                                            inView
                                        />{' '}
                                        نقطة
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 text-center">
                    <Button asChild variant="outline">
                        <Link href={register()}>
                            سجّل لترى ترتيبك
                            <ChevronLeft className="mr-1.5 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
