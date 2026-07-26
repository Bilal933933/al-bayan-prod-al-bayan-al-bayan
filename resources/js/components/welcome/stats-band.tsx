import { BookOpen, Layers, Trophy } from 'lucide-react';
import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';

interface StatsBandProps {
    topicsCount: number;
    questionsCount: number;
    competitionsCount: number;
}

export function StatsBand({
    topicsCount,
    questionsCount,
    competitionsCount,
}: StatsBandProps) {
    const stats = [
        { icon: Layers, value: topicsCount, label: 'محور تدريبي' },
        { icon: BookOpen, value: questionsCount, label: 'سؤال' },
        { icon: Trophy, value: competitionsCount, label: 'مسابقة' },
    ];

    return (
        <div className="mx-auto mt-16 grid w-full max-w-2xl grid-cols-3 gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
                <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 rounded-xl border bg-card/50 p-4 text-center"
                >
                    <Icon className="h-5 w-5 text-brand-gold" />
                    <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
                        <SlidingNumber number={value} inView />
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {label}
                    </span>
                </div>
            ))}
        </div>
    );
}
