import { Link } from '@inertiajs/react';
import { BookOpen, CheckCircle, ChevronLeft, Clock, GraduationCap, Trophy } from 'lucide-react';
import DateDisplay from '@/components/date-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Attempt, AttemptSection } from '@/types/attempt';

type AttemptCardAttempt = Pick<Attempt, 'id' | 'type' | 'status' | 'subject_name' | 'correct_answers' | 'total_questions' | 'started_at'> & {
    sections?: AttemptSection[];
};

interface AttemptCardProps {
    attempt: AttemptCardAttempt;
    href: string;
}

const typeConfig = {
    practice: {
        label: 'تدريب',
        icon: BookOpen,
        class: 'bg-info/10 text-info border-info/30',
        dot: 'bg-info',
    },
    exam: {
        label: 'محاكاة',
        icon: GraduationCap,
        class: 'bg-destructive/10 text-destructive border-destructive/30',
        dot: 'bg-destructive',
    },
};

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    in_progress: { label: 'قيد التنفيذ', variant: 'default' },
    completed: { label: 'مكتمل', variant: 'secondary' },
    abandoned: { label: 'ملغي', variant: 'outline' },
};

export function AttemptCard({ attempt, href }: AttemptCardProps) {
    const typeInfo = typeConfig[attempt.type] ?? typeConfig.practice;
    const TypeIcon = typeInfo.icon;
    const statusInfo = statusLabels[attempt.status] ?? { label: attempt.status, variant: 'outline' as const };

    const scorePercent = attempt.total_questions > 0
        ? Math.round((attempt.correct_answers / attempt.total_questions) * 100)
        : null;

    const submittedSections = attempt.sections?.filter((s) => s.submitted_at) ?? [];
    const totalSections = attempt.sections?.length ?? 0;

    return (
        <div className={cn(
            'group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:gap-6',
            attempt.status === 'in_progress' && 'border-warning/30 bg-warning/5',
            attempt.status === 'completed' && 'border-success/30',
        )}>
            <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', typeInfo.class)}>
                    <TypeIcon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={attempt.type === 'exam' ? 'destructive' : 'secondary'} className="shrink-0">
                            <TypeIcon className="ml-1 h-3 w-3" />
                            {typeInfo.label}
                        </Badge>
                        <Badge variant={statusInfo.variant} className="shrink-0">
                            {statusInfo.label}
                        </Badge>
                        <span className="truncate text-sm font-medium">{attempt.subject_name}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                            <Trophy className="h-3.5 w-3.5" />
                            {attempt.correct_answers} / {attempt.total_questions}
                        </span>
                        {scorePercent !== null && (
                            <span className="inline-flex items-center gap-1.5">
                                <div className="flex h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all',
                                            scorePercent >= 80 ? 'bg-success' : scorePercent >= 50 ? 'bg-warning' : 'bg-destructive',
                                        )}
                                        style={{ width: `${scorePercent}%` }}
                                    />
                                </div>
                                <span className="text-xs">{scorePercent}%</span>
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <DateDisplay date={attempt.started_at} format="relative" />
                        </span>
                    </div>

                    {attempt.type === 'exam' && totalSections > 0 && attempt.status !== 'abandoned' && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {attempt.sections?.map((section) => {
                                const isSubmitted = section.submitted_at !== null;
                                const isActive = !isSubmitted && attempt.status === 'in_progress';

                                return (
                                    <span key={section.id} className="flex items-center gap-1">
                                        {isSubmitted ? (
                                            <CheckCircle className="h-3 w-3 text-success" />
                                        ) : isActive ? (
                                            <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                                        ) : (
                                            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                                        )}
                                        <span className={cn(
                                            isSubmitted && 'text-success',
                                            isActive && 'text-warning font-medium',
                                        )}>
                                            {section.order + 1}
                                        </span>
                                    </span>
                                );
                            })}
                            <span className="mr-1 text-muted-foreground/60">
                                · {submittedSections.length}/{totalSections} أقسام
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <Button variant={attempt.status === 'in_progress' ? 'default' : 'outline'} size="sm" className="gap-1 shrink-0" asChild>
                <Link href={href}>
                    {attempt.status === 'in_progress' ? 'متابعة' : 'عرض النتيجة'}
                    <ChevronLeft className="h-3.5 w-3.5" />
                </Link>
            </Button>
        </div>
    );
}
