import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const DIFFICULTY_CONFIG = {
    easy: { label: 'سهل', variant: 'secondary', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    medium: { label: 'متوسط', variant: 'secondary', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    hard: { label: 'صعب', variant: 'secondary', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
} as const;

export default function DifficultyBadge({ difficulty }: { difficulty: string }) {
    const config = DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG] ?? {
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
            <Badge variant={config.variant as 'default' | 'secondary' | 'outline'} className={config.className}>
                {config.label}
            </Badge>
        </motion.span>
    );
}
