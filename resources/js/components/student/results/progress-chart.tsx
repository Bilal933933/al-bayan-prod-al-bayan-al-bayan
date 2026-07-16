import type { ProgressPoint } from '@/types/result';

interface ProgressChartProps {
    data: ProgressPoint[];
}

export function ProgressChart({ data }: ProgressChartProps) {
    if (data.length === 0) return null;

    const maxPercent = 100;

    return (
        <div className="space-y-2">
            <div className="flex items-end gap-1" style={{ height: '120px' }}>
                {data.map((point, i) => {
                    const height = (point.percentage / maxPercent) * 100;

                    return (
                        <div
                            key={i}
                            className="group relative flex flex-1 flex-col items-center justify-end"
                        >
                            <div className="mb-1 text-[10px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                                {point.percentage}%
                            </div>
                            <div
                                className="w-full rounded-t-sm transition-all hover:opacity-80"
                                style={{
                                    height: `${height}%`,
                                    backgroundColor: point.type === 'exam' ? '#f97316' : '#3b82f6',
                                    minHeight: height > 0 ? '4px' : '0',
                                }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{data.length} محاولة</span>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
                        تدريب
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-sm bg-orange-500" />
                        محاكاة
                    </span>
                </div>
            </div>
        </div>
    );
}
