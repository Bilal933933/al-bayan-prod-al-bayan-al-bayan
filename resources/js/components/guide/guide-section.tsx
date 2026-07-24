import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface GuideSectionProps {
    id?: string;
    title?: string;
    icon?: LucideIcon;
    number?: number;
    children: ReactNode;
    className?: string;
}

export function GuideSection({ id, title, icon: Icon, number, children, className }: GuideSectionProps) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className={cn('scroll-mt-24', className)}
        >
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:p-8">
                {(title || Icon || number) && (
                    <div className="mb-4 flex items-center gap-3">
                        {Icon && (
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Icon className="size-5" />
                            </div>
                        )}
                        {number && (
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                {number}
                            </span>
                        )}
                        {title && <h2 className="text-xl font-bold">{title}</h2>}
                    </div>
                )}
                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground [&_p]:leading-relaxed">
                    {children}
                </div>
            </div>
        </motion.section>
    );
}