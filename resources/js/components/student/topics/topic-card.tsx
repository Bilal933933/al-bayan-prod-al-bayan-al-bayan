import { Link, router } from '@inertiajs/react';
import {
    Award,
    CheckCircle,
    Clock,
    FileText,
    Play,
    RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BestScore } from '@/types/topic';
import { getColor } from './topic-colors';

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
    href,
}: TopicCardProps) {
    const colors = getColor(id);

    const scorePercent = bestScore
        ? Math.round((bestScore.correct / bestScore.total) * 100)
        : null;

    function handleResume(e: React.MouseEvent) {
        if (!hasInProgress || !inProgressAttemptId) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        router.visit(`/attempts/${inProgressAttemptId}`);
    }

    function handleStart(e: React.MouseEvent) {
        if (hasInProgress) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (href) {
            router.visit(href);
        }
    }

    const card = (
        <div
            className={cn(
                'relative flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
                colors.border,
                colors.bg,
                colors.hover,
            )}
        >
            <div>
                <div className="mb-2 flex items-start justify-between gap-2">
                    <h3
                        className={cn(
                            'text-lg leading-tight font-bold',
                            colors.text,
                        )}
                    >
                        {name}
                    </h3>
                    {bestScore && (
                        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-success/20 bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                            <Award className="h-3.5 w-3.5" />
                            <span>
                                أفضل: {bestScore.correct}/{bestScore.total}
                            </span>
                        </div>
                    )}
                </div>

                {description && (
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                )}

                <div className="mb-5 flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2.5 py-1">
                        <FileText className="h-3.5 w-3.5" />
                        {questionsCount} أسئلة
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2.5 py-1">
                        <Clock className="h-3.5 w-3.5" />
                        {durationMinutes
                            ? `${durationMinutes} دقيقة`
                            : 'بدون مؤقت'}
                    </span>
                    {userAttemptsCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2.5 py-1">
                            <CheckCircle className="h-3.5 w-3.5" />
                            {userAttemptsCount} محاولة
                            {userAttemptsCount > 1 ? 'ات' : ''}
                        </span>
                    )}
                </div>

                {bestScore && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>نسبة الإنجاز</span>
                            <span className={cn('font-semibold', colors.text)}>
                                {scorePercent}%
                            </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className={cn(
                                    'h-full rounded-full transition-all duration-500',
                                    colors.primaryBg,
                                )}
                                style={{ width: `${scorePercent}%` }}
                            />
                        </div>
                    </div>
                )}
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
