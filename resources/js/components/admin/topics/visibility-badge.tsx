import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const VISIBILITY_CONFIG = {
    general: { label: 'عام', variant: 'default' },
    private: { label: 'خاص', variant: 'secondary' },
} as const;

export default function VisibilityBadge({
    visibility,
}: {
    visibility: string;
}) {
    const config = VISIBILITY_CONFIG[
        visibility as keyof typeof VISIBILITY_CONFIG
    ] ?? {
        label: visibility,
        variant: 'secondary',
    };

    return (
        <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <Badge variant={config.variant as 'default' | 'secondary'}>
                {config.label}
            </Badge>
        </motion.span>
    );
}
