import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    in_progress: {
        label: 'قيد التنفيذ',
        className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    completed: {
        label: 'مكتمل',
        className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    abandoned: {
        label: 'مهمل',
        className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    },
};

export default function AttemptStatusBadge({ status }: { status: string }) {
    const config = STATUS_CONFIG[status] ?? { label: status, className: '' };

    return (
        <Badge variant="secondary" className={config.className}>
            {status === 'in_progress' && (
                <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            )}
            {config.label}
        </Badge>
    );
}
