import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    Clock,
    Ban,
    Eye,
    FolderOpen,
    Layers,
    Target,
} from 'lucide-react';
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

    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function getStatusBadge(
    competition: Competition,
): { label: string; className: string; icon: typeof Clock } | null {
    if (
        competition.start_date &&
        new Date(competition.start_date) > new Date()
    ) {
        return {
            label: 'قريباً',
            className: 'bg-amber-100 text-amber-700',
            icon: Clock,
        };
    }

    if (competition.end_date && new Date(competition.end_date) < new Date()) {
        return {
            label: 'منتهية',
            className: 'bg-red-100 text-red-700',
            icon: Ban,
        };
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

    // ── Container (full-width) variant ──────────────────────────
    if (competition.classification === 'container') {
        const children = (competition as unknown as Record<string, unknown>)
            .children as { id: number; name: string }[] | undefined;
        const hasChildren = Array.isArray(children) && children.length > 0;
        const previewChips = hasChildren ? children!.slice(0, 3) : [];
        const remaining = hasChildren ? children!.length - 3 : 0;

        const containerCard = (
            <motion.div
                variants={cardVariants}
                whileHover={
                    isBlocked
                        ? undefined
                        : { y: -3, transition: { duration: 0.2 } }
                }
            >
                <div
                    className={cn(
                        'relative overflow-hidden rounded-xl border-2 bg-gradient-to-br from-card via-card to-primary/[0.02] shadow-sm transition-all duration-300',
                        !isBlocked && 'hover:border-primary/30 hover:shadow-lg',
                        isBlocked && 'opacity-60',
                    )}
                    style={{
                        borderColor: competition.color
                            ? `${competition.color}33`
                            : undefined,
                    }}
                >
                    {competition.color && (
                        <div
                            className="h-2 w-full"
                            style={{ background: competition.color }}
                        />
                    )}

                    {hasImage && (
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={competition.image_url!}
                                alt=""
                                className="h-full w-full object-cover opacity-10 transition-all duration-500 group-hover:scale-105 group-hover:opacity-20"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/95 to-background" />
                        </div>
                    )}

                    <div className="relative p-6 sm:p-7">
                        <div className="flex items-start gap-4 sm:gap-5">
                            <div
                                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg sm:h-18 sm:w-18"
                                style={
                                    competition.color
                                        ? {
                                              backgroundColor: `${competition.color}18`,
                                              color: competition.color,
                                          }
                                        : {
                                              backgroundColor:
                                                  'hsl(var(--muted))',
                                          }
                                }
                            >
                                {Icon ? (
                                    <Icon className="h-7 w-7 transition-transform duration-300 group-hover:rotate-6 sm:h-8 sm:w-8" />
                                ) : (
                                    <Target className="h-7 w-7 text-muted-foreground sm:h-8 sm:w-8" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-xl font-bold transition-colors group-hover:text-primary sm:text-2xl">
                                        {competition.name}
                                    </h3>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-0.5 text-xs font-semibold text-accent">
                                        <FolderOpen className="h-3 w-3" />
                                        حاوية
                                    </span>
                                </div>
                                {competition.code && (
                                    <p
                                        className="mt-0.5 font-mono text-sm text-muted-foreground"
                                        dir="ltr"
                                    >
                                        {competition.code}
                                    </p>
                                )}
                            </div>
                        </div>

                        {competition.description && (
                            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                {competition.description}
                            </p>
                        )}

                        {/* Stats bar */}
                        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg bg-muted/50 px-4 py-3 text-sm sm:text-base">
                            {competition.children_count !== undefined &&
                                competition.children_count > 0 && (
                                    <span className="inline-flex items-center gap-2 font-medium">
                                        <Layers className="h-4 w-4 text-primary" />
                                        {competition.children_count} مسابقات
                                        فرعية
                                    </span>
                                )}
                            {competition.topics_count !== undefined &&
                                competition.topics_count > 0 && (
                                    <span className="inline-flex items-center gap-2 font-medium">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                        {competition.topics_count} محاور
                                    </span>
                                )}
                            {competition.users_count !== undefined &&
                                competition.users_count > 0 && (
                                    <span className="inline-flex items-center gap-2 font-medium">
                                        <Eye className="h-4 w-4 text-primary" />
                                        {competition.users_count} طالب
                                    </span>
                                )}
                        </div>

                        {/* Children chips — appears when backend sends children data (Phase 2) */}
                        {previewChips.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                {previewChips.map(
                                    (child: { id: number; name: string }) => (
                                        <span
                                            key={child.id}
                                            className="rounded-md bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                                        >
                                            {child.name}
                                        </span>
                                    ),
                                )}
                                {remaining > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                        +{remaining} أخرى
                                    </span>
                                )}
                            </div>
                        )}

                        {statusBadge && (
                            <div
                                className={cn(
                                    'mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
                                    statusBadge.className,
                                )}
                            >
                                <statusBadge.icon className="h-3.5 w-3.5" />
                                {statusBadge.label}
                            </div>
                        )}
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
            return containerCard;
        }

        return (
            <Link
                href={competitions.show({ competition: competition.slug }).url}
            >
                {containerCard}
            </Link>
        );
    }

    const content = (
        <motion.div
            variants={cardVariants}
            whileHover={
                isBlocked
                    ? undefined
                    : { y: -6, transition: { duration: 0.2, ease: 'easeOut' } }
            }
        >
            <div
                className={cn(
                    'group relative block overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300',
                    !isBlocked && 'hover:shadow-lg',
                    competition.classification === 'standalone' &&
                        'border-secondary/20 hover:border-secondary/40 hover:shadow-secondary/10',
                    competition.classification === 'child' &&
                        'border-muted/20 hover:border-muted-foreground/30',
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

                <div className="relative p-6 sm:p-7">
                    <div className="flex items-start gap-4 sm:gap-5">
                        <div
                            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                            style={
                                competition.color
                                    ? {
                                          backgroundColor: `${competition.color}18`,
                                          color: competition.color,
                                      }
                                    : {
                                          backgroundColor: 'hsl(var(--muted))',
                                      }
                            }
                        >
                            {Icon ? (
                                <Icon className="h-7 w-7 transition-transform duration-300 group-hover:rotate-6" />
                            ) : (
                                <Target className="h-7 w-7 text-muted-foreground" />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="truncate text-lg font-bold transition-colors group-hover:text-primary">
                                    {competition.name}
                                </h3>
                                <ClassificationBadge
                                    classification={competition.classification}
                                />
                                {competition.topics_count !== undefined &&
                                    competition.topics_count > 0 && (
                                        <span className="mr-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                            <BookOpen className="h-3 w-3" />
                                            {competition.topics_count}
                                        </span>
                                    )}
                            </div>
                            <p
                                className="mt-1 font-mono text-xs text-muted-foreground"
                                dir="ltr"
                            >
                                {competition.code}
                            </p>
                        </div>
                    </div>

                    {competition.description && (
                        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {competition.description}
                        </p>
                    )}

                    {/* Compact stats bar */}
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg bg-muted/40 px-4 py-3 text-sm">
                        {competition.users_count !== undefined &&
                            competition.users_count > 0 && (
                                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                                    <Eye className="h-4 w-4 text-primary" />
                                    {competition.users_count} طالب
                                </span>
                            )}

                        {competition.children_count !== undefined &&
                            competition.children_count > 0 && (
                                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                                    <Eye className="h-4 w-4 text-primary" />
                                    {competition.children_count}
                                </span>
                            )}

                        {competition.start_date && (
                            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDate(competition.start_date)}
                            </span>
                        )}

                        {statusBadge && (
                            <span
                                className={cn(
                                    'mr-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                                    statusBadge.className,
                                )}
                            >
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
