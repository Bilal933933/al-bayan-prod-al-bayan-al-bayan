import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LegalReferenceProps {
    law: string;
    article: string;
    summary: string;
    link?: string;
    className?: string;
}

export function LegalReference({ law, article, summary, link, className }: LegalReferenceProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className={cn('flex gap-4 rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900 dark:bg-blue-950/20', className)}
        >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                <BookOpen className="size-5" />
            </div>

            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                        {law}
                    </span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        المادة {article}
                    </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
                {link && (
                    <Button variant="ghost" size="xs" className="gap-1 text-xs text-blue-600 dark:text-blue-400" asChild>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                            قراءة النص الكامل
                            <ExternalLink className="size-3" />
                        </a>
                    </Button>
                )}
            </div>
        </motion.div>
    );
}