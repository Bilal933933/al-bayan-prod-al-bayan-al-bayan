import { router } from '@inertiajs/react';
import { Clock, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import attempts from '@/routes/student/attempts';
import type { Attempt } from '@/types/attempt';

interface InProgressBannerProps {
    attempt: Attempt & {
        topic?: { id: number; name: string } | null;
        competition?: { id: number; name: string } | null;
    };
}

export function InProgressBanner({ attempt }: InProgressBannerProps) {
    const handleContinue = () => {
        router.visit(attempts.show({ attempt: attempt.id }).url);
    };

    const handleNew = () => {
        if (!confirm('لديك محاولة جارية. هل تريد بدء محاولة جديدة بدلاً من استئناف الحالية؟')) {
            return;
        }
        router.visit(attempts.show({ attempt: attempt.id }).url);
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100/50 to-amber-50 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-amber-950/30 border-2 border-amber-200 dark:border-amber-800 p-6 shadow-lg shadow-amber-500/10">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg">
                        <Clock className="h-8 w-8" />
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                                جارية الآن
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100">لديك محاولة جارية</h2>
                        <p className="text-sm text-amber-700/80 dark:text-amber-300/80">
                            {attempt.topic?.name ?? attempt.competition?.name ?? 'محاولة غير محددة'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                        onClick={handleContinue}
                        size="lg"
                        className="gap-2 bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30"
                    >
                        <Play className="h-4 w-4" />
                        استئناف المحاولة
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleNew}
                        className="gap-2 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                    >
                        <RotateCcw className="h-4 w-4" />
                        محاولة جديدة
                    </Button>
                </div>
            </div>
        </div>
    );
}
