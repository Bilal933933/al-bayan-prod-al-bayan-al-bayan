import { CheckCircle2 } from 'lucide-react';
import type { QuestionOption } from '@/types/question';

const optionLetters = ['أ', 'ب', 'ج', 'د', 'ه', 'و'];

export default function QuestionOptionsList({ options }: { options?: QuestionOption[] }) {
    if (!options || options.length === 0) {
        return <p className="text-center text-sm text-muted-foreground">لا توجد خيارات.</p>;
    }

    return (
        <div className="space-y-3">
            {options.map((option, index) => {
                const isCorrect = option.is_correct;
                return (
                    <div
                        key={option.id ?? index}
                        className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                            isCorrect
                                ? 'border-success/30 bg-success/10 dark:border-success/30 dark:bg-success/10'
                                : 'border-border bg-card dark:border-border dark:bg-card'
                        }`}
                    >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                            isCorrect
                                ? 'bg-success/20 text-success'
                                : 'bg-muted text-muted-foreground'
                        }`}>
                            {optionLetters[index] ?? index + 1}
                        </div>
                        <p className={`flex-1 text-base ${isCorrect ? 'font-medium text-success' : ''}`}>
                            {option.text}
                        </p>
                        {isCorrect && (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
