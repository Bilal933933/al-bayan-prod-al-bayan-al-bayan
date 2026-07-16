import { cn } from '@/lib/utils';

interface StatBadgeProps {
    count: number;
    label: string;
    color: string;
}

export default function StatBadge({ count, label, color }: StatBadgeProps) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className={cn('text-xl font-bold', color)}>
                {count}
            </div>
            <span className="text-[11px] text-slate-500">{label}</span>
        </div>
    );
}
