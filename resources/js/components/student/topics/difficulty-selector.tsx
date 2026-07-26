import { cn } from '@/lib/utils';

const difficulties = [
    {
        key: null,
        label: 'الكل',
        description: 'أسئلة من جميع المستويات',
        class: 'border-border hover:border-muted-foreground/25 data-[selected=true]:border-foreground data-[selected=true]:bg-muted',
        dot: 'bg-muted-foreground',
    },
    {
        key: 'easy',
        label: 'سهل',
        description: 'أسئلة بمستوى سهل',
        class: 'border-success/30 hover:border-success/50 data-[selected=true]:border-success data-[selected=true]:bg-success/10',
        dot: 'bg-success',
    },
    {
        key: 'medium',
        label: 'متوسط',
        description: 'أسئلة بمستوى متوسط',
        class: 'border-warning/30 hover:border-warning/50 data-[selected=true]:border-warning data-[selected=true]:bg-warning/10',
        dot: 'bg-warning',
    },
    {
        key: 'hard',
        label: 'صعب',
        description: 'أسئلة بمستوى صعب',
        class: 'border-destructive/30 hover:border-destructive/50 data-[selected=true]:border-destructive data-[selected=true]:bg-destructive/10',
        dot: 'bg-destructive',
    },
] as const;

interface DifficultySelectorProps {
    value: string | null;
    onChange: (value: string | null) => void;
}

export function DifficultySelector({
    value,
    onChange,
}: DifficultySelectorProps) {
    return (
        <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                مستوى الصعوبة:
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {difficulties.map((d) => {
                    const isSelected = value === d.key;

                    return (
                        <button
                            key={d.key ?? 'all'}
                            type="button"
                            data-selected={isSelected}
                            onClick={() => onChange(d.key)}
                            className={cn(
                                'flex flex-col gap-1.5 rounded-xl border p-3.5 text-right transition-all duration-200',
                                d.class,
                                isSelected && 'ring-2',
                                isSelected &&
                                    d.key === null &&
                                    'ring-foreground/20',
                                isSelected &&
                                    d.key === 'easy' &&
                                    'ring-success/20',
                                isSelected &&
                                    d.key === 'medium' &&
                                    'ring-warning/20',
                                isSelected &&
                                    d.key === 'hard' &&
                                    'ring-destructive/20',
                                !isSelected && 'bg-card hover:shadow-sm',
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        'h-2.5 w-2.5 rounded-full',
                                        d.dot,
                                    )}
                                />
                                <span className="text-sm font-semibold">
                                    {d.label}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {d.description}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
