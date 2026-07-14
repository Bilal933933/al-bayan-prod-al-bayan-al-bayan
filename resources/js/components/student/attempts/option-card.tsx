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
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20 text-indigo-900'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700',
                isLocked && 'cursor-not-allowed opacity-80',
                !isLocked && 'cursor-pointer',
            )}
        >
            <span className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold border transition-colors',
                isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-500',
            )}>
                {isSelected ? <Check className="h-4 w-4" /> : letter}
            </span>
            <span className="text-base font-medium leading-relaxed">{text}</span>
        </button>
    );
}
