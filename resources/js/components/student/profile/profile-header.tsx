import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';

interface ProfileHeaderProps {
    name: string;
    email: string;
    initial: string;
    streakDays: number;
    totalPoints: number;
}

export function ProfileHeader({
    name,
    email,
    initial,
    streakDays,
    totalPoints,
}: ProfileHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="to-primary-dark ring-primary-light flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary text-3xl font-extrabold text-white ring-4">
                {initial}
            </div>
            <div className="min-w-0">
                <h2 className="truncate text-xl font-bold">{name}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{email}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                    {streakDays > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            <span aria-hidden="true">🔥</span>{' '}
                            <SlidingNumber number={streakDays} /> يوم متتالي
                        </span>
                    )}
                    {totalPoints > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                            ⭐{' '}
                            <SlidingNumber
                                number={totalPoints}
                                thousandSeparator=","
                            />{' '}
                            نقطة
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
