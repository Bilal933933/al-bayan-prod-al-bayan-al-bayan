import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import OptionCard from './OptionCard';
import type { Attempt, AttemptQuestion } from '@/types/attempt';
import { difficultyColors, difficultyLabels } from './AttemptHelpers';

interface QuestionCardProps {
    question: AttemptQuestion;
    attempt: Attempt;
    questionId: string;
}

export default function QuestionCard({ question, attempt, questionId }: QuestionCardProps) {
    const isCompleted = attempt.status === 'completed';
    const hasCorrect = question.is_correct === true;
    const hasWrong = question.is_correct === false;

    return (
        <div id={questionId} className="scroll-mt-20 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {question.order + 1}
                    </span>
                    <span className={cn('rounded-md px-2 py-0.5 text-[11px] font-medium', difficultyColors[question.question.difficulty] ?? 'bg-muted text-muted-foreground')}>
                        {difficultyLabels[question.question.difficulty] ?? question.question.difficulty}
                    </span>
                </div>
                {isCompleted && hasCorrect && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-medium text-success ring-success/30">
                        <Check className="h-3 w-3" />
                        صحيحة
                    </span>
                )}
                {isCompleted && hasWrong && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-medium text-destructive ring-destructive/30">
                        <X className="h-3 w-3" />
                        خاطئة
                    </span>
                )}
            </div>

            <p className="mb-4 text-sm leading-relaxed text-foreground sm:text-base">
                {question.question.text}
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {question.question.options?.map((option) => {
                    const textLen = option.text?.length ?? 0;
                    const isLong = textLen > 30;

                    return (
                        <div key={option.id} className={isLong ? 'sm:col-span-2' : ''}>
                            <OptionCard
                                option={option}
                                isSelected={question.selected_option_id === option.id}
                                isCorrectOption={option.is_correct}
                                isCompleted={isCompleted}
                                showCorrect={isCompleted && option.is_correct === true}
                                showWrong={isCompleted && question.selected_option_id === option.id && option.is_correct === false}
                            />
                        </div>
                    );
                })}
            </div>

            {isCompleted && hasWrong && question.question.explanation && (
                <div className="mt-4 rounded-xl bg-warning/10 p-4 text-sm leading-relaxed text-warning ring-warning/30">
                    <span className="font-semibold">الشرح: </span>
                    {question.question.explanation}
                </div>
            )}
        </div>
    );
}
