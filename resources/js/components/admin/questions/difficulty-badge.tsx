import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const DIFFICULTY_CONFIG = {
    easy: {
        label: 'سهل',
        variant: 'secondary',
        className: 'bg-success/20 text-success',
    },
    medium: {
        label: 'متوسط',
        variant: 'secondary',
        className: 'bg-warning/20 text-warning',
    },
    hard: {
        label: 'صعب',
        variant: 'secondary',
        className: 'bg-destructive/20 text-destructive',
    },
} as const;

export default function DifficultyBadge({
    difficulty,
}: {
    difficulty: string;
}) {
    const config = DIFFICULTY_CONFIG[
        difficulty as keyof typeof DIFFICULTY_CONFIG
    ] ?? {
        label: difficulty,
        variant: 'secondary' as const,
        className: '',
    };

    return (
        <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <Badge
                variant={config.variant as 'default' | 'secondary' | 'outline'}
                className={config.className}
            >
                {config.label}
            </Badge>
        </motion.span>
    );
}
