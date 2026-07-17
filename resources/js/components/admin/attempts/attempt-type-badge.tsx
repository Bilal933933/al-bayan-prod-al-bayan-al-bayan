import { Badge } from '@/components/ui/badge';

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
    practice: {
        label: 'تدريب',
        className: 'bg-info/20 text-info',
    },
    exam: {
        label: 'محاكاة',
        className: 'bg-palette-3/20 text-palette-3',
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
