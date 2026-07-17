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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning/10 via-warning/20 to-warning/10 dark:from-warning/10 dark:via-warning/10 dark:to-warning/10 border-2 border-warning/30 dark:border-warning/30 p-6 shadow-lg shadow-warning/10">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-warning/20 to-transparent rounded-bl-full" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-warning to-warning text-warning-foreground shadow-lg">
                        <Clock className="h-8 w-8" />
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center rounded-full bg-warning/20 px-2.5 py-0.5 text-xs font-semibold text-warning">
                                جارية الآن
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-warning">لديك محاولة جارية</h2>
                        <p className="text-sm text-warning/80">
                            {attempt.topic?.name ?? attempt.competition?.name ?? 'محاولة غير محددة'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                        onClick={handleContinue}
                        size="lg"
                        className="gap-2 bg-warning hover:bg-warning/90 text-warning-foreground shadow-lg shadow-warning/30"
                    >
                        <Play className="h-4 w-4" />
                        استئناف المحاولة
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleNew}
                        className="gap-2 border-warning/50 hover:bg-warning/10"
                    >
                        <RotateCcw className="h-4 w-4" />
                        محاولة جديدة
                    </Button>
                </div>
            </div>
        </div>
    );
}
