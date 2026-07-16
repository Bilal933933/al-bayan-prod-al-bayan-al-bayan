import { Sparkles, Trophy } from 'lucide-react';

interface WelcomeSectionProps {
    user: { name: string };
    stats: {
        total_attempts: number;
        completed_attempts: number;
        average_percentage: number | null;
    };
}

export function WelcomeSection({ user, stats }: WelcomeSectionProps) {
    const showAverage = stats.total_attempts > 0 && stats.average_percentage !== null;

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="relative flex items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-6 w-6 text-yellow-300" />
                        <span className="text-sm font-medium text-white/90">مرحباً بك، {user.name}!</span>
                    </div>
                    <h1 className="text-3xl font-bold sm:text-4xl mb-3">لوحة التحكم</h1>
                    <p className="text-lg text-white/80 max-w-lg leading-relaxed">
                        {stats.total_attempts > 0
                            ? `أكملت ${stats.completed_attempts} من ${stats.total_attempts} محاولة. استمر في التقدم!`
                            : 'ابدأ رحلتك التعليمية بالتدريب الحر والمسابقات'}
                    </p>
                    {showAverage && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                            <Trophy className="h-4 w-4 text-yellow-300" />
                            <span>متوسط النتيجة: {stats.average_percentage}%</span>
                        </div>
                    )}
                </div>
                <div className="hidden sm:flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm border-2 border-white/30">
                    <Trophy className="h-10 w-10" />
                </div>
            </div>
        </div>
    );
}
