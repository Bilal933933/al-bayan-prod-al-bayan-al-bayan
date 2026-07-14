import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Check, ChevronLeft, Clock, House, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import attempts from '@/routes/student/attempts';
import type { Attempt, AttemptQuestion } from '@/types/attempt';

interface ShowProps {
    attempt: Attempt;
}

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

const typeLabels: Record<string, string> = {
    practice: 'تدريب حر',
    exam: 'محاكاة اختبار',
};

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    in_progress: { label: 'قيد التنفيذ', variant: 'default' },
    completed: { label: 'مكتمل', variant: 'secondary' },
    abandoned: { label: 'ملغي', variant: 'outline' },
};

const difficultyLabels: Record<string, string> = {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
};

function AttemptQuestionCard({ question, attempt }: { question: AttemptQuestion; attempt: Attempt }) {
    const isCompleted = attempt.status === 'completed';
    const isExamLocked = attempt.type === 'exam' && question.selected_option_id !== null;

    function handleSelect(optionId: number) {
        const url = attempts.questions.update({ attempt: attempt.id, attemptQuestion: question.id }).url;
        router.patch(url, { selected_option_id: optionId }, { preserveScroll: true });
    }

    const statusBadge = isCompleted
        ? question.is_correct
            ? { variant: 'secondary' as const, label: 'صحيحة', icon: Check }
            : question.is_correct === false
                ? { variant: 'destructive' as const, label: 'خاطئة', icon: X }
                : null
        : null;

    return (
        <Card className="overflow-hidden">
            <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="shrink-0">
                                سؤال {question.order + 1}
                            </Badge>
                            <Badge variant="outline" className="shrink-0">
                                {difficultyLabels[question.question.difficulty] ?? question.question.difficulty}
                            </Badge>
                            {isExamLocked && !isCompleted && (
                                <Badge variant="secondary" className="shrink-0">
                                    تم الإجابة
                                </Badge>
                            )}
                            {statusBadge && (
                                <Badge variant={statusBadge.variant} className="shrink-0">
                                    <statusBadge.icon className="ml-1 h-3 w-3" />
                                    {statusBadge.label}
                                </Badge>
                            )}
                        </div>

                        <p className="mt-3 text-base leading-relaxed sm:text-lg">
                            {question.question.text}
                        </p>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    {question.question.options?.map((option) => {
                        const isSelected = question.selected_option_id === option.id;
                        const isCorrectOption = option.is_correct;
                        let optionClass = 'flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors';

                        if (isCompleted) {
                            if (isCorrectOption) {
                                optionClass += ' border-emerald-500 bg-emerald-50 text-emerald-900';
                            } else if (isSelected && !isCorrectOption) {
                                optionClass += ' border-red-500 bg-red-50 text-red-900';
                            } else {
                                optionClass += ' border-gray-200 opacity-60';
                            }
                        } else if (isSelected) {
                            optionClass += ' border-primary bg-primary/5';
                        } else {
                            optionClass += ' border-border hover:border-primary/50 hover:bg-accent';
                        }

                        const showCorrectIcon = isCompleted && isCorrectOption;
                        const showWrongIcon = isCompleted && isSelected && !isCorrectOption;

                        return (
                            <label key={option.id} className={optionClass}>
                                <input
                                    type="radio"
                                    name={`question_${question.id}`}
                                    value={option.id}
                                    checked={isSelected}
                                    onChange={() => handleSelect(option.id!)}
                                    disabled={isCompleted || isExamLocked}
                                    className="h-4 w-4 shrink-0 accent-primary"
                                />
                                <span className="flex-1">{option.text}</span>
                                {showCorrectIcon && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
                                {showWrongIcon && <X className="h-4 w-4 shrink-0 text-red-600" />}
                            </label>
                        );
                    })}
                </div>

                {isCompleted && question.question.explanation && (
                    <div className="mt-3 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">الشرح: </span>
                        {question.question.explanation}
                    </div>
                )}
            </div>
        </Card>
    );
}

export default function Show({ attempt }: ShowProps) {
    const statusInfo = statusLabels[attempt.status] ?? { label: attempt.status, variant: 'outline' };
    const isCompleted = attempt.status === 'completed';
    const allAnswered = attempt.sections.every((s) =>
        s.questions.every((q) => q.selected_option_id !== null),
    );

    function handleFinish() {
        if (!confirm('هل أنت متأكد من إنهاء المحاولة؟')) return;
        router.post(attempts.finish({ attempt: attempt.id }).url, {}, { preserveScroll: true });
    }

    return (
        <>
            <Head title={`محاولة ${typeLabels[attempt.type] ?? attempt.type}`} />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-4xl flex-col gap-6 p-6"
            >
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                        <House className="h-3.5 w-3.5" />
                        <span>الرئيسية</span>
                    </Link>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">
                        {typeLabels[attempt.type] ?? 'محاولة'}
                    </span>
                </nav>

                <div className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <div className="relative p-6 sm:p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-bold">
                                        {typeLabels[attempt.type] ?? 'محاولة'}
                                    </h1>
                                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {attempt.total_questions} سؤال
                                    {isCompleted && (
                                        <> &middot; {attempt.correct_answers} / {attempt.total_questions} إجابة صحيحة</>
                                    )}
                                </p>
                            </div>
                            {!isCompleted && (
                                <Button onClick={handleFinish} variant="default">
                                    إنهاء المحاولة
                                </Button>
                            )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {attempt.sections.length} قسم
                            </span>
                            {attempt.sections.some((s) => s.duration_minutes) && (
                                <span className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {attempt.sections.reduce((acc, s) => acc + (s.duration_minutes ?? 0), 0)} دقيقة
                                </span>
                            )}
                            {!isCompleted && (
                                <span className="text-muted-foreground">
                                    {allAnswered ? 'تمت الإجابة على جميع الأسئلة' : 'بعض الأسئلة لم تُجب بعد'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {attempt.sections.map((section) => (
                    <div key={section.id} className="space-y-4">
                        {attempt.sections.length > 1 && (
                            <h2 className="text-lg font-semibold">{section.topic?.name ?? `القسم ${section.order + 1}`}</h2>
                        )}
                        {section.questions.map((question) => (
                            <AttemptQuestionCard key={question.id} question={question} attempt={attempt} />
                        ))}
                    </div>
                ))}
            </motion.div>
        </>
    );
}
