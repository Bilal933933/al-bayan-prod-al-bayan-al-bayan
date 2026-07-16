import { cn } from '@/lib/utils';
import type { Evaluation } from '@/types/result';

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
};

export function EvaluationBadge({ evaluation }: { evaluation: Evaluation }) {
    const colors = colorMap[evaluation.color] ?? colorMap.gray;

    return (
        <div className={cn('inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium', colors.bg, colors.text, colors.border)}>
            <div className={cn('h-2 w-2 rounded-full', colors.text.replace('text-', 'bg-'))} />
            {evaluation.label}
        </div>
    );
}
