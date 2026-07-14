import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionMeta {
    id: number;
    topic: { id: number; name: string } | null;
    questions_count: number;
}

interface SectionProgressProps {
    sections: SectionMeta[];
    currentIndex: number;
    completedIndices: number[];
}

export function SectionProgress({ sections, currentIndex, completedIndices }: SectionProgressProps) {
    if (sections.length <= 1) return null;

    return (
        <div className="mx-auto w-full max-w-4xl px-4 pt-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {sections.map((section, index) => {
                    const isCompleted = completedIndices.includes(index);
                    const isCurrent = index === currentIndex;
                    const isPending = !isCompleted && !isCurrent;

                    return (
                        <div key={section.id} className="flex items-center gap-2">
                            {index > 0 && (
                                <div className={cn(
                                    'h-0.5 w-6 rounded-full',
                                    isCompleted || isCurrent ? 'bg-primary' : 'bg-muted-foreground/20',
                                )} />
                            )}
                            <div className={cn(
                                'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                                isCurrent && 'bg-primary/10 text-primary ring-1 ring-primary/30',
                                isCompleted && 'bg-emerald-50 text-emerald-700',
                                isPending && 'bg-muted text-muted-foreground',
                            )}>
                                {isCompleted ? (
                                    <Check className="h-3 w-3" />
                                ) : (
                                    <span className="flex h-3 w-3 items-center justify-center rounded-full border text-[10px] leading-none">
                                        {index + 1}
                                    </span>
                                )}
                                <span className="truncate max-w-28">
                                    {section.topic?.name ?? `المحور ${index + 1}`}
                                </span>
                                {isCurrent && (
                                    <span className="text-[10px] opacity-70">
                                        {section.questions_count} سؤال
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
