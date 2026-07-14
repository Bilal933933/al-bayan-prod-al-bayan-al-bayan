import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const CLASSIFICATION_CONFIG = {
    container: { label: 'حاوية', variant: 'default' },
    standalone: { label: 'مستقلة', variant: 'secondary' },
    child: { label: 'ابن', variant: 'outline' },
} as const;

export default function ClassificationBadge({ classification }: { classification: string }) {
    const config = CLASSIFICATION_CONFIG[classification as keyof typeof CLASSIFICATION_CONFIG] ?? {
        label: classification,
        variant: 'secondary',
    };

    return (
        <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <Badge variant={config.variant as 'default' | 'secondary' | 'outline'}>
                {config.label}
            </Badge>
        </motion.span>
    );
}
