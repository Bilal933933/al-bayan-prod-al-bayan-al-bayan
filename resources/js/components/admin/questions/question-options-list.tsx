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
                                ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-950/20'
                                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50'
                        }`}
                    >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                            isCorrect
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                            {optionLetters[index] ?? index + 1}
                        </div>
                        <p className={`flex-1 text-base ${isCorrect ? 'font-medium text-emerald-800 dark:text-emerald-300' : ''}`}>
                            {option.text}
                        </p>
                        {isCorrect && (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
