import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, Trophy, BookOpen, HelpCircle, Layers, CheckCircle, Play, ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import adminAttempts from '@/routes/admin/attempts';
import type { BreadcrumbItem } from '@/types';

interface AttemptWithRelations {
    id: number;
    user_id: number;
    user?: { id: number; name: string } | null;
    type: 'practice' | 'exam';
    topic?: { id: number; name: string } | null;
    competition?: { id: number; name: string } | null;
    status: 'in_progress' | 'completed' | 'abandoned';
    started_at: string;
    finished_at: string | null;
    total_questions: number;
    correct_answers: number;
    created_at: string;
}

interface DashboardProps {
    stats: {
        total_users: number;
        total_competitions: number;
        total_topics: number;
        total_questions: number;
        total_attempts: number;
        completed_attempts: number;
        in_progress_attempts: number;
    };
    recentAttempts: AttemptWithRelations[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '#' },
];

export default function Dashboard({ stats, recentAttempts }: DashboardProps) {
    return (
        <>
            <Head title="لوحة التحكم" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-6 p-6"
            >
                <Heading title="لوحة التحكم" description="نظرة عامة على المنصة" />

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={Users}
                        label="المستخدمين"
                        value={stats.total_users}
                        iconColor="text-palette-1"
                        bgColor="bg-palette-1/10 dark:bg-palette-1/20"
                    />
                    <StatCard
                        icon={Trophy}
                        label="المسابقات"
                        value={stats.total_competitions}
                        iconColor="text-palette-4"
                        bgColor="bg-palette-4/10 dark:bg-palette-4/20"
                    />
                    <StatCard
                        icon={BookOpen}
                        label="المواضيع"
                        value={stats.total_topics}
                        iconColor="text-palette-2"
                        bgColor="bg-palette-2/10 dark:bg-palette-2/20"
                    />
                    <StatCard
                        icon={HelpCircle}
                        label="الأسئلة"
                        value={stats.total_questions}
                        iconColor="text-palette-3"
                        bgColor="bg-palette-3/10 dark:bg-palette-3/20"
                    />
                    <StatCard
                        icon={Layers}
                        label="إجمالي المحاولات"
                        value={stats.total_attempts}
                        iconColor="text-palette-5"
                        bgColor="bg-palette-5/10 dark:bg-palette-5/20"
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="مكتملة"
                        value={stats.completed_attempts}
                        iconColor="text-success"
                        bgColor="bg-success/10 dark:bg-success/20"
                    />
                    <StatCard
                        icon={Play}
                        label="قيد التنفيذ"
                        value={stats.in_progress_attempts}
                        iconColor="text-warning"
                        bgColor="bg-warning/10 dark:bg-warning/20"
                    />
                </div>

                {/* Recent Attempts */}
                {recentAttempts.length > 0 && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>آخر المحاولات</CardTitle>
                            <Link
                                href={adminAttempts.index().url}
                                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                            >
                                عرض الكل
                                <ArrowLeft className="h-3.5 w-3.5" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentAttempts.map((attempt) => (
                                    <Link
                                        key={attempt.id}
                                        href={adminAttempts.show({ attempt: attempt.id }).url}
                                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-sm font-medium">{attempt.user?.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {attempt.topic?.name ?? attempt.competition?.name ?? '—'}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className={cn(
                                                'rounded-full px-2 py-0.5 font-medium',
                                                attempt.status === 'completed' && 'bg-success/20 text-success',
                                                attempt.status === 'in_progress' && 'bg-info/20 text-info',
                                                attempt.status === 'abandoned' && 'bg-muted text-muted-foreground',
                                            )}>
                                                {attempt.status === 'completed' ? 'مكتملة' : attempt.status === 'in_progress' ? 'قيد التنفيذ' : 'ملغاة'}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </motion.div>
        </>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    iconColor,
    bgColor,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    iconColor: string;
    bgColor: string;
}) {
    return (
        <Card className={cn('relative overflow-hidden', bgColor)}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
                    </div>
                    <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', iconColor, bgColor.replace('/20', '/30'))}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

Dashboard.layout = {
    breadcrumbs,
};
