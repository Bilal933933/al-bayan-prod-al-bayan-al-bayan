import type { CompetitionMonitorData } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, XCircle } from 'lucide-react';

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
                                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                                <span className="text-sm font-medium text-slate-700 truncate min-w-0">
                                    {comp.name}
                                </span>

                                <div className="flex items-center gap-3 shrink-0">
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
