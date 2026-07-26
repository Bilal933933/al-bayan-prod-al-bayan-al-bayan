import { motion } from 'framer-motion';
import ClassificationBadge from '@/components/admin/competitions/classification-badge';
import { COMPETITION_ICONS } from '@/config/competition-icons';
import { cn } from '@/lib/utils';
import type { Competition } from '@/types/competition';

const heroVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
} as const;

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

function isLightColor(hex: string): boolean {
    const clean = hex.replace('#', '');
    const r = Number.parseInt(clean.substring(0, 2), 16);
    const g = Number.parseInt(clean.substring(2, 4), 16);
    const b = Number.parseInt(clean.substring(4, 6), 16);

    return r * 0.299 + g * 0.587 + b * 0.114 > 160;
}

export default function CompetitionHero({
    competition,
    childrenCount,
}: {
    competition: Competition;
    childrenCount?: number;
}) {
    const color = competition.color;
    const bgGradient = color
        ? `linear-gradient(135deg, ${color} 0%, ${hexToRgba(color, 0.7)} 100%)`
        : 'linear-gradient(135deg, #1e293b, #334155)';

    const light = color ? isLightColor(color) : false;
    const textClass = light ? 'text-gray-900' : 'text-white';
    const mutedClass = light ? 'text-gray-600' : 'text-white/70';

    const iconEntry = competition.icon
        ? COMPETITION_ICONS[competition.icon]
        : null;
    const Icon = iconEntry?.icon;

    return (
        <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden rounded-xl"
            style={{ background: bgGradient }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />

            <div className="absolute -end-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -start-16 -bottom-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

            <div className="relative p-6 sm:p-8">
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                        {Icon && (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                                <Icon className={cn('h-7 w-7', textClass)} />
                            </div>
                        )}

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1
                                    className={cn(
                                        'text-2xl font-bold sm:text-3xl',
                                        textClass,
                                    )}
                                >
                                    {competition.name}
                                </h1>
                                <ClassificationBadge
                                    classification={competition.classification}
                                />
                            </div>

                            {competition.description && (
                                <p
                                    className={cn(
                                        'mt-2 text-sm sm:text-base',
                                        mutedClass,
                                    )}
                                >
                                    {competition.description}
                                </p>
                            )}

                            <div
                                className={cn(
                                    'mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs',
                                    mutedClass,
                                )}
                            >
                                <span className="font-mono" dir="ltr">
                                    #{competition.code}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                        {childrenCount !== undefined && childrenCount > 0 && (
                            <div className="text-center">
                                <div
                                    className={cn(
                                        'text-2xl font-bold',
                                        textClass,
                                    )}
                                >
                                    {childrenCount}
                                </div>
                                <div className={cn('text-xs', mutedClass)}>
                                    مسابقة فرعية
                                </div>
                            </div>
                        )}

                        <div
                            className={cn(
                                'rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm',
                                competition.is_active
                                    ? 'bg-white/20'
                                    : 'bg-black/10',
                            )}
                        >
                            {competition.is_active ? 'نشط' : 'غير نشط'}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
