import { Trophy, Users, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CompetitionMonitorData } from '@/types/dashboard';

interface CompMonitorProps {
    data: CompetitionMonitorData[];
}

export function CompMonitor({ data }: CompMonitorProps) {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">مراقبة المسابقات</CardTitle>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                        لا توجد مسابقات نشطة
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.map((comp) => (
                            <div
                                key={comp.name}
                                className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5 transition-colors hover:bg-slate-50"
                            >
                                <span className="min-w-0 truncate text-sm font-medium text-slate-700">
                                    {comp.name}
                                </span>

                                <div className="flex shrink-0 items-center gap-3">
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Users className="h-3 w-3" />
                                        <span>{comp.students_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-red-500">
                                        <XCircle className="h-3 w-3" />
                                        <span>{comp.abandoned_attempts}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
