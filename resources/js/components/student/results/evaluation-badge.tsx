import { cn } from '@/lib/utils';
import type { Evaluation } from '@/types/result';

const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    red: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', dot: 'bg-rose-400' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-400' },
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
