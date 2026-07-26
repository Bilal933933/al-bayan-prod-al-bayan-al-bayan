import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
    text: string;
    letter: string;
    isSelected: boolean;
    isLocked: boolean;
    onSelect: () => void;
}

export function OptionCard({
    text,
    letter,
    isSelected,
    isLocked,
    onSelect,
}: OptionCardProps) {
    return (
        <motion.button
            type="button"
            disabled={isLocked}
            onClick={onSelect}
            role="radio"
            aria-checked={isSelected}
            whileTap={isLocked ? {} : { scale: 0.98 }}
            animate={isSelected ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.25 }}
            className={cn(
                'flex w-full items-center gap-4 rounded-xl border-2 p-4 text-right transition-all duration-200',
                isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20'
                    : 'border-border text-muted-foreground hover:scale-[1.01] hover:border-muted-foreground/25 hover:bg-muted active:scale-[0.99]',
                isSelected &&
                    !isLocked &&
                    'hover:border-primary/80 hover:bg-primary/15',
                isLocked && 'cursor-not-allowed opacity-80',
                !isLocked && 'cursor-pointer',
            )}
        >
            <span
                className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors duration-200',
                    isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-muted text-muted-foreground',
                )}
            >
                {isSelected ? <Check className="h-4 w-4" /> : letter}
            </span>
            <span
                className={cn(
                    'text-base leading-relaxed font-medium',
                    isSelected && 'text-primary',
                    !isSelected && 'text-muted-foreground',
                )}
            >
                {text}
            </span>
        </motion.button>
    );
}
