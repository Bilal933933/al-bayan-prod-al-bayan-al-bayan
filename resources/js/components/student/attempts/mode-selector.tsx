import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap } from 'lucide-react';

export type AttemptMode = 'training' | 'simulation';

interface ModeSelectorProps {
    selected: AttemptMode | null;
    onChange: (mode: AttemptMode) => void;
}

const modes = [
    {
        key: 'training' as const,
        icon: BookOpen,
        label: 'تدريب حر',
        description: 'اختر محوراً وتدرب على أسئلته بمستوى الصعوبة الذي تختاره',
        activeClass: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-600',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
        key: 'simulation' as const,
        icon: GraduationCap,
        label: 'اختبار محاكاة',
        description: 'شارك في مسابقة بمحاور متعددة ووقت محدد لتجربة تشبه الاختبار الحقيقي',
        activeClass: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-600',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
];

export function ModeSelector({ selected, onChange }: ModeSelectorProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {modes.map((mode) => {
                const isSelected = selected === mode.key;
                const Icon = mode.icon;

                return (
                    <button
                        key={mode.key}
                        type="button"
                        onClick={() => onChange(mode.key)}
                        className={cn(
                            'relative flex flex-col items-start gap-4 rounded-xl border-2 p-5 text-right transition-all duration-200',
                            isSelected
                                ? mode.activeClass
                                : 'border-muted bg-card hover:border-muted-foreground/25',
                        )}
                    >
                        <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', isSelected ? mode.iconBg : 'bg-muted')}>
                            <Icon className={cn('h-6 w-6', isSelected ? mode.iconColor : 'text-muted-foreground')} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">{mode.label}</h3>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                {mode.description}
                            </p>
                        </div>
                        {isSelected && (
                            <div className={cn(
                                'absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full',
                                mode.key === 'training' ? 'bg-emerald-500' : 'bg-blue-500',
                            )}>
                                <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
