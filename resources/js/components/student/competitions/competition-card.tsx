import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import competitions from '@/routes/student/competitions';
import ClassificationBadge from '@/components/admin/competitions/classification-badge';
import { cn } from '@/lib/utils';
import type { Competition } from '@/types/competition';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

const bgColorMap = {
    container: 'border-primary/20 hover:border-primary/40',
    standalone: 'border-secondary/20 hover:border-secondary/40',
    child: 'border-muted/20 hover:border-muted/40',
};

export default function CompetitionCard({
    competition,
}: {
    competition: Competition;
}) {
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
        >
            <Link
                href={competitions.show({ competition: competition.id }).url}
                className={cn(
                    'group relative block overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg',
                    bgColorMap[competition.classification] || 'border-border hover:border-muted-foreground/30'
                )}
            >
                {competition.color && (
                    <div
                        className="h-1.5 w-full"
                        style={{ background: competition.color }}
                    />
                )}

                <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                            {competition.color && (
                                <span
                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: competition.color }}
                                />
                            )}
                            <h3 className="truncate font-semibold group-hover:text-primary transition-colors">
                                {competition.name}
                            </h3>
                        </div>
                        <ClassificationBadge classification={competition.classification} />
                    </div>

                    {competition.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {competition.description}
                        </p>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                        <span className="font-mono" dir="ltr">
                            {competition.code}
                        </span>

                        {competition.children_count !== undefined && competition.children_count > 0 && (
                            <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {competition.children_count}
                            </span>
                        )}
                    </div>
                </div>

                <div className="absolute -bottom-2 -start-2 opacity-0 transition-all duration-500 group-hover:opacity-15 group-hover:rotate-12">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-primary/30">
                        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" strokeDasharray="2 4" />
                        <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 3" />
                        <circle cx="20" cy="20" r="3" fill="currentColor" />
                    </svg>
                </div>
            </Link>
        </motion.div>
    );
}
