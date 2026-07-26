import { Link, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Flag, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';
import reports from '@/routes/admin/reports';
import type { PaginationMeta } from '@/types/pagination';
import { reportTypeMeta, reportStatusMeta } from '@/types/report';
import type { ReportItem } from '@/types/report';

function handleSort(sort: string, direction: string, field: string) {
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    if (sort === field && direction === 'asc') {
        params.set('direction', 'desc');
    } else {
        params.set('sort', field);
        params.set('direction', 'asc');
    }

    params.set('page', '1');

    router.visit(currentUrl.pathname + '?' + params.toString(), {
        preserveState: true,
        preserveScroll: true,
    });
}

function SortHeader({
    field,
    label,
    className,
    sort,
    direction,
}: {
    field: string;
    label: string;
    className?: string;
    sort: string;
    direction: string;
}) {
    const isActive = sort === field;

    return (
        <th
            className={cn(
                'group px-4 py-3 font-medium whitespace-nowrap',
                className,
            )}
        >
            <button
                onClick={() => handleSort(sort, direction, field)}
                className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
                {label}
                {isActive && direction === 'asc' && (
                    <ArrowUp className="h-3 w-3" />
                )}
                {isActive && direction === 'desc' && (
                    <ArrowDown className="h-3 w-3" />
                )}
            </button>
        </th>
    );
}

export default function ReportTable({
    reports: reportList,
    meta,
    searchQuery = '',
    sort = 'created_at',
    direction = 'desc',
}: {
    reports: ReportItem[];
    meta: PaginationMeta;
    searchQuery?: string;
    sort?: string;
    direction?: string;
}) {
    if (reportList.length === 0) {
        const hasFilters = searchQuery.trim() !== '';

        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20">
                {hasFilters ? (
                    <>
                        <SearchX className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                            لا توجد نتائج تطابق بحثك.
                        </p>
                        <p className="text-sm text-muted-foreground/60">
                            حاول تغيير كلمات البحث أو إلغاء التصفية.
                        </p>
                    </>
                ) : (
                    <>
                        <Flag className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                            لا توجد بلاغات بعد.
                        </p>
                        <p className="text-sm text-muted-foreground/60">
                            عندما يرسل الطلاب بلاغات ستظهر هنا.
                        </p>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                    <tr className="border-b bg-muted/80 text-start backdrop-blur-sm">
                        <SortHeader
                            sort={sort}
                            direction={direction}
                            field="id"
                            label="#"
                            className="w-16"
                        />
                        <SortHeader
                            sort={sort}
                            direction={direction}
                            field="type"
                            label="النوع"
                        />
                        <th className="px-4 py-3 font-medium whitespace-nowrap">
                            المرسل
                        </th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">
                            السؤال
                        </th>
                        <SortHeader
                            sort={sort}
                            direction={direction}
                            field="status"
                            label="الحالة"
                        />
                        <SortHeader
                            sort={sort}
                            direction={direction}
                            field="created_at"
                            label="التاريخ"
                        />
                        <th className="px-4 py-3 font-medium whitespace-nowrap">
                            الإجراءات
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {reportList.map((report, i) => (
                        <tr
                            key={report.id}
                            className={cn(
                                'border-b transition-colors hover:bg-muted/40',
                                i % 2 === 0 ? 'bg-card' : 'bg-muted/20',
                            )}
                        >
                            <td className="px-4 py-3 text-muted-foreground">
                                #{report.id}
                            </td>
                            <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1.5 text-sm">
                                    <span>
                                        {reportTypeMeta[report.type].emoji}
                                    </span>
                                    <span>
                                        {reportTypeMeta[report.type].label}
                                    </span>
                                </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                                {report.user?.name ?? '—'}
                            </td>
                            <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                                {report.question ? (
                                    <span className="text-xs">
                                        {report.question.text}
                                    </span>
                                ) : (
                                    <span className="text-xs text-muted-foreground/50">
                                        —
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={cn(
                                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                                        reportStatusMeta[report.status].bgClass,
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'h-1.5 w-1.5 rounded-full',
                                            reportStatusMeta[report.status]
                                                .dotClass,
                                        )}
                                    />
                                    {reportStatusMeta[report.status].label}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                {new Date(report.created_at).toLocaleDateString(
                                    'ar-SA',
                                    {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    },
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <Link
                                    href={
                                        reports.show({ report: report.id }).url
                                    }
                                    className="text-xs font-bold text-primary transition-colors hover:text-primary/80"
                                >
                                    عرض
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
                {reportList.length} من أصل {meta.total}
            </div>
        </div>
    );
}
