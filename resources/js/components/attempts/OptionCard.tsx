import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
    option: { id: number; text: string; is_correct: boolean };
    isSelected: boolean;
    isCorrectOption: boolean;
    isCompleted: boolean;
    showCorrect: boolean;
    showWrong: boolean;
}

export default function OptionCard({
    option,
    isSelected,
    isCorrectOption,
    isCompleted,
    showCorrect,
    showWrong,
}: OptionCardProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-all',
                showCorrect && 'border-emerald-200 bg-emerald-50/80 shadow-sm',
                showWrong && 'border-rose-200 bg-rose-50/80 shadow-sm',
                !showCorrect && !showWrong && isCompleted && 'border-slate-100 bg-slate-50/50 opacity-50',
                !showCorrect && !showWrong && !isCompleted && 'border-slate-200 bg-white hover:border-slate-300',
            )}
        >
            <span
                className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                    showCorrect && 'bg-emerald-500 text-white shadow-sm shadow-emerald-200',
                    showWrong && 'bg-rose-500 text-white shadow-sm shadow-rose-200',
                    !showCorrect && !showWrong && 'border-2 border-slate-300 text-transparent',
                )}
            >
                {showCorrect ? <Check className="h-3 w-3" /> : showWrong ? <X className="h-3 w-3" /> : ''}
            </span>
            <span
                className={cn(
                    'flex-1 leading-relaxed',
                    showCorrect && 'font-medium text-emerald-800',
                    showWrong && 'font-medium text-rose-800',
                )}
            >
                {option.text}
            </span>
        </div>
    );
}
