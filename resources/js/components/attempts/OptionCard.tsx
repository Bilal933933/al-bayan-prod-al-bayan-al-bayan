import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
    option: { id: number; text: string; is_correct: boolean };
    isCompleted: boolean;
    showCorrect: boolean;
    showWrong: boolean;
}

export default function OptionCard({
    option,
    isCompleted,
    showCorrect,
    showWrong,
}: OptionCardProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-all',
                showCorrect && 'border-success/30 bg-success/10 shadow-sm',
                showWrong &&
                    'border-destructive/30 bg-destructive/10 shadow-sm',
                !showCorrect &&
                    !showWrong &&
                    isCompleted &&
                    'border-border bg-muted/50 opacity-50',
                !showCorrect &&
                    !showWrong &&
                    !isCompleted &&
                    'border-border bg-card hover:border-muted-foreground/25',
            )}
        >
            <span
                className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                    showCorrect &&
                        'text-success-foreground bg-success shadow-sm shadow-success/20',
                    showWrong &&
                        'text-destructive-foreground bg-destructive shadow-sm shadow-destructive/20',
                    !showCorrect &&
                        !showWrong &&
                        'border-2 border-muted-foreground/30 text-transparent',
                )}
            >
                {showCorrect ? (
                    <Check className="h-3 w-3" />
                ) : showWrong ? (
                    <X className="h-3 w-3" />
                ) : (
                    ''
                )}
            </span>
            <span
                className={cn(
                    'flex-1 leading-relaxed',
                    showCorrect && 'font-medium text-success',
                    showWrong && 'font-medium text-destructive',
                )}
            >
                {option.text}
            </span>
        </div>
    );
}
