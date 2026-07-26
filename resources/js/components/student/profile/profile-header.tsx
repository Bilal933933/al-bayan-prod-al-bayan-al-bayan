import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileHeaderProps {
    name: string;
    email: string;
    initial: string;
    avatar?: string | null;
    streakDays: number;
    totalPoints: number;
}

export function ProfileHeader({
    name,
    email,
    initial,
    avatar,
    streakDays,
    totalPoints,
}: ProfileHeaderProps) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-ink-soft to-brand-ink p-6 text-brand-surface sm:p-8">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-brand-gold/10 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 rounded-2xl border border-dashed border-brand-gold/25 sm:inset-4"
            />
            <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-start">
                <div className="relative shrink-0">
                    <Avatar className="h-24 w-24 rounded-full ring-4 ring-brand-gold/40">
                        <AvatarImage
                            src={avatar ?? undefined}
                            alt={name}
                            className="h-full w-full rounded-full object-cover"
                        />
                        <AvatarFallback className="rounded-full bg-gradient-to-br from-brand-teal-soft to-brand-teal font-heading text-3xl font-bold text-brand-ink-deep">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="min-w-0">
                    <h2 className="truncate font-heading text-2xl font-bold tracking-tight text-brand-surface sm:text-[28px]">
                        {name}
                    </h2>
                    <p className="mt-1 text-sm text-brand-surface/60">
                        {email}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                        {streakDays > 0 && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-surface/10 px-3 py-1.5 text-xs font-semibold text-brand-surface ring-1 ring-brand-surface/15">
                                <span aria-hidden="true">🔥</span>
                                <span className="font-mono-num">
                                    <SlidingNumber number={streakDays} />
                                </span>
                                يوم متتالي
                            </span>
                        )}
                        {totalPoints > 0 && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/15 px-3 py-1.5 text-xs font-semibold text-brand-gold-soft ring-1 ring-brand-gold/25">
                                <span aria-hidden="true">⭐</span>
                                <span className="font-mono-num">
                                    <SlidingNumber
                                        number={totalPoints}
                                        thousandSeparator=","
                                    />
                                </span>
                                نقطة
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
