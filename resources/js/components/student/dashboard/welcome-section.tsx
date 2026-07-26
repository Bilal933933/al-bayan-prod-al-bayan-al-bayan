import { Sparkles, Trophy } from 'lucide-react';

import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';

interface WelcomeSectionProps {
    user: { name: string };
    stats: {
        total_attempts: number;
        completed_attempts: number;
        average_percentage: number | null;
    };
}

function GeometricMotif({ className = '' }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="dashboard-bayan-motif"
                    width="64"
                    height="64"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M32 4 L38 22 L57 22 L42 33 L48 51 L32 40 L16 51 L22 33 L7 22 L26 22 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                </pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                fill="url(#dashboard-bayan-motif)"
            />
        </svg>
    );
}

export function WelcomeSection({ user, stats }: WelcomeSectionProps) {
    const showAverage =
        stats.total_attempts > 0 && stats.average_percentage !== null;

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 text-white shadow-2xl sm:p-9">
            <GeometricMotif className="absolute inset-0 h-full w-full text-white/[0.06]" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

            <div className="relative flex items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="mb-3 flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-yellow-300" />
                        <span className="text-sm font-medium text-white/90">
                            مرحباً بك، {user.name}!
                        </span>
                    </div>
                    <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        لوحة التحكم
                    </h1>
                    <p className="max-w-lg text-lg leading-relaxed text-white/80">
                        {stats.total_attempts > 0 ? (
                            <>
                                أكملت{' '}
                                <SlidingNumber
                                    number={stats.completed_attempts}
                                />{' '}
                                من{' '}
                                <SlidingNumber number={stats.total_attempts} />{' '}
                                محاولة. استمر في التقدم!
                            </>
                        ) : (
                            'ابدأ رحلتك التعليمية بالتدريب الحر والمسابقات'
                        )}
                    </p>
                    {showAverage && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                            <Trophy className="h-4 w-4 text-yellow-300" />
                            <span>
                                متوسط النتيجة:{' '}
                                <span dir="ltr">
                                    <SlidingNumber
                                        number={stats.average_percentage ?? 0}
                                    />
                                    %
                                </span>
                            </span>
                        </div>
                    )}
                </div>
                <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl border-2 border-white/30 bg-white/20 backdrop-blur-sm sm:flex">
                    <Trophy className="h-10 w-10" />
                </div>
            </div>
        </div>
    );
}
