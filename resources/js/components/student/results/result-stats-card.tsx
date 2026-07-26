import type { LucideIcon } from 'lucide-react';

import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';

interface ResultStatsCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    sub?: string;
}

export function ResultStatsCard({
    icon: Icon,
    label,
    value,
    sub,
}: ResultStatsCardProps) {
    const isNumeric = typeof value === 'number';

    return (
        <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight">
                {isNumeric ? <SlidingNumber number={value} inView /> : value}
            </p>
            {sub && (
                <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            )}
        </div>
    );
}
