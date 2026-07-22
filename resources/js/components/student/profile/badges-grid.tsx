import type { Badge } from '@/types/profile';

interface BadgesGridProps {
    badges: Badge[];
}

export function BadgesGrid({ badges }: BadgesGridProps) {
    if (!badges.length) {
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">🏅</span>
                <h3 className="text-sm font-bold">الشارات</h3>
            </div>
            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8">
                {badges.map((badge, i) => (
                    <div
                        key={i}
                        className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl bg-muted p-3.5 transition-all hover:scale-105 hover:bg-primary-light"
                    >
                        <span className="text-2xl">{badge.emoji}</span>
                        <span className="text-xs font-semibold">{badge.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
