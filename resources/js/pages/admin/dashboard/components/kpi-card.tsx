import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KpiCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    subText?: string;
    badge?: {
        text: string;
        color: string;
    };
    progressBar?: {
        easy: number;
        medium: number;
        hard: number;
        total: number;
    };
    iconColor: string;
    bgColor: string;
}

export function KpiCard({
    icon: Icon,
    label,
    value,
    subText,
    badge,
    progressBar,
    iconColor,
    bgColor,
}: KpiCardProps) {
    const easyPct =
        progressBar && progressBar.total > 0
            ? (progressBar.easy / progressBar.total) * 100
            : 0;
    const mediumPct =
        progressBar && progressBar.total > 0
            ? (progressBar.medium / progressBar.total) * 100
            : 0;
    const hardPct =
        progressBar && progressBar.total > 0
            ? (progressBar.hard / progressBar.total) * 100
            : 0;

    return (
        <Card className={cn('relative overflow-hidden', bgColor)}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-muted-foreground">
                            {label}
                        </p>
                        <p className="mt-1 text-2xl font-bold tracking-tight">
                            {typeof value === 'number' ? (
                                <SlidingNumber number={value} inView />
                            ) : (
                                value
                            )}
                        </p>

                        {subText && (
                            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/80">
                                {subText}
                            </p>
                        )}

                        {badge && (
                            <span
                                className={cn(
                                    'mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold',
                                    badge.color,
                                )}
                            >
                                {badge.text}
                            </span>
                        )}

                        {progressBar && progressBar.total > 0 && (
                            <div className="mt-3 space-y-1.5">
                                <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-200/50">
                                    {progressBar.easy > 0 && (
                                        <div
                                            className="h-full bg-emerald-400 transition-all"
                                            style={{ width: `${easyPct}%` }}
                                        />
                                    )}
                                    {progressBar.medium > 0 && (
                                        <div
                                            className="h-full bg-amber-400 transition-all"
                                            style={{ width: `${mediumPct}%` }}
                                        />
                                    )}
                                    {progressBar.hard > 0 && (
                                        <div
                                            className="h-full bg-red-400 transition-all"
                                            style={{ width: `${hardPct}%` }}
                                        />
                                    )}
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>سهل {progressBar.easy}</span>
                                    <span>متوسط {progressBar.medium}</span>
                                    <span>صعب {progressBar.hard}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className={cn(
                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                            iconColor,
                            'bg-white/50 dark:bg-black/20',
                        )}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
