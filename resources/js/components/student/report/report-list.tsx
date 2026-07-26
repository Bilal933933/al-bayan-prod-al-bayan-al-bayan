import { FileText, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReportItem } from '@/types/report';
import { reportTypeMeta, reportStatusMeta } from '@/types/report';

interface ReportListProps {
    reports: ReportItem[];
}

export function ReportList({ reports }: ReportListProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <div className="mb-5 flex items-center gap-2.5">
                <span className="text-xl">📜</span>
                <h2 className="text-sm font-bold">بلاغاتي السابقة</h2>
            </div>

            {reports.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <Inbox className="h-10 w-10 text-muted-foreground/50" />
                    <div>
                        <div className="text-sm font-bold text-muted-foreground">
                            لا توجد بلاغات سابقة
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground/70">
                            استخدم النموذج أعلاه لإرسال أول بلاغ
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {reports.map((report) => {
                        const typeMeta = reportTypeMeta[report.type];
                        const statusMeta = reportStatusMeta[report.status];

                        return (
                            <div
                                key={report.id}
                                className="rounded-xl bg-muted p-3.5 transition-all hover:bg-muted/80"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 text-lg">
                                        {typeMeta?.emoji || '📝'}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    'text-sm font-bold',
                                                    typeMeta?.color,
                                                )}
                                            >
                                                {typeMeta?.label || report.type}
                                            </span>
                                            <span
                                                className={cn(
                                                    'mr-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                                                    statusMeta?.bgClass,
                                                )}
                                            >
                                                {statusMeta?.label ||
                                                    report.status}
                                            </span>
                                        </div>
                                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                            {report.description}
                                        </p>
                                        <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground/70">
                                            <span>
                                                {new Date(
                                                    report.created_at,
                                                ).toLocaleDateString('ar-SA')}
                                            </span>
                                            {report.question && (
                                                <span className="flex items-center gap-1">
                                                    <FileText className="h-3 w-3" />
                                                    السؤال {report.question.id}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
