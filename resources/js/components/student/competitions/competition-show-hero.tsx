import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Competition } from '@/types/competition';
import { COMPETITION_ICONS } from '@/config/competition-icons';

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
        <div className="relative overflow-hidden bg-slate-900 py-10 text-white sm:py-14">
            <div
                className="absolute inset-0 opacity-20 blur-2xl"
                style={{
                    background: `radial-gradient(circle at 20% 50%, ${themeColor}, transparent), radial-gradient(circle at 80% 50%, #000, transparent)`,
                }}
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
                                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-white/15 text-white/90 shadow-lg sm:h-24 sm:w-24"
                                style={{ backgroundColor: themeColor }}
                            >
                                {Icon ? (
                                    <Icon className="h-10 w-10" />
                                ) : (
                                    <Layers className="h-10 w-10" />
                                )}
                            </div>
                        )}

                        <div className="min-w-0">
                            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                                {competition.name}
                            </h1>
                            {competition.description && (
                                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 line-clamp-2 sm:line-clamp-none">
                                    {competition.description}
                                </p>
                            )}
                            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                                <span className="font-mono" dir="ltr">#{competition.code}</span>
                                <span className={cn(
                                    'rounded-full px-2 py-0.5 text-[10px] font-medium',
                                    competition.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400',
                                )}>
                                    {competition.is_active ? 'نشط' : 'غير نشط'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
