import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart3, BookCheck, Clock, Play, Timer, Trophy } from 'lucide-react';
import DateDisplay from '@/components/date-display';
import { EvaluationBadge } from '@/components/student/results/evaluation-badge';
import { ProgressChart } from '@/components/student/results/progress-chart';
import { ResultStatsCard } from '@/components/student/results/result-stats-card';
import { TopicBreakdown } from '@/components/student/results/topic-breakdown';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/components/attempts/AttemptHelpers';
import attempts from '@/routes/student/attempts';
import type { CompetitionBreakdownItem, Evaluation, OverallStats, ProgressPoint, RecentResult, TopicBreakdownItem } from '@/types/result';
import { cn } from '@/lib/utils';

interface IndexProps {
    overallStats: OverallStats;
    evaluation: Evaluation;
    topicBreakdown: TopicBreakdownItem[];
    competitionBreakdown: CompetitionBreakdownItem[];
    recentResults: RecentResult[];
    progress: ProgressPoint[];
}

const typeLabels: Record<string, { label: string; class: string }> = {
    practice: { label: 'تدريب', class: 'bg-blue-50 text-blue-700 border-blue-200' },
    exam: { label: 'محاكاة', class: 'bg-orange-50 text-orange-700 border-orange-200' },
};

export default function Index({ overallStats, evaluation, topicBreakdown, competitionBreakdown, recentResults, progress }: IndexProps) {
    return (
        <>
            <Head title="نتائجي" />

            <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">نتائجي</h1>
                        <p className="text-sm text-muted-foreground">ملخص أدائك وتقييمك العام</p>
                    </div>
                    <EvaluationBadge evaluation={evaluation} />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <ResultStatsCard icon={BarChart3} label="إجمالي المحاولات" value={overallStats.total_attempts} sub={overallStats.completed_count > 0 ? `${overallStats.completed_count} مكتملة` : undefined} />
                    <ResultStatsCard icon={Trophy} label="متوسط النتيجة" value={overallStats.average_percentage !== null ? `${overallStats.average_percentage}%` : '—'} sub={overallStats.best_score > 0 ? `أفضل درجة: ${overallStats.best_score}` : undefined} />
                    <ResultStatsCard icon={Clock} label="الوقت الإجمالي" value={formatDuration(overallStats.total_seconds)} />
                    <ResultStatsCard icon={Play} label="قيد التنفيذ" value={overallStats.in_progress_count} />
                </div>

                {progress.length > 0 && (
                    <div className="rounded-xl border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium text-muted-foreground">التقدم عبر المحاولات</h2>
                        <ProgressChart data={progress} />
                    </div>
                )}

                <div>
                    <h2 className="mb-3 text-lg font-semibold">أداء المواضيع</h2>
                    <TopicBreakdown data={topicBreakdown} />
                </div>

                {competitionBreakdown.length > 0 && (
                    <div>
                        <h2 className="mb-3 text-lg font-semibold">أداء المسابقات</h2>
                        <div className="overflow-x-auto rounded-xl border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-start font-medium">المسابقة</th>
                                        <th className="px-4 py-3 text-center font-medium">المحاولات</th>
                                        <th className="px-4 py-3 text-center font-medium">متوسط النسبة</th>
                                        <th className="px-4 py-3 text-center font-medium">أفضل درجة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {competitionBreakdown.map((item) => (
                                        <tr key={item.competition_id} className="border-b transition-colors hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium">{item.competition_name}</td>
                                            <td className="px-4 py-3 text-center text-muted-foreground">{item.attempts_count}</td>
                                            <td className="px-4 py-3 text-center font-medium">{item.average_percentage}%</td>
                                            <td className="px-4 py-3 text-center">{item.best_score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {recentResults.length > 0 && (
                    <div>
                        <h2 className="mb-3 text-lg font-semibold">آخر النتائج</h2>
                        <div className="space-y-2">
                            {recentResults.map((result) => {
                                const typeInfo = typeLabels[result.type] ?? typeLabels.practice;

                                return (
                                    <div
                                        key={result.id}
                                        className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/30"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={cn('shrink-0 rounded-lg border px-2 py-1 text-xs font-medium', typeInfo.class)}>
                                                {typeInfo.label}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">{result.subject_name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    <DateDisplay date={result.created_at} format="relative" />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-3">
                                            <div className="text-left">
                                                <p className="text-sm font-medium">
                                                    <span className={cn(result.percentage >= 70 ? 'text-emerald-600' : result.percentage >= 40 ? 'text-amber-600' : 'text-red-600')}>
                                                        {result.percentage}%
                                                    </span>
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {result.correct_answers}/{result.total_questions}
                                                </p>
                                            </div>
                                            <Link href={attempts.show({ attempt: result.id }).url}>
                                                <Button variant="ghost" size="sm">عرض</Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {overallStats.total_attempts === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20">
                        <BarChart3 className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">لا توجد نتائج بعد.</p>
                        <p className="text-sm text-muted-foreground/60">ابدأ بحل بعض التمارين أو المسابقات لترى نتائجك هنا.</p>
                    </div>
                )}
            </motion.div>
        </>
    );
}
