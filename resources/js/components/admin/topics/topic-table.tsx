import { SearchX, Layers, ArrowUp, ArrowDown } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import TopicTableRow from '@/components/admin/topics/topic-table-row';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import topics from '@/routes/admin/topics';
import type { PaginationMeta } from '@/types/pagination';
import type { Topic } from '@/types/topic';

export default function TopicTable({
    topics: topicList,
    meta,
    searchQuery = '',
    activeFilter = 'all',
    sort = 'created_at',
    direction = 'desc',
}: {
    topics: Topic[];
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

    if (topicList.length === 0) {
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
                        <p className="text-muted-foreground">لا توجد محاور بعد.</p>
                        <p className="text-sm text-muted-foreground/60">أضف أول محور للبدء.</p>
                        <Link href={topics.create().url} className="mt-2">
                            <Button>إنشاء أول محور</Button>
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
                        <SortHeader field="visibility" label="الرؤية" />
                        <SortHeader field="default_questions_count" label="عدد الأسئلة" className="text-center" />
                        <SortHeader field="default_duration_minutes" label="المدة" className="text-center" />
                        <th className="px-4 py-3 font-medium whitespace-nowrap text-center">المسابقات</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {topicList.map((topic, i) => (
                        <TopicTableRow
                            key={topic.id}
                            topic={topic}
                            index={i}
                        />
                    ))}
                </tbody>
            </table>
            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
                {topicList.length} من أصل {meta.total}
            </div>
        </div>
    );
}