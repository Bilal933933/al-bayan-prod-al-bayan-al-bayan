import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
    text: string;
    letter: string;
    isSelected: boolean;
    isLocked: boolean;
    onSelect: () => void;
}

export function OptionCard({ text, letter, isSelected, isLocked, onSelect }: OptionCardProps) {
    return (
        <button
            type="button"
            disabled={isLocked}
            onClick={onSelect}
            className={cn(
                'flex w-full items-center gap-4 rounded-xl border p-4 text-right transition-all duration-200',
                isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20 text-primary-foreground'
                    : 'border-border hover:border-muted-foreground/25 hover:bg-muted text-muted-foreground',
                isLocked && 'cursor-not-allowed opacity-80',
                !isLocked && 'cursor-pointer',
            )}
        >
            <span className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold border transition-colors',
                isSelected
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-muted border-border text-muted-foreground',
            )}>
                {isSelected ? <Check className="h-4 w-4" /> : letter}
            </span>
            <span className="text-base font-medium leading-relaxed">{text}</span>
        </button>
    );
}
