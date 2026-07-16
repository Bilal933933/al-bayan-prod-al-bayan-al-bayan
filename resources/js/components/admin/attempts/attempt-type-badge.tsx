import { Badge } from '@/components/ui/badge';

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
    practice: {
        label: 'تدريب',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    exam: {
        label: 'محاكاة',
        className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
};

export default function AttemptTypeBadge({ type }: { type: string }) {
    const config = TYPE_CONFIG[type] ?? { label: type, className: '' };

    return (
        <Badge variant="secondary" className={config.className}>
            {config.label}
        </Badge>
    );
}
