import { Link, router } from '@inertiajs/react';
import { Award, CheckCircle, Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getColor } from './topic-colors';
import type { BestScore } from '@/types/topic';

interface TopicCardProps {
    id: number;
    name: string;
    description?: string | null;
    questionsCount?: number;
    durationMinutes?: number | null;
    userAttemptsCount?: number;
    hasInProgress?: boolean;
    inProgressAttemptId?: number | null;
    bestScore?: BestScore | null;
    competitionId?: number;
    href?: string;
}

export default function TopicCard({
    id,
    name,
    description,
    questionsCount = 10,
    durationMinutes = 15,
    userAttemptsCount = 0,
    hasInProgress = false,
    inProgressAttemptId,
    bestScore,
    competitionId,
    href,
}: TopicCardProps) {
    const colors = getColor(id);

    const scorePercent = bestScore
        ? Math.round((bestScore.correct / bestScore.total) * 100)
        : null;

    function handleResume(e: React.MouseEvent) {
        if (!hasInProgress || !inProgressAttemptId) return;
        e.preventDefault();
        e.stopPropagation();
        router.visit(`/attempts/${inProgressAttemptId}`);
    }

    function handleStart(e: React.MouseEvent) {
        if (hasInProgress) return;
        e.preventDefault();
        e.stopPropagation();

        if (href) {
            router.visit(href);
        }
    }

    const card = (
        <div className={cn(
            'relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 hover:shadow-md',
            colors.border,
            colors.bg,
            colors.hover,
        )}>
            <div>
                <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className={cn('text-lg font-bold leading-tight', colors.text)}>
                        {name}
                    </h3>
                    {bestScore && (
                        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-success/20 bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                            <Award className="h-3.5 w-3.5" />
                            <span>أفضل: {bestScore.correct}/{bestScore.total}</span>
                        </div>
                    )}
                </div>

                {description && (
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                )}

                <div className="mb-5 flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                    <span className="rounded-md border border-border bg-card/90 px-2.5 py-1">
                        {questionsCount} أسئلة
                    </span>
                    <span className="rounded-md border border-border bg-card/90 px-2.5 py-1">
                        {durationMinutes ? `${durationMinutes} دقيقة` : 'بدون مؤقت'}
                    </span>
                    {userAttemptsCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card/90 px-2.5 py-1 text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-muted-foreground" />
                            {userAttemptsCount} محاولة{userAttemptsCount > 1 ? 'ات' : ''}
                        </span>
                    )}
                </div>
            </div>

            {!href && (
                <div className="mt-auto flex items-center gap-2">
                    {hasInProgress && inProgressAttemptId ? (
                        <button
                            onClick={handleResume}
                            className={cn(
                                'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm transition-all',
                                colors.primary,
                            )}
                        >
                            <RotateCcw className="h-4 w-4" />
                            استئناف المحاولة
                        </button>
                    ) : bestScore ? (
                        <button
                            onClick={handleStart}
                            className={cn(
                                'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm transition-all',
                                colors.primary,
                            )}
                        >
                            <RotateCcw className="h-4 w-4" />
                            إعادة الاختبار
                        </button>
                    ) : (
                        <button
                            onClick={handleStart}
                            className={cn(
                                'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm transition-all',
                                colors.primary,
                            )}
                        >
                            <Play className="h-4 w-4 fill-current" />
                            ابدأ الاختبار
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    if (href && !hasInProgress) {
        return <Link href={href}>{card}</Link>;
    }

    return card;
}
