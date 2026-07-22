import { useEffect, useRef } from 'react';
import { OptionCard } from '@/components/student/attempts/option-card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { AttemptQuestion } from '@/types/attempt';

const difficultyStyles: Record<string, { label: string; class: string }> = {
    easy: { label: 'سهل', class: 'bg-success/10 text-success border-success/30' },
    medium: { label: 'متوسط', class: 'bg-warning/10 text-warning border-warning/30' },
    hard: { label: 'صعب', class: 'bg-destructive/10 text-destructive border-destructive/30' },
};

const optionLetters = ['أ', 'ب', 'ج', 'د', 'ه', 'و'];

interface QuestionCardProps {
    question: AttemptQuestion | null;
    questionIndex: number;
    totalQuestions: number;
    isLocked: boolean;
    isLoading: boolean;
    onSelectOption: (optionId: number) => void;
}

export function QuestionCard({ question, questionIndex, totalQuestions, isLocked, isLoading, onSelectOption }: QuestionCardProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (question && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [question]);

    if (isLoading || !question) {
        return (
            <div ref={containerRef} className="space-y-6" aria-label="جاري تحميل السؤال">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-14" />
                </div>
                <Skeleton className="h-8 w-full" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const difficultyInfo = difficultyStyles[question.question.difficulty] ?? { label: question.question.difficulty, class: '' };

    return (
        <div
            ref={containerRef}
            className="space-y-6"
            role="region"
            aria-label={`سؤال ${questionIndex + 1} من ${totalQuestions}`}
        >
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="shrink-0">
                    سؤال {questionIndex + 1} من {totalQuestions}
                </Badge>
                <Badge variant="outline" className={`shrink-0 ${difficultyInfo.class}`}>
                    {difficultyInfo.label}
                </Badge>
                {isLocked && (
                    <Badge variant="secondary" className="shrink-0">
                        تم الإجابة
                    </Badge>
                )}
            </div>

            <p className="text-lg leading-relaxed sm:text-xl">
                {question.question.text}
            </p>

            <div className="space-y-3" role="radiogroup" aria-label="اختر الإجابة الصحيحة">
                {question.question.options?.map((option, index) => (
                    <OptionCard
                        key={option.id}
                        text={option.text}
                        letter={optionLetters[index] ?? String(index + 1)}
                        isSelected={question.selected_option_id === option.id}
                        isLocked={isLocked}
                        onSelect={() => onSelectOption(option.id!)}
                    />
                ))}
            </div>
        </div>
    );
}
