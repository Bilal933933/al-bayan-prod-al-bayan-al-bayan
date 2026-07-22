import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, Target, Clock, Ban, Calendar, BookOpen } from 'lucide-react';
import ClassificationBadge from '@/components/admin/competitions/classification-badge';
import { COMPETITION_ICONS } from '@/config/competition-icons';
import { cn } from '@/lib/utils';
import competitions from '@/routes/student/competitions';
import type { Competition } from '@/types/competition';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
} as const;

const CLASSIFICATION_LABELS: Record<string, string> = {
    container: 'حاوية',
    standalone: 'مسابقة مستقلة',
    child: 'فرعي',
};

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getStatusBadge(competition: Competition): { label: string; className: string; icon: typeof Clock } | null {
    if (competition.start_date && new Date(competition.start_date) > new Date()) {
        return { label: 'قريباً', className: 'bg-amber-100 text-amber-700', icon: Clock };
    }

    if (competition.end_date && new Date(competition.end_date) < new Date()) {
        return { label: 'منتهية', className: 'bg-red-100 text-red-700', icon: Ban };
    }

    return null;
}

export default function CompetitionCard({
    competition,
}: {
    competition: Competition;
}) {
    const iconEntry = competition.icon
        ? COMPETITION_ICONS[competition.icon]
        : null;
    const Icon = iconEntry?.icon;

    const hasImage = !!competition.image_url;
    const statusBadge = getStatusBadge(competition);
    const isBlocked = statusBadge !== null;

    const content = (
        <motion.div
            variants={cardVariants}
            whileHover={isBlocked ? undefined : { y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
        >
            <div
                className={cn(
                    'group relative block overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300',
                    !isBlocked && 'hover:shadow-lg',
                    competition.classification === 'container' && 'border-primary/20 hover:border-primary/40 hover:shadow-primary/10',
                    competition.classification === 'standalone' && 'border-secondary/20 hover:border-secondary/40 hover:shadow-secondary/10',
                    competition.classification === 'child' && 'border-muted/20 hover:border-muted-foreground/30',
                    isBlocked && 'opacity-60',
                )}
            >
                {competition.color && (
                    <div
                        className="relative h-2 w-full"
                        style={{ background: competition.color }}
                    />
                )}

                {hasImage && (
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src={competition.image_url!}
                            alt=""
                            className="h-full w-full object-cover opacity-15 transition-all duration-500 group-hover:scale-105 group-hover:opacity-25"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/90 to-background" />
                    </div>
                )}

                <div className="relative p-5">
                    <div className="flex items-start gap-4">
                        <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                            style={competition.color ? {
                                backgroundColor: `${competition.color}18`,
                                color: competition.color,
                            } : {
                                backgroundColor: 'hsl(var(--muted))',
                            }}
                        >
                            {Icon ? (
                                <Icon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
                            ) : (
                                <Target className="h-6 w-6 text-muted-foreground" />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="truncate text-base font-semibold transition-colors group-hover:text-primary">
                                    {competition.name}
                                </h3>
                                <ClassificationBadge classification={competition.classification} />
                            </div>
                            <p className="mt-1 font-mono text-xs text-muted-foreground" dir="ltr">
                                {competition.code}
                            </p>
                        </div>
                    </div>

                    {competition.description && (
                        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                            {competition.description}
                        </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <span
                                className="inline-block h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: competition.color || 'currentColor' }}
                            />
                            {CLASSIFICATION_LABELS[competition.classification] ?? competition.classification}
                        </span>

                        {competition.topics_count !== undefined && competition.topics_count > 0 && (
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="h-4 w-4" />
                                {competition.topics_count} محاور
                            </span>
                        )}

                        {competition.users_count !== undefined && competition.users_count > 0 && (
                            <span className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4" />
                                {competition.users_count} طالب
                            </span>
                        )}

                        {competition.children_count !== undefined && competition.children_count > 0 && (
                            <span className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4" />
                                {competition.children_count}
                            </span>
                        )}

                        {competition.start_date && (
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {formatDate(competition.start_date)}
                            </span>
                        )}

                        {statusBadge && (
                            <span className={cn('mr-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', statusBadge.className)}>
                                <statusBadge.icon className="h-3.5 w-3.5" />
                                {statusBadge.label}
                            </span>
                        )}
                    </div>
                </div>

                {competition.color && (
                    <div
                        className="pointer-events-none absolute -inset-1 rounded-xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-15"
                        style={{ background: competition.color }}
                    />
                )}
            </div>
        </motion.div>
    );

    if (isBlocked) {
        return content;
    }

    return (
        <Link href={competitions.show({ competition: competition.slug }).url}>
            {content}
        </Link>
    );
}
