import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { BookOpen, Clock } from 'lucide-react';
import VisibilityBadge from '@/components/admin/topics/visibility-badge';

interface TopicCardProps {
    code: string;
    name: string;
    visibility: 'general' | 'private';
    description: string | null;
    questionsCount: number;
    durationMinutes: number | null;
    href?: string;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

export default function TopicCard({
    code,
    name,
    visibility,
    description,
    questionsCount,
    durationMinutes,
    href,
}: TopicCardProps) {
    const card = (
        <motion.div variants={cardVariants} whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}>
            <div className={`group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg hover:border-primary/30 ${href ? 'cursor-pointer' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative p-5">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                                <h3 className="truncate font-semibold group-hover:text-primary transition-colors">
                                    {name}
                                </h3>
                            </div>
                            <p className="mt-0.5 font-mono text-xs text-muted-foreground" dir="ltr">
                                {code}
                            </p>
                        </div>
                        <VisibilityBadge visibility={visibility} />
                    </div>

                    {description && (
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    )}

                    <div className="mt-4 flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" />
                            {questionsCount} سؤال
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {durationMinutes ? `${durationMinutes} دقيقة` : 'بدون مؤقت'}
                        </span>
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
