import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    PlusCircle,
    FileText,
    Download,
    RefreshCw,
    ShieldCheck,
    BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

interface QuickSidebarProps {
    systemHealth: number;
}

export function QuickSidebar({ systemHealth }: QuickSidebarProps) {
    const actions = [
        {
            label: 'إضافة مسابقة',
            href: admin.competitions.create().url,
            icon: PlusCircle,
            color: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
        },
        {
            label: 'إضافة أسئلة',
            href: admin.questions.create().url,
            icon: BookOpen,
            color: 'text-sky-600 bg-sky-50 hover:bg-sky-100',
        },
        {
            label: 'عرض التقارير',
            href: '#',
            icon: FileText,
            color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100',
        },
    ];

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">الإجراءات السريعة والصحة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border',
                    systemHealth > 0
                        ? 'bg-red-50 border-red-200'
                        : 'bg-emerald-50 border-emerald-200',
                )}>
                    <AlertTriangle className={cn(
                        'h-5 w-5 shrink-0',
                        systemHealth > 0 ? 'text-red-500' : 'text-emerald-500',
                    )} />
                    <div>
                        <p className="text-xs font-bold text-slate-700">سلامة بنك الأسئلة</p>
                        <p className="text-[11px] text-slate-500">
                            {systemHealth > 0
                                ? `${systemHealth} سؤال (أسئلة) بدون إجابة صحيحة`
                                : 'جميع الأسئلة سليمة'}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    {actions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className={cn(
                                'flex items-center gap-3 w-full p-2.5 rounded-xl transition-all text-sm font-medium',
                                action.color,
                            )}
                        >
                            <action.icon className="h-4 w-4" />
                            {action.label}
                        </Link>
                    ))}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 w-full p-2.5 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        تحديث البيانات
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 w-full p-2.5 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        <Download className="h-3.5 w-3.5" />
                        تصدير التقرير
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
