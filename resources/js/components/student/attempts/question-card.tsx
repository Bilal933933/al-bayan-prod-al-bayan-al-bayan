import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { OptionCard } from '@/components/student/attempts/option-card';
import type { AttemptQuestion } from '@/types/attempt';

const difficultyStyles: Record<string, { label: string; class: string }> = {
    easy: { label: 'سهل', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    medium: { label: 'متوسط', class: 'bg-amber-50 text-amber-700 border-amber-200' },
    hard: { label: 'صعب', class: 'bg-rose-50 text-rose-700 border-rose-200' },
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
    if (isLoading || !question) {
        return (
            <div className="space-y-6">
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
        <div className="space-y-6">
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

            <div className="space-y-3">
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
