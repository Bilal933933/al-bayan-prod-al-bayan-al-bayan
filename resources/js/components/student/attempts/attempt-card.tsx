import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronLeft, Clock, GraduationCap } from 'lucide-react';

import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
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
        headerClass: 'bg-primary',
        dot: 'bg-info',
    },
    exam: {
        label: 'محاكاة',
        icon: GraduationCap,
        headerClass: 'bg-info',
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'bg-card rounded-3xl border border-border shadow-lg overflow-hidden text-right',
                attempt.status === 'in_progress' && 'border-warning/30',
                attempt.status === 'completed' && 'border-success/30',
            )}
            dir="rtl"
        >
            <div className={cn(
                'p-4 text-primary-foreground font-bold flex items-center gap-3',
                typeInfo.headerClass,
                attempt.status === 'abandoned' && 'bg-muted-foreground',
            )}>
                <TypeIcon className="w-5 h-5 shrink-0" />
                <span className="flex-1 truncate">{attempt.subject_name || 'محاولة'}</span>
                <Badge variant={statusInfo.variant} className="shrink-0 text-xs">
                    {statusInfo.label}
                </Badge>
            </div>

            <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <Badge variant={attempt.type === 'exam' ? 'destructive' : 'secondary'} className="shrink-0 text-xs">
                        <TypeIcon className="ml-1 h-3 w-3" />
                        {typeInfo.label}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-muted p-3 rounded-2xl">
                    <div className="text-center">
                        <span className="text-[10px] text-muted-foreground block font-bold">الإجابات الصحيحة</span>
                        <span className="text-base font-black text-foreground mt-0.5 block" dir="ltr">
                            <SlidingNumber number={attempt.correct_answers} />
                            {' '}/{' '}
                            <SlidingNumber number={attempt.total_questions} />
                        </span>
                    </div>
                    <div className="text-center border-r border-border">
                        <span className="text-[10px] text-muted-foreground block font-bold">نسبة النجاح</span>
                        <span className="text-base font-black text-foreground mt-0.5 block" dir="ltr">
                            {scorePercent !== null ? (
                                <SlidingNumber number={scorePercent} />
                            ) : (
                                '---'
                            )}%
                        </span>
                    </div>
                </div>

                {scorePercent !== null && (
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all',
                                scorePercent >= 80 ? 'bg-success' : scorePercent >= 50 ? 'bg-warning' : 'bg-destructive',
                            )}
                            style={{ width: `${scorePercent}%` }}
                        />
                    </div>
                )}

                <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-xs text-muted-foreground font-bold">تاريخ البدء:</span>
                    <span className="text-xs font-bold text-foreground inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <DateDisplay date={attempt.started_at} format="relative" />
                    </span>
                </div>

                {attempt.type === 'exam' && totalSections > 0 && attempt.status !== 'abandoned' && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
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
                        <span className="mr-1 text-muted-foreground/60" dir="ltr">
                            · {submittedSections.length}/{totalSections} <span dir="rtl">أقسام</span>
                        </span>
                    </div>
                )}

                <div className="border-t-2 border-dashed border-border relative">
                    <div className="absolute -top-2.5 -right-5 w-5 h-5 bg-muted rounded-full" />
                    <div className="absolute -top-2.5 -left-5 w-5 h-5 bg-muted rounded-full" />
                </div>

                <Button
                    variant={attempt.status === 'in_progress' ? 'default' : 'outline'}
                    className={cn(
                        'w-full py-5 font-black text-base rounded-2xl shadow-lg transition-all gap-1',
                        attempt.status === 'in_progress'
                            ? 'bg-warning hover:brightness-90 text-warning-foreground'
                            : 'hover:brightness-90',
                    )}
                    asChild
                >
                    <Link href={href}>
                        {attempt.status === 'in_progress' ? 'متابعة' : 'عرض النتيجة'}
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
}
