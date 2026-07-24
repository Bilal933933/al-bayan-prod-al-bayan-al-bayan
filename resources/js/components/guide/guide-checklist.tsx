import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ChecklistItem {
    id: string;
    text: string;
    checked?: boolean;
}

interface GuideChecklistProps {
    items: ChecklistItem[];
    onChange?: (id: string) => void;
    className?: string;
}

export function GuideChecklist({ items, onChange, className }: GuideChecklistProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {items.map((item, index) => (
                <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => onChange?.(item.id)}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                        'flex w-full items-center gap-3 rounded-lg border p-3 text-right text-sm transition-all',
                        item.checked
                            ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-200'
                            : 'border-border bg-card hover:bg-accent',
                    )}
                >
                    <span
                        className={cn(
                            'flex size-5 shrink-0 items-center justify-center rounded-full border transition-all',
                            item.checked
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-muted-foreground/30',
                        )}
                    >
                        {item.checked && <Check className="size-3" />}
                    </span>
                    <span className={cn(item.checked && 'line-through opacity-70')}>{item.text}</span>
                </motion.button>
            ))}
        </div>
    );
}