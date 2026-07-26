import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    in_progress: {
        label: 'قيد التنفيذ',
        className: 'bg-warning/20 text-warning',
    },
    completed: {
        label: 'مكتمل',
        className: 'bg-success/20 text-success',
    },
    abandoned: {
        label: 'مهمل',
        className: 'bg-muted text-muted-foreground',
    },
};

export default function AttemptStatusBadge({ status }: { status: string }) {
    const config = STATUS_CONFIG[status] ?? { label: status, className: '' };

    return (
        <Badge variant="secondary" className={config.className}>
            {status === 'in_progress' && (
                <span className="ml-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />
            )}
            {config.label}
        </Badge>
    );
}
