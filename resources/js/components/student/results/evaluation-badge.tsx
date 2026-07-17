import { cn } from '@/lib/utils';
import type { Evaluation } from '@/types/result';

const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    emerald: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
    blue: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/30', dot: 'bg-info' },
    amber: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30', dot: 'bg-warning' },
    orange: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30', dot: 'bg-warning' },
    red: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30', dot: 'bg-destructive' },
    gray: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', dot: 'bg-muted-foreground' },
};

export function EvaluationBadge({ evaluation }: { evaluation: Evaluation }) {
    const colors = colorMap[evaluation.color] ?? colorMap.gray;

    return (
        <span className={cn('inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium shadow-sm', colors.bg, colors.text, colors.border)}>
            <span className={cn('inline-block h-2 w-2 rounded-full', colors.dot)} />
            {evaluation.label}
        </span>
    );
}
