import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Pencil,
    ArrowRight,
    Mail,
    Calendar,
    Trophy,
    BookOpen,
    Layers,
    History,
    Flame,
} from 'lucide-react';
import DateDisplay from '@/components/date-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes/admin';
import students from '@/routes/admin/students';
import type { BreadcrumbItem } from '@/types';
import type { User } from '@/types';
import type { Competition } from '@/types/competition';
import type { Attempt } from '@/types/attempt';

interface ShowProps {
    student: User & {
        attempts_count: number;
        competitions_count: number;
        streak_days?: number;
        last_activity_at?: string | null;
    };
    attempts: (Attempt & { competition?: Competition | null })[];
    joinedCompetitions: (Competition & { pivot: { joined_at: string } })[];
    stats: {
        total_attempts: number;
        joined_competitions: number;
        streak_days: number;
        last_activity: string | null;
        avg_score: number | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'الطلاب', href: students.index() },
];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Show({ student, attempts, joinedCompetitions, stats }: ShowProps) {
    return (
        <>
            <Head title={`${student.name}`} />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-1 flex-col gap-6 p-6"
            >
                {/* ===== BANNER ===== */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-l from-primary/80 to-primary"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
                    <div className="relative p-6 sm:p-8">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <Link href={students.index().url} className="text-white/70 hover:text-white transition-opacity">
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white sm:text-3xl">{student.name}</h1>
                                    <p className="flex items-center gap-1.5 text-sm text-white/70" dir="ltr">
                                        <Mail className="h-3.5 w-3.5" />
                                        {student.email}
                                    </p>
                                </div>
                            </div>
                            <Link href={students.edit({ student: student.id }).url}>
                                <Button variant="secondary" size="sm" className="backdrop-blur-sm">
                                    <Pencil className="h-4 w-4 ms-1" />
                                    تعديل
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
                            <Badge variant={student.email_verified_at ? 'default' : 'destructive'} className="backdrop-blur-sm">
                                {student.email_verified_at ? 'بريد مفعل' : 'بريد غير مفعل'}
                            </Badge>
                            <span className="opacity-40">|</span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                انضم <DateDisplay date={student.created_at} format="relative" showTooltip />
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* ===== الإحصائيات السريعة ===== */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Card>
                        <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                            <History className="h-5 w-5 text-primary" />
                            <p className="text-2xl font-bold">{stats.total_attempts}</p>
                            <p className="text-xs text-muted-foreground">إجمالي المحاولات</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <p className="text-2xl font-bold">
                                {stats.avg_score !== null ? `${stats.avg_score}%` : '—'}
                            </p>
                            <p className="text-xs text-muted-foreground">متوسط الدرجات</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                            <Layers className="h-5 w-5 text-purple-500" />
                            <p className="text-2xl font-bold">{stats.joined_competitions}</p>
                            <p className="text-xs text-muted-foreground">مسابقات منضم</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                            <Flame className="h-5 w-5 text-orange-500" />
                            <p className="text-2xl font-bold">{stats.streak_days}</p>
                            <p className="text-xs text-muted-foreground">أيام متتالية</p>
                        </CardContent>
                    </Card>
                </div>

                {/* ===== محتوى الصفحة (3 أعمدة) ===== */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* آخر المحاولات */}
                    <Card className="lg:col-span-2">
                        <CardContent className="p-6">
                            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                                <History className="h-4 w-4 text-muted-foreground" />
                                آخر المحاولات
                            </h2>
                            {attempts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
                                    <History className="mb-2 h-6 w-6 text-muted-foreground/40" />
                                    <p className="text-sm text-muted-foreground">لا توجد محاولات بعد.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {attempts.map((attempt) => (
                                        <div
                                            key={attempt.id}
                                            className="flex items-center justify-between rounded-lg border p-3 text-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline">#{attempt.id}</Badge>
                                                <span className="font-medium">
                                                    {attempt.competition?.name ?? attempt.subject_name ?? '—'}
                                                </span>
                                                <Badge
                                                    variant={attempt.status === 'completed' ? 'default' : attempt.status === 'in_progress' ? 'secondary' : 'destructive'}
                                                    className="text-[10px] px-1.5 py-0"
                                                >
                                                    {attempt.status === 'completed' ? 'مكتملة' : attempt.status === 'in_progress' ? 'جارية' : 'ملغية'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                {attempt.status === 'completed' && (
                                                    <span className="font-medium text-foreground">
                                                        {attempt.correct_answers}/{attempt.total_questions}
                                                    </span>
                                                )}
                                                <DateDisplay date={attempt.created_at} format="short" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* المسابقات المنضم إليها */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                المسابقات المنضم
                            </h2>
                            {joinedCompetitions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
                                    <Layers className="mb-2 h-6 w-6 text-muted-foreground/40" />
                                    <p className="text-sm text-muted-foreground">لم ينضم لأي مسابقة بعد.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {joinedCompetitions.map((competition) => (
                                        <div
                                            key={competition.id}
                                            className="flex items-center justify-between rounded-lg border p-3 text-sm"
                                        >
                                            <div>
                                                <p className="font-medium">{competition.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    انضم <DateDisplay date={competition.pivot.joined_at} format="relative" showTooltip />
                                                </p>
                                            </div>
                                            <Badge
                                                variant={competition.is_active ? 'default' : 'destructive'}
                                                className="text-[10px] px-1.5 py-0"
                                            >
                                                {competition.is_active ? 'نشط' : 'غير نشط'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </>
    );
}

Show.layout = {
    breadcrumbs,
};
