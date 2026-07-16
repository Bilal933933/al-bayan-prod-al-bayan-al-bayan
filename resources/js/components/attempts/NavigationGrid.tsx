import { useCallback } from 'react';
import { cn } from '@/lib/utils';

interface NavigationGridProps {
    questions: { question_id: number; is_correct: boolean | null; order: number }[];
    allQuestions: { question_id: number; is_correct: boolean | null; order: number }[];
    onQuestionClick?: () => void;
}

export default function NavigationGrid({
    questions,
    allQuestions,
    onQuestionClick,
}: NavigationGridProps) {
    const handleClick = useCallback((questionId: number) => {
        const el = document.getElementById(`question-${questionId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        onQuestionClick?.();
    }, [onQuestionClick]);

    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/50">
            <div className="mb-3 text-xs font-medium text-slate-500">خريطة الأسئلة</div>
            <div className="grid grid-cols-5 gap-1.5" dir="rtl">
                {allQuestions.map((q, i) => {
                    const isVisible = questions.some((fq) => fq.question_id === q.question_id);
                    const isCorrect = q.is_correct === true;
                    const isWrong = q.is_correct === false;

                    return (
                        <button
                            key={q.question_id}
                            onClick={() => handleClick(q.question_id)}
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-110 hover:shadow-md',
                                isCorrect && 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
                                isWrong && 'bg-rose-100 text-rose-800 hover:bg-rose-200',
                                q.is_correct === null && 'bg-slate-100 text-slate-600 hover:bg-slate-200',
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
                <span className="flex items-center gap-1 text-emerald-700">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-emerald-100 ring-1 ring-emerald-200" />
                    صحيح
                </span>
                <span className="flex items-center gap-1 text-rose-700">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-rose-100 ring-1 ring-rose-200" />
                    خطأ
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-slate-100 ring-1 ring-slate-200" />
                    لم يُجب
                </span>
            </div>
        </div>
    );
}
