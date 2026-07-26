import { Clock, FileText, Trophy, Users } from 'lucide-react';

interface CompetitionShowStatsProps {
    totalMinutes: number;
    totalQuestions: number;
    usersCount: number;
    avgScorePercentage: number | null;
}

const statCards = [
    {
        key: 'time',
        icon: Clock,
        bg: 'bg-amber-50',
        color: 'text-amber-600',
        iconBg: 'bg-amber-100',
    },
    {
        key: 'questions',
        icon: FileText,
        bg: 'bg-blue-50',
        color: 'text-blue-600',
        iconBg: 'bg-blue-100',
    },
    {
        key: 'users',
        icon: Users,
        bg: 'bg-purple-50',
        color: 'text-purple-600',
        iconBg: 'bg-purple-100',
    },
    {
        key: 'score',
        icon: Trophy,
        bg: 'bg-emerald-50',
        color: 'text-emerald-600',
        iconBg: 'bg-emerald-100',
    },
];

export default function CompetitionShowStats({
    totalMinutes,
    totalQuestions,
    usersCount,
    avgScorePercentage,
}: CompetitionShowStatsProps) {
    const items = [
        { label: 'الوقت', value: `${totalMinutes} دقيقة`, ...statCards[0] },
        { label: 'الأسئلة', value: `${totalQuestions} سؤال`, ...statCards[1] },
        { label: 'المشاركون', value: `${usersCount} متسابق`, ...statCards[2] },
        {
            label: 'نسبة النجاح',
            value: avgScorePercentage !== null ? `${avgScorePercentage}%` : '—',
            ...statCards[3],
        },
    ];

    return (
        <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {items.map((item) => (
                    <div
                        key={item.key}
                        className={`flex items-center gap-4 rounded-2xl border border-slate-100 p-5 ${item.bg} shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
                    >
                        <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.color}`}
                        >
                            <item.icon className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-xs font-medium text-slate-400">
                                {item.label}
                            </span>
                            <span className="text-xl font-black text-slate-700">
                                {item.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
