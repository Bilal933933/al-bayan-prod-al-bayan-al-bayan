import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmbeddedCTAProps {
    title: string;
    description: string;
    buttonText: string;
    href: string;
    icon?: LucideIcon;
    className?: string;
}

export function EmbeddedCTA({
    title,
    description,
    buttonText,
    href,
    icon: Icon,
    className,
}: EmbeddedCTAProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
                'relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-card p-8 shadow-sm',
                className,
            )}
        >
            <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        {Icon && (
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Icon className="size-5" />
                            </div>
                        )}
                        <h3 className="text-lg font-bold">{title}</h3>
                    </div>
                    <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                </div>

                <Button asChild className="shrink-0 gap-2">
                    <a href={href}>
                        {buttonText}
                        <ArrowLeft className="size-4" />
                    </a>
                </Button>
            </div>
        </motion.div>
    );
}
