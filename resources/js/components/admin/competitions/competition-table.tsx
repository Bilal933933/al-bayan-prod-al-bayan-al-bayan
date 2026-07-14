import { Layers } from 'lucide-react';
import { Link } from '@inertiajs/react';
import competitions from '@/routes/admin/competitions';
import { Button } from '@/components/ui/button';
import CompetitionTableRow from '@/components/admin/competitions/competition-table-row';
import type { Competition } from '@/types/competition';
import type { PaginationMeta } from '@/types/pagination';

export default function CompetitionTable({
    competitions: competitionList,
    meta,
}: {
    competitions: Competition[];
    meta: PaginationMeta;
}) {
    if (competitionList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20">
                <Layers className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">لا توجد مسابقات بعد.</p>
                <p className="text-sm text-muted-foreground/60">أضف أول مسابقة للبدء.</p>
                <Link href={competitions.create().url} className="mt-2">
                    <Button>إنشاء أول مسابقة</Button>
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
                        <th className="px-4 py-3 font-medium whitespace-nowrap">النوع</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">الترتيب</th>
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
                عرض {meta.from ?? 0}–{meta.to ?? 0} من {meta.total}
            </div>
        </div>
    );
}
