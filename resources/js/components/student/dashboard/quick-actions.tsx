import { Link } from '@inertiajs/react';
import { BookOpen, ChevronRight, GraduationCap, Target, TrendingUp } from 'lucide-react';
import attempts from '@/routes/student/attempts';

const actions = [
    {
        href: attempts.create().url,
        title: 'تدريب حر',
        description: 'اختر محوراً وتدرب على أسئلته بمستوى الصعوبة الذي تختاره',
        tag: 'تدريب مخصص',
        tagIcon: Target,
        colors: {
            border: 'hover:border-emerald-500',
            shadow: 'hover:shadow-emerald-500/10',
            bg: 'dark:hover:bg-emerald-950/20',
            gradient: 'from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-900/40',
            icon: 'text-emerald-600 dark:text-emerald-400',
            tag: 'text-emerald-600 dark:text-emerald-400',
        },
    },
    {
        href: attempts.create().url,
        title: 'اختبار محاكاة',
        description: 'شارك في مسابقة بمحاور متعددة ووقت محدد',
        tag: 'تحدي حقيقي',
        tagIcon: TrendingUp,
        colors: {
            border: 'hover:border-blue-500',
            shadow: 'hover:shadow-blue-500/10',
            bg: 'dark:hover:bg-blue-950/20',
            gradient: 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-900/40',
            icon: 'text-blue-600 dark:text-blue-400',
            tag: 'text-blue-600 dark:text-blue-400',
        },
    },
];

export function QuickActions() {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {actions.map(({ href, title, description, tag, tagIcon: TagIcon, colors }) => (
                <Link
                    key={title}
                    href={href}
                    className={`group relative flex items-start gap-4 rounded-2xl border-2 border-muted bg-card p-6 transition-all duration-300 ${colors.border} ${colors.shadow} ${colors.bg}`}
                >
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} ${colors.icon} group-hover:scale-110 transition-transform`}>
                        {title === 'تدريب حر' ? <BookOpen className="h-7 w-7" /> : <GraduationCap className="h-7 w-7" />}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold group-hover:text-current transition-colors">{title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
                        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${colors.tag}`}>
                            <TagIcon className="h-3.5 w-3.5" />
                            <span>{tag}</span>
                        </div>
                    </div>
                    <ChevronRight className="mt-2 h-5 w-5 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
            ))}
        </div>
    );
}
