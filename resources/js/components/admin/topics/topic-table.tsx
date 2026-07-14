import { Link } from '@inertiajs/react';
import { Layers } from 'lucide-react';
import TopicTableRow from '@/components/admin/topics/topic-table-row';
import { Button } from '@/components/ui/button';
import topics from '@/routes/admin/topics';
import type { PaginationMeta } from '@/types/pagination';
import type { Topic } from '@/types/topic';

export default function TopicTable({
    topics: topicList,
    meta,
}: {
    topics: Topic[];
    meta: PaginationMeta;
}) {
    if (topicList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20">
                <Layers className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">لا توجد محاور بعد.</p>
                <p className="text-sm text-muted-foreground/60">أضف أول محور للبدء.</p>
                <Link href={topics.create().url} className="mt-2">
                    <Button>إنشاء أول محور</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-muted/60 text-start">
                        <th className="px-4 py-3 font-medium">الاسم</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">الكود</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">الرؤية</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap text-center">عدد الأسئلة</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap text-center">المدة</th>
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
                عرض {meta.from ?? 0}–{meta.to ?? 0} من {meta.total}
            </div>
        </div>
    );
}
