import { cn } from '@/lib/utils';
import type { TopicBreakdownItem } from '@/types/result';

const statusConfig = {
    strength: { label: 'قوة', icon: '🟢', class: 'text-emerald-600 bg-emerald-50' },
    average: { label: 'متوسط', icon: '🟡', class: 'text-amber-600 bg-amber-50' },
    weakness: { label: 'ضعف', icon: '🔴', class: 'text-red-600 bg-red-50' },
};

export function TopicBreakdown({ data }: { data: TopicBreakdownItem[] }) {
    if (data.length === 0) {
        return <p className="py-4 text-center text-sm text-muted-foreground">لا توجد بيانات كافية.</p>;
    }

    return (
        <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-start font-medium">الموضوع</th>
                        <th className="px-4 py-3 text-center font-medium">المحاولات</th>
                        <th className="px-4 py-3 text-center font-medium">متوسط النسبة</th>
                        <th className="px-4 py-3 text-center font-medium">أفضل درجة</th>
                        <th className="px-4 py-3 text-center font-medium">التقييم</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {
                        const status = statusConfig[item.status];

                        return (
                            <tr key={item.topic_id} className="border-b transition-colors hover:bg-muted/30">
                                <td className="px-4 py-3 font-medium">{item.topic_name}</td>
                                <td className="px-4 py-3 text-center text-muted-foreground">{item.attempts_count}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={cn('font-medium', item.average_percentage >= 75 ? 'text-emerald-600' : item.average_percentage >= 50 ? 'text-amber-600' : 'text-red-600')}>
                                        {item.average_percentage}%
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">{item.best_score}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-medium', status.class)}>
                                        {status.label}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
