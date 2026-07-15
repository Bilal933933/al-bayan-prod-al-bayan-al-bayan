import { cn } from '@/lib/utils';

const difficulties = [
    {
        key: null,
        label: 'الكل',
        description: 'أسئلة من جميع المستويات',
        class: 'border-slate-200 hover:border-slate-300 data-[selected=true]:border-slate-600 data-[selected=true]:bg-slate-50',
        dot: 'bg-slate-400',
    },
    {
        key: 'easy',
        label: 'سهل',
        description: 'أسئلة بمستوى سهل',
        class: 'border-emerald-200 hover:border-emerald-300 data-[selected=true]:border-emerald-600 data-[selected=true]:bg-emerald-50',
        dot: 'bg-emerald-500',
    },
    {
        key: 'medium',
        label: 'متوسط',
        description: 'أسئلة بمستوى متوسط',
        class: 'border-amber-200 hover:border-amber-300 data-[selected=true]:border-amber-600 data-[selected=true]:bg-amber-50',
        dot: 'bg-amber-500',
    },
    {
        key: 'hard',
        label: 'صعب',
        description: 'أسئلة بمستوى صعب',
        class: 'border-rose-200 hover:border-rose-300 data-[selected=true]:border-rose-600 data-[selected=true]:bg-rose-50',
        dot: 'bg-rose-500',
    },
] as const;

interface DifficultySelectorProps {
    value: string | null;
    onChange: (value: string | null) => void;
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
    return (
        <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">مستوى الصعوبة:</h3>
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
                                isSelected && d.key === null && 'ring-slate-600/20',
                                isSelected && d.key === 'easy' && 'ring-emerald-600/20',
                                isSelected && d.key === 'medium' && 'ring-amber-600/20',
                                isSelected && d.key === 'hard' && 'ring-rose-600/20',
                                !isSelected && 'bg-card hover:shadow-sm',
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <span className={cn('h-2.5 w-2.5 rounded-full', d.dot)} />
                                <span className="text-sm font-semibold">{d.label}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{d.description}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
