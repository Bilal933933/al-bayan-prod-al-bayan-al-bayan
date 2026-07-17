import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Pencil, ArrowRight, Hash, Calendar, BookOpen, Layers } from 'lucide-react';
import VisibilityBadge from '@/components/admin/topics/visibility-badge';
import DateDisplay from '@/components/date-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes/admin';
import topics from '@/routes/admin/topics';
import type { BreadcrumbItem } from '@/types';
import type { Competition } from '@/types/competition';
import type { Topic, CompetitionTopicPivot } from '@/types/topic';

interface ShowProps {
    topic: Topic & {
        competitions: (Competition & { pivot: CompetitionTopicPivot })[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المحاور', href: topics.index() },
];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Show({ topic }: ShowProps) {
    return (
        <>
            <Head title={`${topic.name}`} />

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
                                <Link href={topics.index().url} className="text-white/70 hover:text-white transition-opacity">
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <BookOpen className="h-6 w-6 text-white" />
                                <h1 className="text-2xl font-bold text-white sm:text-3xl">{topic.name}</h1>
                            </div>
                            <Link href={topics.edit({ topic: topic.id }).url}>
                                <Button variant="secondary" size="sm" className="backdrop-blur-sm">
                                    <Pencil className="h-4 w-4 ms-1" />
                                    تعديل
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
                            <span className="flex items-center gap-1.5 font-mono" dir="ltr">{topic.code}</span>
                            <span className="opacity-40">|</span>
                            <VisibilityBadge visibility={topic.visibility} />
                            <span className="opacity-40">|</span>
                            <Badge variant={topic.is_active ? 'default' : 'destructive'} className="backdrop-blur-sm">
                                {topic.is_active ? 'نشط' : 'غير نشط'}
                            </Badge>
                        </div>
                    </div>
                </motion.div>

                {/* ===== بطاقة المعلومات ===== */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardContent className="p-6">
                            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                                <Hash className="h-4 w-4 text-muted-foreground" />
                                معلومات المحور
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">الاسم</label>
                                    <p className="mt-0.5 text-base font-medium">{topic.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">الكود</label>
                                    <p className="mt-0.5 font-mono text-base" dir="ltr">{topic.code}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">الرؤية</label>
                                    <div className="mt-0.5">
                                        <VisibilityBadge visibility={topic.visibility} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">الحالة</label>
                                    <div className="mt-0.5">
                                        <Badge variant={topic.is_active ? 'default' : 'destructive'}>
                                            {topic.is_active ? 'نشط' : 'غير نشط'}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">عدد الأسئلة الافتراضي</label>
                                    <p className="mt-0.5 text-base">{topic.default_questions_count}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">مدة التدريب الافتراضية</label>
                                    <p className="mt-0.5 text-base">{topic.default_duration_minutes ? `${topic.default_duration_minutes} دقيقة` : 'بدون مؤقت'}</p>
                                </div>
                                {topic.description && (
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-medium text-muted-foreground">الوصف</label>
                                        <p className="mt-0.5 whitespace-pre-wrap text-sm text-muted-foreground">
                                            {topic.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ===== Sidebar: إحصائيات ===== */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                إحصائيات
                            </h2>
                            <div className="space-y-5">
                                <div className="rounded-lg bg-muted p-4 text-center">
                                    <p className="text-3xl font-bold text-muted-foreground">{topic.competitions.length}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">المسابقات المرتبطة</p>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                                    <span>
                                        أنشئ <DateDisplay date={topic.created_at} format="relative" showTooltip />
                                    </span>
                                </div>
                                {topic.updated_at !== topic.created_at && (
                                    <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                                        <span>
                                            آخر تحديث <DateDisplay date={topic.updated_at} format="relative" showTooltip />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ===== المسابقات المرتبطة ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        المسابقات المرتبطة
                        <span className="text-sm font-normal text-muted-foreground">({topic.competitions.length})</span>
                    </h3>

                    {topic.competitions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
                            <Layers className="mb-2 h-8 w-8 text-muted-foreground/40" />
                            <p className="text-muted-foreground">لا توجد مسابقات مرتبطة بهذا المحور.</p>
                            <p className="mt-0.5 text-sm text-muted-foreground/60">
                                يمكن ربط المحور بمسابقة من شاشة إدارة المسابقة.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/60 text-start">
                                        <th className="px-4 py-3 font-medium">المسابقة</th>
                                        <th className="px-4 py-3 font-medium whitespace-nowrap text-center">عدد الأسئلة</th>
                                        <th className="px-4 py-3 font-medium whitespace-nowrap text-center">المدة (دق)</th>
                                        <th className="px-4 py-3 font-medium whitespace-nowrap text-center">توزيع الصعوبة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topic.competitions.map((c) => (
                                        <tr key={c.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={c.id ? undefined : '#'}
                                                    className="font-medium hover:text-primary transition-colors"
                                                >
                                                    {c.name}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center">{c.pivot.questions_count}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center">{c.pivot.duration_minutes}</td>
                                            <td className="px-4 py-3 text-center">
                                                {c.pivot.difficulty_distribution ? (
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        {Object.entries(c.pivot.difficulty_distribution).map(([level, pct]) => (
                                                            <span key={level} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs">
                                                                <span className={
                                                                     level === 'easy' ? 'text-success' :
                                                                     level === 'medium' ? 'text-warning' :
                                                                     'text-destructive'
                                                                }>
                                                                    {pct}%
                                                                </span>
                                                                <span className="text-muted-foreground">
                                                                    {level === 'easy' ? 'سهل' : level === 'medium' ? 'متوسط' : 'صعب'}
                                                                </span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </>
    );
}

Show.layout = {
    breadcrumbs,
};
