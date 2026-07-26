import { useCallback } from 'react';
import { cn } from '@/lib/utils';

interface NavigationGridProps {
    questions: {
        question_id: number;
        is_correct: boolean | null;
        order: number;
    }[];
    allQuestions: {
        question_id: number;
        is_correct: boolean | null;
        order: number;
    }[];
    onQuestionClick?: () => void;
}

export default function NavigationGrid({
    questions,
    allQuestions,
    onQuestionClick,
}: NavigationGridProps) {
    const handleClick = useCallback(
        (questionId: number) => {
            const el = document.getElementById(`question-${questionId}`);

            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            onQuestionClick?.();
        },
        [onQuestionClick],
    );

    return (
        <div className="rounded-2xl bg-card p-4 shadow-sm ring-border/50">
            <div className="mb-3 text-xs font-medium text-muted-foreground">
                خريطة الأسئلة
            </div>
            <div className="grid grid-cols-5 gap-1.5" dir="ltr">
                {allQuestions.map((q, i) => {
                    const isVisible = questions.some(
                        (fq) => fq.question_id === q.question_id,
                    );
                    const isCorrect = q.is_correct === true;
                    const isWrong = q.is_correct === false;

                    return (
                        <button
                            key={q.question_id}
                            onClick={() => handleClick(q.question_id)}
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-110 hover:shadow-md',
                                isCorrect &&
                                    'bg-success/20 text-success hover:bg-success/30',
                                isWrong &&
                                    'bg-destructive/20 text-destructive hover:bg-destructive/30',
                                q.is_correct === null &&
                                    'bg-muted text-muted-foreground hover:bg-muted/80',
                                !isVisible && 'opacity-30',
                            )}
                            title={`سؤال ${i + 1}`}
                        >
                            {i + 1}
                        </button>
                    );
                })}
            </div>
            <div className="mt-3 flex items-center justify-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-success">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-success/20 ring-success/30" />
                    صحيح
                </span>
                <span className="flex items-center gap-1 text-destructive">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-destructive/20 ring-destructive/30" />
                    خطأ
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-muted ring-border" />
                    لم يُجب
                </span>
            </div>
        </div>
    );
}
