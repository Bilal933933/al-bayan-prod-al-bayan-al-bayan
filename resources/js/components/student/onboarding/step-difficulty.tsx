import { cn } from '@/lib/utils';

interface StepDifficultyProps {
    selected: string | null;
    onSelect: (level: string) => void;
    onNext: () => void;
    onPrev: () => void;
}

const levels = [
    {
        id: 'beginner',
        emoji: '🌱',
        name: 'مبتدئ',
        desc: 'أسئلة بسيطة مع شرح مفصل لكل إجابة',
    },
    {
        id: 'intermediate',
        emoji: '🌿',
        name: 'متوسط',
        desc: 'أسئلة متنوعة تحتاج بعض التفكير',
    },
    {
        id: 'advanced',
        emoji: '🌳',
        name: 'متقدم',
        desc: 'أسئلة معمقة للمختصين والطلاب',
    },
];

export function StepDifficulty({ selected, onSelect, onNext, onPrev }: StepDifficultyProps) {
    return (
        <div className="flex flex-1 flex-col px-4 pb-10 pt-6">
            <div className="mb-2 text-center">
                <span className="text-4xl">💪</span>
            </div>
            <h2 className="mb-1 text-center text-2xl font-black">ما مستواك الحالي؟</h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
                لا تقلق! هذا مجرد تقدير أولي. سيتكيف النظام تلقائياً مع أدائك.
            </p>

            <div className="mb-6 flex flex-col gap-3">
                {levels.map((level) => (
                    <button
                        key={level.id}
                        type="button"
                        onClick={() => onSelect(level.id)}
                        className={cn(
                            'flex items-center gap-4 rounded-xl border-2 p-4 text-right transition-all',
                            selected === level.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border bg-card hover:border-primary',
                        )}
                    >
                        <span className="shrink-0 text-3xl">{level.emoji}</span>
                        <div className="flex-1">
                            <div className="text-sm font-bold">{level.name}</div>
                            <div className="text-xs text-muted-foreground">{level.desc}</div>
                        </div>
                        <div
                            className={cn(
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                                selected === level.id
                                    ? 'border-primary bg-primary'
                                    : 'border-border',
                            )}
                        >
                            {selected === level.id && (
                                <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-auto flex gap-3">
                <button
                    type="button"
                    onClick={onPrev}
                    className="flex-1 rounded-xl bg-muted px-6 py-4 text-sm font-bold transition-all hover:bg-border"
                >
                    رجوع
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!selected}
                    className="flex-1 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:brightness-90 disabled:opacity-50 disabled:shadow-none"
                >
                    التالي
                </button>
            </div>
        </div>
    );
}
