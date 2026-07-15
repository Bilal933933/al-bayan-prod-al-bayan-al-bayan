import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronLeft, Clock, Play, RotateCcw } from 'lucide-react';
import VisibilityBadge from '@/components/admin/topics/visibility-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BestScore {
    correct: number;
    total: number;
}

interface TopicCardProps {
    id: number;
    code: string;
    name: string;
    visibility: 'general' | 'private';
    description: string | null;
    questionsCount: number;
    durationMinutes: number | null;
    href?: string;
    userAttemptsCount?: number;
    hasInProgress?: boolean;
    inProgressAttemptId?: number | null;
    bestScore?: BestScore | null;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

const topicColors = [
    { from: 'from-indigo-500/10', border: 'border-indigo-200', icon: 'text-indigo-600', bg: 'bg-indigo-50' },
    { from: 'from-emerald-500/10', border: 'border-emerald-200', icon: 'text-emerald-600', bg: 'bg-emerald-50' },
    { from: 'from-amber-500/10', border: 'border-amber-200', icon: 'text-amber-600', bg: 'bg-amber-50' },
    { from: 'from-rose-500/10', border: 'border-rose-200', icon: 'text-rose-600', bg: 'bg-rose-50' },
    { from: 'from-violet-500/10', border: 'border-violet-200', icon: 'text-violet-600', bg: 'bg-violet-50' },
    { from: 'from-cyan-500/10', border: 'border-cyan-200', icon: 'text-cyan-600', bg: 'bg-cyan-50' },
];

function getColor(id: number) {
    return topicColors[id % topicColors.length];
}

export default function TopicCard({
    id,
    code,
    name,
    visibility,
    description,
    questionsCount,
    durationMinutes,
    href,
    userAttemptsCount = 0,
    hasInProgress = false,
    inProgressAttemptId,
    bestScore,
}: TopicCardProps) {
    const color = getColor(id);

    function handleResume(e: React.MouseEvent) {
        if (!hasInProgress || !inProgressAttemptId) return;
        e.preventDefault();
        e.stopPropagation();

        router.visit(`/attempts/${inProgressAttemptId}`);
    }

    const scorePercent = bestScore ? Math.round((bestScore.correct / bestScore.total) * 100) : null;

    const card = (
        <motion.div variants={cardVariants} whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}>
            <div className={`group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg ${color.border} ${href ? 'cursor-pointer' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${color.from} to-transparent opacity-0 transition-opacity group-hover:opacity-100`} />

                <div className="relative p-5">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', color.bg)}>
                                    <BookOpen className={cn('h-4 w-4', color.icon)} />
                                </div>
                                <h3 className="truncate font-semibold group-hover:text-primary transition-colors">
                                    {name}
                                </h3>
                            </div>
                            <div className="mt-1.5 flex items-center gap-2">
                                <p className="font-mono text-xs text-muted-foreground" dir="ltr">
                                    {code}
                                </p>
                                <VisibilityBadge visibility={visibility} />
                                {userAttemptsCount > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                        {userAttemptsCount} محاولة
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {description && (
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t pt-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <BookOpen className="h-3.5 w-3.5" />
                                {questionsCount} سؤال
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {durationMinutes ? `${durationMinutes} د` : 'بدون'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {hasInProgress ? (
                                <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={handleResume}
                                    className="gap-1 text-xs"
                                >
                                    <Play className="h-3 w-3" />
                                    استئناف
                                </Button>
                            ) : bestScore ? (
                                <div className="flex items-center gap-1.5">
                                    <Badge variant="secondary" className="gap-1 text-xs">
                                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                                        {bestScore.correct}/{bestScore.total}
                                    </Badge>
                                    <Button size="xs" variant="ghost" className="gap-1 text-xs text-muted-foreground">
                                        <RotateCcw className="h-3 w-3" />
                                        إعادة
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    if (href) {
        return <Link href={href}>{card}</Link>;
    }

    return card;
}
