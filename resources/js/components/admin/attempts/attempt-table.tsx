import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, History } from 'lucide-react';
import AttemptStatusBadge from '@/components/admin/attempts/attempt-status-badge';
import AttemptTypeBadge from '@/components/admin/attempts/attempt-type-badge';
import { LaravelPagination } from '@/components/laravel-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import attempts from '@/routes/admin/attempts';
import type { Attempt } from '@/types/attempt';
import type { PaginationMeta } from '@/types/pagination';

interface AttemptTableProps {
    attempts: {
        data: Attempt[];
    } & PaginationMeta;
}

export default function AttemptTable({ attempts: paginated }: AttemptTableProps) {
    const allAttempts = paginated.data;

    if (allAttempts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20">
                <History className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">لا توجد محاولات بعد.</p>
                <p className="text-sm text-muted-foreground/60">
                    عندما يبدأ المستخدمون المحاولات، ستظهر هنا.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="border-b bg-muted/80 text-start backdrop-blur-sm">
                            <th className="px-4 py-3 font-medium whitespace-nowrap">#</th>
                            <th className="px-4 py-3 font-medium whitespace-nowrap">الطالب</th>
                            <th className="px-4 py-3 font-medium whitespace-nowrap">النوع</th>
                            <th className="px-4 py-3 font-medium whitespace-nowrap">الموضوع</th>
                            <th className="px-4 py-3 font-medium whitespace-nowrap">الحالة</th>
                            <th className="px-4 py-3 font-medium whitespace-nowrap">الدرجة</th>
                            <th className="px-4 py-3 font-medium whitespace-nowrap">التاريخ</th>
                            <th className="px-4 py-3 font-medium whitespace-nowrap">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allAttempts.map((attempt, i) => {
                            const scorePercent = attempt.total_questions > 0
                                ? Math.round((attempt.correct_answers / attempt.total_questions) * 100)
                                : null;

                            return (
                                <motion.tr
                                    key={attempt.id}
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: i * 0.03 }}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                                        {attempt.id}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <p className="font-medium">{attempt.user?.name}</p>
                                        <p className="text-xs text-muted-foreground">{attempt.user?.email}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <AttemptTypeBadge type={attempt.type} />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                                        {attempt.subject_name}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <AttemptStatusBadge status={attempt.status} />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        {attempt.status === 'completed' ? (
                                            <span className="inline-flex items-center gap-1.5 font-medium">
                                                {attempt.correct_answers}/{attempt.total_questions}
                                                {scorePercent !== null && (
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            scorePercent >= 70
                                                                ? 'border-emerald-200 text-emerald-700'
                                                                : scorePercent >= 40
                                                                    ? 'border-amber-200 text-amber-700'
                                                                    : 'border-rose-200 text-rose-700'
                                                        }
                                                    >
                                                        {scorePercent}%
                                                    </Badge>
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                                        {new Date(attempt.created_at).toLocaleDateString('ar-SA', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <Link href={attempts.show({ attempt: attempt.id }).url}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                                عرض
                                            </Button>
                                        </Link>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="border-t px-4 py-3 text-sm text-muted-foreground">
                    {paginated.from}–{paginated.to} من أصل {paginated.total}
                </div>
            </div>
            <LaravelPagination meta={paginated} />
        </>
    );
}
