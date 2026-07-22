import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OnboardingTopic } from '@/types/onboarding';

interface StepTopicsProps {
    topics: OnboardingTopic[];
    selectedIds: number[];
    onToggle: (id: number) => void;
    onNext: () => void;
    onPrev: () => void;
}

const topicEmojis: Record<string, string> = {
    'القرآن الكريم': '📿',
    'السنة النبوية': '📜',
    الفقه: '⚖️',
    العقيدة: '🕋',
    السيرة: '🐪',
    الحديث: '📚',
};

export function StepTopics({ topics, selectedIds, onToggle, onNext, onPrev }: StepTopicsProps) {
    return (
        <div className="flex flex-1 flex-col px-4 pb-10 pt-6">
            <div className="mb-2 text-center">
                <span className="text-4xl">🎯</span>
            </div>
            <h2 className="mb-1 text-center text-2xl font-black">ما مجالات اهتمامك؟</h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
                اختر المواضيع التي تريد التركيز عليها. يمكنك تغييرها لاحقاً من الإعدادات.
            </p>

            <div className="mb-6 grid grid-cols-2 gap-3">
                {topics.map((topic) => {
                    const selected = selectedIds.includes(topic.id);

                    return (
                        <button
                            key={topic.id}
                            type="button"
                            onClick={() => onToggle(topic.id)}
                            className={cn(
                                'group relative overflow-hidden rounded-xl border-2 p-4 text-center transition-all',
                                selected
                                    ? 'border-primary bg-primary/5 shadow-[0_0_0_3px_var(--primary-light)]'
                                    : 'border-border bg-card hover:border-primary hover:-translate-y-0.5 hover:shadow-lg',
                            )}
                        >
                            {selected && (
                                <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground transition-all">
                                    <Check className="h-3 w-3" />
                                </span>
                            )}
                            <span className="mb-2 block text-3xl">
                                {topicEmojis[topic.name] || '📚'}
                            </span>
                            <span className="text-sm font-bold">{topic.name}</span>
                        </button>
                    );
                })}
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
                    disabled={selectedIds.length === 0}
                    className="flex-1 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:brightness-90 disabled:opacity-50 disabled:shadow-none"
                >
                    التالي
                </button>
            </div>
        </div>
    );
}
