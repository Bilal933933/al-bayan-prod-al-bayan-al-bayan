import { BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        activeClass:
            'border-success bg-success/10 dark:bg-success/10 dark:border-success',
        iconBg: 'bg-success/20 dark:bg-success/20',
        iconColor: 'text-success dark:text-success',
    },
    {
        key: 'simulation' as const,
        icon: GraduationCap,
        label: 'اختبار محاكاة',
        description:
            'شارك في مسابقة بمحاور متعددة ووقت محدد لتجربة تشبه الاختبار الحقيقي',
        activeClass: 'border-info bg-info/10 dark:bg-info/10 dark:border-info',
        iconBg: 'bg-info/20 dark:bg-info/20',
        iconColor: 'text-info dark:text-info',
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
                        <div
                            className={cn(
                                'flex h-12 w-12 items-center justify-center rounded-lg',
                                isSelected ? mode.iconBg : 'bg-muted',
                            )}
                        >
                            <Icon
                                className={cn(
                                    'h-6 w-6',
                                    isSelected
                                        ? mode.iconColor
                                        : 'text-muted-foreground',
                                )}
                            />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">
                                {mode.label}
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                {mode.description}
                            </p>
                        </div>
                        {isSelected && (
                            <div
                                className={cn(
                                    'absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full',
                                    mode.key === 'training'
                                        ? 'bg-success'
                                        : 'bg-info',
                                )}
                            >
                                <svg
                                    className="h-3.5 w-3.5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
