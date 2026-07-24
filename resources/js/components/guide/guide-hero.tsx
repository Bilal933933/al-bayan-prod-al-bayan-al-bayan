import { motion } from 'framer-motion';
import { Clock, FileText, Calendar } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CtaProps {
    label: string;
    href: string;
    variant?: 'default' | 'outline';
}

export interface GuideHeroProps {
    title: string;
    description: string;
    stepsCount?: number;
    readTime?: string;
    lastReviewed?: string;
    primaryCta?: CtaProps;
    secondaryCta?: CtaProps;
    className?: string;
}

export function GuideHero({
    title,
    description,
    stepsCount,
    readTime,
    lastReviewed,
    primaryCta,
    secondaryCta,
    className,
}: GuideHeroProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn('relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-primary/5 p-8 shadow-sm md:p-12', className)}
        >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
                    <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                        {description}
                    </p>
                </div>

                {(stepsCount || readTime || lastReviewed) && (
                    <div className="flex flex-wrap items-center gap-3">
                        {stepsCount && (
                            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                                <FileText className="size-3.5" />
                                {stepsCount} مرحلة
                            </Badge>
                        )}
                        {readTime && (
                            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                                <Clock className="size-3.5" />
                                {readTime}
                            </Badge>
                        )}
                        {lastReviewed && (
                            <Badge variant="outline" className="gap-1.5 px-3 py-1">
                                <Calendar className="size-3.5" />
                                آخر مراجعة {lastReviewed}
                            </Badge>
                        )}
                    </div>
                )}

                {(primaryCta || secondaryCta) && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        {primaryCta && (
                            <Button asChild>
                                <a href={primaryCta.href}>{primaryCta.label}</a>
                            </Button>
                        )}
                        {secondaryCta && (
                            <Button asChild variant="outline">
                                <a href={secondaryCta.href}>{secondaryCta.label}</a>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}