import { useState } from 'react';
import { BarChart3 } from 'lucide-react';

import { PreviewBadge } from '@/components/welcome/preview-badge';

interface ScoreBucket {
    range: string;
    label: string;
    count: number;
}

interface ScoreDistributionChartProps {
    data: ScoreBucket[];
    isPreview?: boolean;
}

const CHART_COLORS = ['--chart-1', '--chart-2', '--chart-3', '--chart-4'];

function cssVar(name: string): string {
    if (typeof document === 'undefined') return '#ccc';
    return (
        getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim() || '#ccc'
    );
}

export function ScoreDistributionChart({
    data,
    isPreview,
}: ScoreDistributionChartProps) {
    const [colors] = useState(() => CHART_COLORS.map((v) => cssVar(v)));

    const maxCount = Math.max(...data.map((d) => d.count), 1);
    const total = data.reduce((s, d) => s + d.count, 0);

    if (total === 0) return null;

    return (
        <div className="mt-20 w-full max-w-5xl">
            <div className="mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold">توزيع النتائج</h2>
                {isPreview && <PreviewBadge />}
            </div>

            <div className="rounded-2xl border bg-card/50 p-6 shadow-sm">
                <div
                    className="flex items-end justify-center gap-4 sm:gap-6"
                    style={{ height: 180 }}
                >
                    {data.map((bucket, i) => {
                        const pct =
                            maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
                        const h = Math.max(
                            pct * 1.6,
                            bucket.count > 0 ? 16 : 0,
                        );

                        return (
                            <div
                                key={bucket.range}
                                className="flex flex-col items-center gap-2"
                            >
                                <span className="text-xs font-bold text-muted-foreground tabular-nums">
                                    {bucket.count}
                                </span>
                                <div
                                    className="w-16 rounded-t-md transition-all duration-500 sm:w-20"
                                    style={{
                                        height: h,
                                        backgroundColor:
                                            colors[i % colors.length],
                                        opacity: bucket.count > 0 ? 1 : 0.2,
                                    }}
                                    title={`${bucket.label}: ${bucket.count} محاولة`}
                                />
                                <span className="text-[11px] text-muted-foreground">
                                    {bucket.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                    بناءً على {total} محاولة مكتملة
                </p>
            </div>
        </div>
    );
}
