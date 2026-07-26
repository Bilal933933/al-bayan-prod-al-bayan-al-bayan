import { Link } from '@inertiajs/react';
import {
    BookOpen,
    ChevronRight,
    GraduationCap,
    Target,
    TrendingUp,
} from 'lucide-react';
import attempts from '@/routes/student/attempts';

const actions = [
    {
        href: attempts.create().url,
        title: 'تدريب حر',
        description: 'اختر محوراً وتدرب على أسئلته بمستوى الصعوبة الذي تختاره',
        tag: 'تدريب مخصص',
        tagIcon: Target,
        colors: {
            border: 'hover:border-success',
            shadow: 'hover:shadow-success/10',
            bg: 'dark:hover:bg-success/10',
            gradient:
                'from-success/20 to-success/30 dark:from-success/20 dark:to-success/30',
            icon: 'text-success dark:text-success',
            tag: 'text-success dark:text-success',
        },
    },
    {
        href: attempts.create().url,
        title: 'اختبار محاكاة',
        description: 'شارك في مسابقة بمحاور متعددة ووقت محدد',
        tag: 'تحدي حقيقي',
        tagIcon: TrendingUp,
        colors: {
            border: 'hover:border-info',
            shadow: 'hover:shadow-info/10',
            bg: 'dark:hover:bg-info/10',
            gradient:
                'from-info/20 to-info/30 dark:from-info/20 dark:to-info/30',
            icon: 'text-info dark:text-info',
            tag: 'text-info dark:text-info',
        },
    },
];

export function QuickActions() {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {actions.map(
                ({
                    href,
                    title,
                    description,
                    tag,
                    tagIcon: TagIcon,
                    colors,
                }) => (
                    <Link
                        key={title}
                        href={href}
                        className={`group relative flex items-start gap-4 rounded-2xl border-2 border-muted bg-card p-6 transition-all duration-300 ${colors.border} ${colors.shadow} ${colors.bg}`}
                    >
                        <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} ${colors.icon} transition-transform group-hover:scale-110`}
                        >
                            {title === 'تدريب حر' ? (
                                <BookOpen className="h-7 w-7" />
                            ) : (
                                <GraduationCap className="h-7 w-7" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold transition-colors group-hover:text-current">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                            <div
                                className={`mt-3 flex items-center gap-1 text-xs font-medium ${colors.tag}`}
                            >
                                <TagIcon className="h-3.5 w-3.5" />
                                <span>{tag}</span>
                            </div>
                        </div>
                        <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </Link>
                ),
            )}
        </div>
    );
}
