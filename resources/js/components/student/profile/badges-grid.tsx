import { ProfileSection } from '@/components/student/profile/profile-section';
import type { Badge } from '@/types/profile';

interface BadgesGridProps {
    badges: Badge[];
}

export function BadgesGrid({ badges }: BadgesGridProps) {
    if (!badges.length) {
        return null;
    }

    return (
        <ProfileSection
            icon={<span className="text-lg">🏅</span>}
            title="الشارات"
        >
            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8">
                {badges.map((badge, i) => (
                    <div
                        key={i}
                        className="group flex cursor-pointer flex-col items-center gap-1.5 rounded-xl bg-muted p-3.5 transition-all hover:scale-105 hover:bg-brand-teal/10"
                    >
                        <span className="text-2xl transition-transform group-hover:scale-110">
                            {badge.emoji}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">
                            {badge.name}
                        </span>
                    </div>
                ))}
            </div>
        </ProfileSection>
    );
}
