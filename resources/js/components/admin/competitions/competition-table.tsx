import { Link, router } from '@inertiajs/react';
import { SearchX, Layers, ArrowUp, ArrowDown } from 'lucide-react';
import CompetitionTableRow from '@/components/admin/competitions/competition-table-row';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import competitions from '@/routes/admin/competitions';
import type { Competition } from '@/types/competition';
import type { PaginationMeta } from '@/types/pagination';

export default function CompetitionTable({
    competitions: competitionList,
    meta,
    searchQuery = '',
    activeFilter = 'all',
    sort = 'created_at',
    direction = 'desc',
}: {
    competitions: Competition[];
    meta: PaginationMeta;
    searchQuery?: string;
    activeFilter?: string;
    sort?: string;
    direction?: string;
}) {
    function handleSort(field: string) {
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

    function SortHeader({ field, label, className }: { field: string; label: string; className?: string }) {
        const isActive = sort === field;

        return (
            <th className={cn('px-4 py-3 font-medium whitespace-nowrap group', className)}>
                <button
                    onClick={() => handleSort(field)}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                    {label}
                    {isActive && direction === 'asc' && <ArrowUp className="h-3 w-3" />}
                    {isActive && direction === 'desc' && <ArrowDown className="h-3 w-3" />}
                </button>
            </th>
        );
    }

    if (competitionList.length === 0) {
        const hasFilters = searchQuery.trim() !== '' || activeFilter !== 'all';

        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20">
                {hasFilters ? (
                    <>
                        <SearchX className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">لا توجد نتائج تطابق بحثك.</p>
                        <p className="text-sm text-muted-foreground/60">
                            حاول تغيير كلمات البحث أو إلغاء التصفية.
                        </p>
                    </>
                ) : (
                    <>
                        <Layers className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">لا توجد مسابقات بعد.</p>
                        <p className="text-sm text-muted-foreground/60">أضف أول مسابقة للبدء.</p>
                        <Link href={competitions.create().url} className="mt-2">
                            <Button>إنشاء أول مسابقة</Button>
                        </Link>
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
                        <SortHeader field="name" label="الاسم" />
                        <SortHeader field="code" label="الكود" />
                        <SortHeader field="classification" label="النوع" />
                        <SortHeader field="order" label="الترتيب" />
                        <th className="px-4 py-3 font-medium whitespace-nowrap">المسابقة الأب</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap text-center">الفروع</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {competitionList.map((competition, i) => (
                        <CompetitionTableRow
                            key={competition.id}
                            competition={competition}
                            index={i}
                        />
                    ))}
                </tbody>
            </table>
            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
                {competitionList.length} من أصل {meta.total}
            </div>
        </div>
    );
}
