import { BookOpen, HelpCircle, Users } from 'lucide-react';

interface StatCardsProps {
    totalQuestions: number;
    topicsCount: number;
    usersCount: number;
}

export default function StatCards({ totalQuestions, topicsCount, usersCount }: StatCardsProps) {
    const stats = [
        {
            icon: HelpCircle,
            bg: 'bg-blue-50',
            color: 'text-blue-600',
            label: 'إجمالي الأسئلة',
            value: `${totalQuestions} سؤال`,
        },
        {
            icon: BookOpen,
            bg: 'bg-emerald-50',
            color: 'text-emerald-600',
            label: 'عدد المحاور',
            value: `${topicsCount} محاور`,
        },
        {
            icon: Users,
            bg: 'bg-amber-50',
            color: 'text-amber-600',
            label: 'الطلاب المنضمين',
            value: `${usersCount} طالب`,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                    <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="block text-xs font-medium text-slate-400">{stat.label}</span>
                        <span className="text-lg font-black text-slate-700">{stat.value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
