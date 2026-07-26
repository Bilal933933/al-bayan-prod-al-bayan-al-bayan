import type { Achievement } from '@/types/profile';

interface AchievementsListProps {
    achievements: Achievement[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
    if (!achievements.length) {
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                    🏆
                </span>
                <h3 className="text-sm font-bold">أفضل الإنجازات</h3>
            </div>
            <div className="space-y-2.5">
                {achievements.map((item, i) => (
                    <div
                        key={i}
                        className="hover:bg-primary-light flex items-center gap-3.5 rounded-xl bg-muted p-3.5 transition-all"
                    >
                        <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl"
                            style={{ backgroundColor: item.iconBg }}
                        >
                            {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold">
                                {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {item.description}
                            </div>
                        </div>
                        <div className="shrink-0 text-xs text-muted-foreground">
                            {item.date}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
