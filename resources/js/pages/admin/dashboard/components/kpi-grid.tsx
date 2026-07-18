import type { KpiStats } from '@/types/dashboard';
import { KpiCard } from './kpi-card';
import { Users, BarChart3, LayoutGrid, Database } from 'lucide-react';

interface KpiGridProps {
    stats: KpiStats;
}

export function KpiGrid({ stats }: KpiGridProps) {
    const standaloneCount = stats.competitions.total - stats.competitions.containers;

    const totalDistribution = stats.questions.distribution.easy
        + stats.questions.distribution.medium
        + stats.questions.distribution.hard;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
                icon={Users}
                label="التفاعل والمستخدمين"
                value={stats.students_count}
                subText={`${stats.active_streaks} طالب لديهم نشاط متتالٍ`}
                iconColor="text-palette-1"
                bgColor="bg-palette-1/10 dark:bg-palette-1/20"
            />

            <KpiCard
                icon={BarChart3}
                label="كفاءة المحاولات"
                value={stats.attempts.total}
                subText={`نسبة الإكمال ${stats.attempts.completion_rate}%`}
                badge={{
                    text: `${stats.attempts.in_progress} قيد التنفيذ`,
                    color: 'bg-amber-50 text-amber-700 border border-amber-200',
                }}
                iconColor="text-emerald-600"
                bgColor="bg-emerald-50/50 dark:bg-emerald-950/20"
            />

            <KpiCard
                icon={LayoutGrid}
                label="هيكلية المسابقات"
                value={stats.competitions.total}
                subText={`${stats.competitions.containers} حاوية · ${standaloneCount} مستقلة / فردية`}
                iconColor="text-purple-600"
                bgColor="bg-purple-50/50 dark:bg-purple-950/20"
            />

            <KpiCard
                icon={Database}
                label="عمق بنك الأسئلة"
                value={stats.questions.total}
                progressBar={{
                    easy: stats.questions.distribution.easy,
                    medium: stats.questions.distribution.medium,
                    hard: stats.questions.distribution.hard,
                    total: totalDistribution,
                }}
                iconColor="text-sky-600"
                bgColor="bg-sky-50/50 dark:bg-sky-950/20"
            />
        </div>
    );
}
