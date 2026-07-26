import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Calendar,
    Mail,
    MessageSquareText,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes/admin';
import reports from '@/routes/admin/reports';
import type { BreadcrumbItem } from '@/types';
import { reportTypeMeta, reportStatusMeta } from '@/types/report';
import type { ReportItem } from '@/types/report';
import { Textarea } from '@/components/ui/textarea';

interface ShowProps {
    report: ReportItem & {
        description: string;
        user: { id: number; name: string; email: string; created_at: string };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'البلاغات', href: reports.index() },
];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const statusActions = [
    {
        value: 'pending',
        label: 'قيد المراجعة',
        color: 'bg-amber-500 hover:bg-amber-600',
    },
    {
        value: 'reviewed',
        label: 'تمت المراجعة',
        color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
        value: 'resolved',
        label: 'تم العلاج',
        color: 'bg-green-500 hover:bg-green-600',
    },
    {
        value: 'rejected',
        label: 'غير مقبول',
        color: 'bg-red-500 hover:bg-red-600',
    },
];

export default function Show({ report }: ShowProps) {
    const [adminResponse, setAdminResponse] = useState(
        report.admin_response ?? '',
    );

    const handleStatusChange = (newStatus: string) => {
        router.patch(
            reports.update({ report: report.id }).url,
            { status: newStatus, admin_response: adminResponse || undefined },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('تم تحديث البلاغ بنجاح'),
                onError: () => toast.error('حدث خطأ أثناء تحديث البلاغ'),
            },
        );
    };

    const typeMeta = reportTypeMeta[report.type];
    const statusMeta = reportStatusMeta[report.status];

    return (
        <>
            <Head title={`بلاغ #${report.id}`} />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-3xl flex-col gap-6 p-6"
            >
                <Link
                    href={reports.index().url}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowRight className="h-4 w-4" />
                    عودة إلى البلاغات
                </Link>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    بلاغ #{report.id}
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {new Date(
                                        report.created_at,
                                    ).toLocaleDateString('ar-SA', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <span
                                className={cn(
                                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold',
                                    statusMeta.bgClass,
                                )}
                            >
                                <span
                                    className={cn(
                                        'h-1.5 w-1.5 rounded-full',
                                        statusMeta.dotClass,
                                    )}
                                />
                                {statusMeta.label}
                            </span>
                        </div>

                        <Separator className="my-5" />

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-4">
                                <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    المرسل
                                </h2>
                                <p className="text-sm font-bold">
                                    {report.user?.name}
                                </p>
                                <p
                                    className="flex items-center gap-1.5 text-sm text-muted-foreground"
                                    dir="ltr"
                                >
                                    <Mail className="h-3.5 w-3.5" />
                                    {report.user?.email}
                                </p>
                                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5" />
                                    مسجل منذ{' '}
                                    {report.user?.created_at
                                        ? new Date(
                                              report.user.created_at,
                                          ).toLocaleDateString('ar-SA', {
                                              year: 'numeric',
                                              month: 'short',
                                          })
                                        : '—'}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                    <MessageSquareText className="h-4 w-4 text-muted-foreground" />
                                    نوع البلاغ
                                </h2>
                                <p className="inline-flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm">
                                    <span>{typeMeta.emoji}</span>
                                    <span>{typeMeta.label}</span>
                                </p>
                            </div>
                        </div>

                        <Separator className="my-5" />

                        {report.question && (
                            <div className="mb-5 space-y-2">
                                <h2 className="text-sm font-bold text-foreground">
                                    السؤال المرتبط
                                </h2>
                                <div className="rounded-xl border bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                                    #{report.question.id}:{' '}
                                    {report.question.text}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <h2 className="text-sm font-bold text-foreground">
                                وصف المشكلة
                            </h2>
                            <div className="rounded-xl border bg-card p-4 text-sm leading-relaxed">
                                {report.description}
                            </div>
                        </div>

                        {report.admin_response && (
                            <>
                                <Separator className="my-5" />
                                <div className="space-y-2">
                                    <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                        <MessageSquareText className="h-4 w-4 text-muted-foreground" />
                                        ردي السابق
                                    </h2>
                                    {report.admin_response_at && (
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(
                                                report.admin_response_at,
                                            ).toLocaleDateString('ar-SA', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    )}
                                    <div className="rounded-xl border border-brand-teal/20 bg-brand-teal/5 p-4 text-sm leading-relaxed">
                                        {report.admin_response}
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="mb-5 space-y-3">
                            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                <MessageSquareText className="h-4 w-4 text-muted-foreground" />
                                الرد على البلاغ
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                اكتب ردّك للطالب (اختياري)، ثم اختر الحالة
                                الجديدة
                            </p>
                            <Textarea
                                value={adminResponse}
                                onChange={(e) =>
                                    setAdminResponse(e.target.value)
                                }
                                placeholder="اكتب ردّك هنا..."
                                className="min-h-[100px] resize-y"
                                dir="auto"
                            />
                        </div>

                        <Separator className="mb-5" />

                        <h3 className="mb-3 text-xs font-bold text-muted-foreground">
                            تغيير الحالة
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {statusActions.map((action) => (
                                <button
                                    key={action.value}
                                    type="button"
                                    onClick={() =>
                                        handleStatusChange(action.value)
                                    }
                                    disabled={report.status === action.value}
                                    className={cn(
                                        'rounded-lg px-4 py-2 text-xs font-bold text-white transition-all',
                                        'disabled:cursor-not-allowed disabled:opacity-40',
                                        report.status === action.value
                                            ? 'ring-2 ring-white/40 ring-offset-2 ring-offset-background'
                                            : '',
                                        action.color,
                                    )}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
}

Show.layout = {
    breadcrumbs,
};
