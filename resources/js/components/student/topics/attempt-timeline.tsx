import DateDisplay from '@/components/date-display';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecentAttempt {
    id: number;
    status: 'in_progress' | 'completed' | 'abandoned';
    correct_answers: number;
    total_questions: number;
    created_at: string;
}

interface AttemptTimelineProps {
    attempts: RecentAttempt[];
    hasInProgress: boolean;
}

const statusConfig = {
    completed: { icon: CheckCircle, class: 'text-emerald-600', bg: 'bg-emerald-50', label: 'مكتمل' },
    in_progress: { icon: Clock, class: 'text-amber-600', bg: 'bg-amber-50', label: 'قيد التنفيذ' },
    abandoned: { icon: XCircle, class: 'text-red-600', bg: 'bg-red-50', label: 'ملغي' },
};

export function AttemptTimeline({ attempts, hasInProgress }: AttemptTimelineProps) {
    if (attempts.length === 0) return null;

    return (
        <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">آخر المحاولات:</h3>
            <div className="space-y-2">
                {attempts.map((attempt, index) => {
                    const config = statusConfig[attempt.status] ?? statusConfig.completed;
                    const Icon = config.icon;
                    const score = attempt.total_questions > 0
                        ? Math.round((attempt.correct_answers / attempt.total_questions) * 100)
                        : null;

                    return (
                        <div
                            key={attempt.id}
                            className={cn(
                                'flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors',
                                config.bg,
                                index === 0 && 'border-muted-foreground/20',
                            )}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', config.bg)}>
                                    <Icon className={cn('h-4 w-4', config.class)} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium"><DateDisplay date={attempt.created_at} format="relative" /></span>
                                        <span className={cn('text-xs', config.class)}>{config.label}</span>
                                    </div>
                                    {attempt.status === 'completed' && (
                                        <p className="text-xs text-muted-foreground">
                                            {attempt.correct_answers}/{attempt.total_questions}
                                            {score !== null && ` (${score}%)`}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {attempt.status === 'in_progress' && (
                                <Button size="xs" variant="secondary" asChild className="gap-1 shrink-0">
                                    <Link href={`/attempts/${attempt.id}`}>
                                        <ArrowLeft className="h-3 w-3" />
                                        استئناف
                                    </Link>
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
