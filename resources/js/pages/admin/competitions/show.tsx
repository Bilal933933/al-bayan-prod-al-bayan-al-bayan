import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Pencil, Plus, ArrowRight, Eye, Layers, Hash, Tag, Calendar } from 'lucide-react';
import ClassificationBadge from '@/components/admin/competitions/classification-badge';
import DateDisplay from '@/components/date-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { COMPETITION_ICONS } from '@/config/competition-icons';
import { dashboard } from '@/routes/admin';
import competitions from '@/routes/admin/competitions';
import type { BreadcrumbItem } from '@/types';
import type { Competition } from '@/types/competition';

interface ShowProps {
    competition: Competition & {
        parent: Competition | null;
        children: (Competition & { children_count?: number })[];
    };
    childrenCount: number;
}

function CompetitionIcon({ icon, className = 'h-5 w-5' }: { icon: string | null; className?: string }) {
    if (!icon) {
return null;
}

    const entry = COMPETITION_ICONS[icon];

    if (!entry) {
return null;
}

    const Icon = entry.icon;

    return <Icon className={className} />;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المسابقات', href: competitions.index() },
];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const childVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.05, duration: 0.2 },
    }),
};

function hexToRgba(hex: string, alpha: number): string {
    const clean = hex.replace('#', '');
    const r = Number.parseInt(clean.substring(0, 2), 16);
    const g = Number.parseInt(clean.substring(2, 4), 16);
    const b = Number.parseInt(clean.substring(4, 6), 16);

    if ([r, g, b].some(isNaN)) {
return `rgba(128, 128, 128, ${alpha})`;
}

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Show({ competition, childrenCount }: ShowProps) {
    const color = competition.color;
    const bgGradient = color
        ? `linear-gradient(135deg, ${color} 0%, ${hexToRgba(color, 0.7)} 100%)`
        : null;
    const isLight = color
        ? (() => {
              const hex = color.replace('#', '');
              const r = Number.parseInt(hex.substring(0, 2), 16);
              const g = Number.parseInt(hex.substring(2, 4), 16);
              const b = Number.parseInt(hex.substring(4, 6), 16);

              return r * 0.299 + g * 0.587 + b * 0.114 > 160;
          })()
        : false;
    const textClass = isLight ? 'text-foreground' : 'text-white';
    const mutedClass = isLight ? 'text-muted-foreground' : 'text-white/70';

    return (
        <>
            <Head title={`${competition.name}`} />

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
                    className="relative overflow-hidden rounded-xl"
                    style={bgGradient ? { background: bgGradient } : { background: 'linear-gradient(135deg, #1e293b, #334155)' }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
                    <div className="relative p-6 sm:p-8">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <Link href={competitions.index().url} className={`${textClass} opacity-70 hover:opacity-100 transition-opacity`}>
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <div className="flex items-center gap-3">
                                    {color && (
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                            <span className="h-3 w-3 rounded-full bg-white" />
                                        </span>
                                    )}
                                    <CompetitionIcon icon={competition.icon} className={`h-6 w-6 ${textClass}`} />
                                    <h1 className={`text-2xl font-bold sm:text-3xl ${textClass}`}>{competition.name}</h1>
                                </div>
                            </div>
                            <Link href={competitions.edit({ competition: competition.slug }).url}>
                                <Button variant={isLight ? 'outline' : 'secondary'} size="sm" className="backdrop-blur-sm">
                                    <Pencil className="h-4 w-4 ms-1" />
                                    تعديل
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" style={{ color: mutedClass }}>
                            <span className="flex items-center gap-1.5 font-mono" dir="ltr">{competition.code}</span>
                            <span className="opacity-40">|</span>
                            <span className="flex items-center gap-1.5">
                                <Hash className="h-3.5 w-3.5" />
                                #{competition.order}
                            </span>
                            <span className="opacity-40">|</span>
                                        <ClassificationBadge classification={competition.classification} />
                            <span className="opacity-40">|</span>
                            <Badge variant={competition.is_active ? 'default' : 'destructive'} className="backdrop-blur-sm">
                                {competition.is_active ? 'نشط' : 'غير نشط'}
                            </Badge>
                        </div>

                        {competition.parent && (
                            <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: mutedClass }}>
                                <span>تنتمي إلى</span>
                                <Link
                                    href={competitions.show({ competition: competition.parent.slug }).url}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm transition-colors ${isLight ? 'bg-black/10 text-foreground hover:bg-black/20' : 'bg-white/15 text-white hover:bg-white/25'}`}
                                >
                                    <CompetitionIcon icon={competition.parent.icon} className="h-3.5 w-3.5" />
                                    {competition.parent.name}
                                    <Eye className="h-3 w-3 opacity-60" />
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ===== بطاقة المعلومات ===== */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardContent className="p-6">
                            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                معلومات المسابقة
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">الاسم</label>
                                    <p className="mt-0.5 text-base font-medium">{competition.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">الكود</label>
                                    <p className="mt-0.5 font-mono text-base" dir="ltr">{competition.code}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">الرابط</label>
                                    <p className="mt-0.5 font-mono text-sm text-muted-foreground" dir="ltr">/{competition.slug}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">النوع</label>
                                    <div className="mt-0.5">
                            <ClassificationBadge classification={competition.classification} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">الحالة</label>
                                    <div className="mt-0.5">
                                        <Badge variant={competition.is_active ? 'default' : 'destructive'}>
                                            {competition.is_active ? 'نشط' : 'غير نشط'}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">الترتيب</label>
                                    <p className="mt-0.5 text-base">#{competition.order}</p>
                                </div>
                                {competition.description && (
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-medium text-muted-foreground">الوصف</label>
                                        <p className="mt-0.5 whitespace-pre-wrap text-sm text-muted-foreground">
                                            {competition.description}
                                        </p>
                                    </div>
                                )}
                                {(competition.image || competition.icon) && (
                                    <div className="sm:col-span-2 border-t pt-4">
                                        <label className="text-xs font-medium text-muted-foreground">إضافات</label>
                                        <div className="mt-2 flex flex-wrap gap-3">
                                            {competition.icon && (
                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs">
                                                    <CompetitionIcon icon={competition.icon} className="h-3.5 w-3.5" />
                                                </span>
                                            )}
                                            {competition.image && (
                                                <a href={competition.image} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
                                                    عرض الصورة
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ===== Sidebar: إحصائيات سريعة ===== */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                إحصائيات
                            </h2>
                            <div className="space-y-5">
                                <div
                                    className="rounded-lg p-4 text-center"
                                    style={color ? { background: hexToRgba(color, 0.08) } : { background: 'hsl(var(--muted))' }}
                                >
                                    <p className="text-3xl font-bold" style={color ? { color } : undefined}>
                                        {competition.classification === 'container' ? childrenCount : '—'}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {competition.classification === 'container' ? 'الأبناء المباشرون' : competition.classification === 'child' ? 'مسابقة تابعة' : 'مسابقة مستقلة'}
                                    </p>
                                </div>
                                {competition.children_count !== undefined && competition.children_count > 0 && (
                                    <div className="rounded-lg bg-muted p-4 text-center">
                                        <p className="text-3xl font-bold text-muted-foreground">{competition.children_count}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">إجمالي الأحفاد</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                                    <span>
                                        أنشئت <DateDisplay date={competition.created_at} format="relative" showTooltip />
                                    </span>
                                </div>
                                {competition.updated_at !== competition.created_at && (
                                    <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                                        <span>
                                            آخر تحديث <DateDisplay date={competition.updated_at} format="relative" showTooltip />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ===== الأبناء (إذا كانت حاوية) ===== */}
                {competition.classification === 'container' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                المسابقات الفرعية
                                <span className="text-sm font-normal text-muted-foreground">({childrenCount})</span>
                            </h3>
                            <Link href={competitions.create({ query: { parent_id: competition.id } }).url}>
                                <Button size="sm">
                                    <Plus className="h-4 w-4 ms-1" />
                                    إضافة ابن
                                </Button>
                            </Link>
                        </div>

                        {competition.children.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
                                <Layers className="mb-2 h-8 w-8 text-muted-foreground/40" />
                                <p className="text-muted-foreground">لا توجد مسابقات فرعية.</p>
                                <p className="mt-0.5 text-sm text-muted-foreground/60">يمكنك إضافة أول مسابقة فرعية بالضغط على الزر أعلاه.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {competition.children.map((child, index) => (
                                    <motion.div
                                        key={child.id}
                                        custom={index}
                                        variants={childVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <Link
                                            href={competitions.show({ competition: child.slug }).url}
                                            className="group relative block overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                                        >
                                            {child.color && (
                                                <div
                                                    className="h-1.5 w-full"
                                                    style={{ background: child.color }}
                                                />
                                            )}
                                            <div className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {child.color && (
                                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: child.color }} />
                                                        )}
                                                        <CompetitionIcon icon={child.icon} className="h-4 w-4 text-muted-foreground" />
                                                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                                                            {child.name}
                                                        </h4>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">#{child.order}</span>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span dir="ltr" className="font-mono">{child.code}</span>
                                                    <span>•</span>
                                                    <ClassificationBadge classification={child.classification} />
                                                </div>
                                                <div className="mt-3 flex items-center justify-between border-t pt-2 text-xs">
                                                    <Badge variant={child.is_active ? 'default' : 'destructive'} className="text-[10px] px-1.5 py-0">
                                                        {child.is_active ? 'نشط' : 'غير نشط'}
                                                    </Badge>
                                                    {child.children_count !== undefined && child.children_count > 0 && (
                                                        <span className="text-muted-foreground">
                                                            {child.children_count} أحفاد
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ===== مسابقة مستقلة بدون أب ===== */}
                {competition.classification === 'standalone' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-xl border border-dashed p-8 text-center"
                    >
                        <Layers className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                            مسابقة مستقلة — لا تتبع حاوية ولا تحتوي على أبناء.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </>
    );
}

Show.layout = {
    breadcrumbs,
};