import { motion } from 'framer-motion';
import { AlertTriangle, Info, Lightbulb, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const typeConfig = {
    info: {
        icon: Info,
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-200',
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-800 dark:text-amber-200',
        iconColor: 'text-amber-600 dark:text-amber-400',
    },
    tip: {
        icon: Lightbulb,
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        border: 'border-emerald-200 dark:border-emerald-800',
        text: 'text-emerald-800 dark:text-emerald-200',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    error: {
        icon: XCircle,
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-200',
        iconColor: 'text-red-600 dark:text-red-400',
    },
};

type InfoBoxType = keyof typeof typeConfig;

interface InfoBoxProps {
    type: InfoBoxType;
    title?: string;
    message: string;
    className?: string;
}

export function InfoBox({ type, title, message, className }: InfoBoxProps) {
    const config = typeConfig[type];
    const Icon: LucideIcon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className={cn('flex gap-3 rounded-xl border p-4', config.bg, config.border, className)}
        >
            <Icon className={cn('mt-0.5 size-5 shrink-0', config.iconColor)} />
            <div className={cn('space-y-1', config.text)}>
                {title && <p className="text-sm font-semibold">{title}</p>}
                <p className="text-sm leading-relaxed">{message}</p>
            </div>
        </motion.div>
    );
}