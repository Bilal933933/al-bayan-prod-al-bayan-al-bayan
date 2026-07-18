import { Calendar, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Competition } from '@/types/competition';
import { COMPETITION_ICONS } from '@/config/competition-icons';

function formatDate(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function getStatusLabel(competition: Competition): { label: string; className: string } | null {
    if (competition.start_date && new Date(competition.start_date) > new Date()) {
        return { label: 'قريباً', className: 'bg-amber-400/20 text-amber-300' };
    }
    if (competition.end_date && new Date(competition.end_date) < new Date()) {
        return { label: 'منتهية', className: 'bg-red-400/20 text-red-300' };
    }
    return null;
}

function hexToRgba(hex: string, alpha: number): string {
    const clean = hex.replace('#', '');
    const r = Number.parseInt(clean.substring(0, 2), 16);
    const g = Number.parseInt(clean.substring(2, 4), 16);
    const b = Number.parseInt(clean.substring(4, 6), 16);
    if ([r, g, b].some(isNaN)) {
        return `rgba(128, 128, 128, ${alpha})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CompetitionShowHero({
    competition,
}: {
    competition: Competition;
}) {
    const themeColor = competition.color ?? '#4f46e5';
    const iconEntry = competition.icon ? COMPETITION_ICONS[competition.icon] : null;
    const Icon = iconEntry?.icon;

    return (
        <div className="relative overflow-hidden bg-foreground py-12 sm:py-16"
            style={{
                background: `linear-gradient(160deg, ${hexToRgba(themeColor, 0.35)}, ${hexToRgba(themeColor, 0.08)} 60%, transparent 100%), linear-gradient(180deg, var(--brand-ink) 0%, var(--brand-ink-deep) 100%)`,
            }}
        >
            <div
                className="absolute inset-0 opacity-25 blur-3xl"
                style={{
                    background: `radial-gradient(circle at 15% 30%, ${themeColor}, transparent 60%), radial-gradient(circle at 85% 70%, ${themeColor}, transparent 50%)`,
                }}
            />

            <div className="absolute -top-20 -end-20 h-64 w-64 rounded-full opacity-10 blur-3xl"
                style={{ background: themeColor }}
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-5 sm:items-center">
                        {competition.image_url ? (
                            <img
                                src={competition.image_url}
                                alt={competition.name}
                                className="h-20 w-20 shrink-0 rounded-2xl border-2 border-white/20 object-cover shadow-lg sm:h-24 sm:w-24"
                            />
                        ) : (
                            <div
                                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white/90 shadow-xl backdrop-blur-sm ring-1 ring-white/10 sm:h-24 sm:w-24"
                            >
                                {Icon ? (
                                    <Icon className="h-10 w-10" />
                                ) : (
                                    <Layers className="h-10 w-10" />
                                )}
                            </div>
                        )}

                        <div className="min-w-0">
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                {competition.name}
                            </h1>
                            {competition.description && (
                                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60 line-clamp-2 sm:line-clamp-none">
                                    {competition.description}
                                </p>
                            )}
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                                <span className="font-mono text-white/60" dir="ltr">#{competition.code}</span>
                                <span className={cn(
                                    'rounded-full px-2 py-0.5 text-[10px] font-medium',
                                    competition.is_active ? 'bg-white/15 text-white/80' : 'bg-white/10 text-white/50',
                                )}>
                                    {competition.is_active ? 'نشط' : 'غير نشط'}
                                </span>
                                {(() => {
                                    const status = getStatusLabel(competition);
                                    if (!status) return null;
                                    return (
                                        <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium', status.className)}>
                                            <Calendar className="h-3 w-3" />
                                            {status.label}
                                        </span>
                                    );
                                })()}
                                {competition.start_date && (
                                    <span className="flex items-center gap-1 text-white/60">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(competition.start_date)}
                                    </span>
                                )}
                                {competition.end_date && (
                                    <span className="flex items-center gap-1 text-white/60">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(competition.end_date)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
