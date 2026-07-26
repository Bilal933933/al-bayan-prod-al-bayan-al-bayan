import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SourceCardProps {
    icon: string;
    title: string;
    description: string;
    href?: string;
    className?: string;
}

export function SourceCard({
    icon,
    title,
    description,
    href,
    className,
}: SourceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className={cn(
                'flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-sm',
                className,
            )}
        >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg">
                {icon}
            </span>

            <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-foreground">
                    {title}
                </h4>
                <p className="truncate text-xs text-muted-foreground">
                    {description}
                </p>
            </div>

            {href && (
                <Button
                    variant="outline"
                    size="xs"
                    asChild
                    className="shrink-0 gap-1"
                >
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        زيارة
                        <ExternalLink className="size-3" />
                    </a>
                </Button>
            )}
        </motion.div>
    );
}
