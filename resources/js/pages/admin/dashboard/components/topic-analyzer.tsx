import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { TopicAnalytic } from '@/types/dashboard';

interface TopicAnalyzerProps {
    data: TopicAnalytic[];
}

export function TopicAnalyzer({ data }: TopicAnalyzerProps) {
    const maxFailRate = Math.max(...data.map(d => d.fail_rate), 1);

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">تحليل أداء المحاور</CardTitle>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                        لا توجد بيانات كافية للتحليل
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.map((topic) => {
                            const pct = (topic.fail_rate / maxFailRate) * 100;
                            const isHigh = topic.fail_rate > 60;
                            const isMid = topic.fail_rate > 30;

                            return (
                                <div key={topic.name}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-medium text-slate-700 truncate">
                                            {topic.name}
                                        </span>
                                        <span className={cn(
                                            'text-xs font-bold',
                                            isHigh && 'text-red-600',
                                            isMid && !isHigh && 'text-amber-600',
                                            !isMid && !isHigh && 'text-emerald-600',
                                        )}>
                                            {topic.fail_rate}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className={cn(
                                                'h-full rounded-full transition-all',
                                                isHigh && 'bg-red-400',
                                                isMid && !isHigh && 'bg-amber-400',
                                                !isMid && !isHigh && 'bg-emerald-400',
                                            )}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
