import { BarChart3 } from 'lucide-react';
import type { ProgressPoint } from '@/types/result';
import { RechartsBar } from './progress-chart-client';

interface ProgressChartProps {
    data: ProgressPoint[];
}

export function ProgressChart({ data }: ProgressChartProps) {
    if (data.length === 0) {
return null;
}

    const allZero = data.every((p) => p.percentage === 0);

    if (allZero) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground/60">قم بإجراء المزيد من الاختبارات ليظهر تقدمك هنا.</p>
            </div>
        );
    }

    const chartData = data.map((p) => ({
        percentage: p.percentage,
        type: p.type,
    }));

    return (
        <div className="space-y-3">
            <RechartsBar data={chartData} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{data.length} محاولة</span>
                <div className="flex items-center gap-3" dir="rtl">
                    <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-sm bg-warning" />
                        محاكاة
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-sm bg-info" />
                        تدريب
                    </span>
                </div>
            </div>
        </div>
    );
}
