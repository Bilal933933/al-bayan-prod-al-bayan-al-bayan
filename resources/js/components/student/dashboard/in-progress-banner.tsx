import { router } from '@inertiajs/react';
import { Clock, Play, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import attempts from '@/routes/student/attempts';
import type { Attempt } from '@/types/attempt';

interface InProgressBannerProps {
    attempt: Attempt & {
        topic?: { id: number; name: string } | null;
        competition?: { id: number; name: string } | null;
    };
}

export function InProgressBanner({ attempt }: InProgressBannerProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleContinue = () => {
        router.visit(attempts.show({ attempt: attempt.id }).url);
    };

    const handleNew = () => {
        setConfirmOpen(true);
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border-2 border-warning/30 bg-gradient-to-br from-warning/10 via-warning/20 to-warning/10 p-6 shadow-lg shadow-warning/10 dark:border-warning/30 dark:from-warning/10 dark:via-warning/10 dark:to-warning/10">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-br from-warning/20 to-transparent" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-warning-foreground relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-warning to-warning shadow-lg">
                        <Clock className="h-8 w-8" />
                        <div className="absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-destructive" />
                    </div>
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-warning/20 px-2.5 py-0.5 text-xs font-semibold text-warning">
                                جارية الآن
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-warning">
                            لديك محاولة جارية
                        </h2>
                        <p className="text-sm text-warning/80">
                            {attempt.topic?.name ??
                                attempt.competition?.name ??
                                'محاولة غير محددة'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                        onClick={handleContinue}
                        size="lg"
                        className="text-warning-foreground gap-2 bg-warning shadow-lg shadow-warning/30 hover:bg-warning/90"
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

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>محاولة جديدة</DialogTitle>
                        <DialogDescription>
                            لديك محاولة جارية. هل تريد بدء محاولة جديدة بدلاً من
                            استئناف الحالية؟
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                        >
                            إلغاء
                        </Button>
                        <Button
                            onClick={() => {
                                setConfirmOpen(false);
                                router.visit(
                                    attempts.show({ attempt: attempt.id }).url,
                                );
                            }}
                        >
                            بدء محاولة جديدة
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
