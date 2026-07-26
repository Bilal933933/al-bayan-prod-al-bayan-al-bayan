import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, Play } from 'lucide-react';
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

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function timeAgo(dateStr: string | null | undefined): string {
    if (!dateStr) {
        return '—';
    }

    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'اليوم';
    }

    if (diffDays === 1) {
        return 'أمس';
    }

    if (diffDays < 7) {
        return `منذ ${diffDays} أيام`;
    }

    if (diffDays < 30) {
        return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
    }

    return formatDate(dateStr);
}

export default function JoinedCard({
    competition,
}: {
    competition: Competition;
}) {
    const iconEntry = competition.icon
        ? COMPETITION_ICONS[competition.icon]
        : null;
    const Icon = iconEntry?.icon;

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{
                y: -4,
                transition: { duration: 0.2, ease: 'easeOut' },
            }}
        >
            <div
                className={cn(
                    'relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md',
                    competition.color ? 'border-transparent' : 'border-border',
                )}
                style={
                    competition.color
                        ? { borderColor: `${competition.color}30` }
                        : undefined
                }
            >
                {/* شريط لوني علوي */}
                {competition.color && (
                    <div
                        className="h-1.5 w-full"
                        style={{ background: competition.color }}
                    />
                )}

                <div className="flex flex-1 flex-col p-5">
                    {/* الصف العلوي: أيقونة + اسم + شارة الانضمام */}
                    <div className="flex items-start gap-4">
                        <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
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
                                <Icon className="h-5 w-5" />
                            ) : (
                                <Play className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-bold text-foreground">
                                {competition.name}
                            </h3>
                            {competition.description && (
                                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                                    {competition.description}
                                </p>
                            )}
                            {competition.topics_count !== undefined && (
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {competition.topics_count} محاور
                                </p>
                            )}
                        </div>
                    </div>

                    {/* الإحصائيات */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                        {competition.joined_at && (
                            <span className="flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                انضممت: {formatDate(competition.joined_at)}
                            </span>
                        )}
                        {competition.user_attempts_count !== undefined && (
                            <span className="flex items-center gap-1.5">
                                <Play className="h-3.5 w-3.5" />
                                {competition.user_attempts_count} محاولات
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            آخر نشاط: {timeAgo(competition.last_attempt_at)}
                        </span>
                    </div>

                    {/* زر متابعة */}
                    <div className="mt-4 flex justify-end border-t pt-4">
                        <Link
                            href={
                                competitions.show({
                                    competition: competition.slug,
                                }).url
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95"
                        >
                            متابعة
                            <Play className="h-4 w-4 fill-white" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
