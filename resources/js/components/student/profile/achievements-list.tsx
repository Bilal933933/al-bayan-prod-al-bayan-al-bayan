import { ProfileSection } from '@/components/student/profile/profile-section';
import type { Achievement } from '@/types/profile';

const iconBgMap: Record<string, string> = {
    info: 'bg-brand-sky/20 text-brand-sky',
    accent: 'bg-brand-gold/20 text-brand-gold',
    success: 'bg-brand-teal/20 text-brand-teal',
    destructive: 'bg-brand-brick/20 text-brand-brick',
};

interface AchievementsListProps {
    achievements: Achievement[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
    if (!achievements.length) {
        return null;
    }

    return (
        <ProfileSection
            icon={<span className="text-lg">🏆</span>}
            title="أفضل الإنجازات"
        >
            <div className="space-y-2.5">
                {achievements.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3.5 rounded-xl bg-muted p-3.5 transition-all hover:bg-brand-teal/5"
                    >
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${iconBgMap[item.iconBg] ?? 'bg-muted-foreground/10 text-muted-foreground'}`}
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
        </ProfileSection>
    );
}
