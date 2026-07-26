import { TrendingUp } from 'lucide-react';

import {
    Tilt,
    TiltContent,
} from '@/components/animate-ui/primitives/effects/tilt';
import { Badge } from '@/components/ui/badge';
import { PreviewBadge } from '@/components/welcome/preview-badge';
import { cn } from '@/lib/utils';

interface PopularTopic {
    id: number;
    name: string;
    description: string | null;
    attempts_count: number;
}

interface PopularTopicsProps {
    topics: PopularTopic[];
    isPreview?: boolean;
}

const colors = [
    'bg-primary/10 text-primary',
    'bg-accent/10 text-accent',
    'bg-info/10 text-info',
    'bg-success/10 text-success',
    'bg-destructive/10 text-destructive',
];

export function PopularTopics({ topics, isPreview }: PopularTopicsProps) {
    if (topics.length === 0) return null;

    return (
        <div className="mt-20 w-full max-w-5xl">
            <div className="mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold">الأكثر تدريباً</h2>
                {isPreview && <PreviewBadge />}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic, i) => (
                    <Tilt key={topic.id} maxTilt={5} perspective={600}>
                        <TiltContent className="group relative overflow-hidden rounded-2xl border bg-card/50 p-5 text-right transition-all hover:shadow-sm">
                            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
                            <div className="mb-3 flex items-center gap-2">
                                <div
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-xl',
                                        colors[i % colors.length],
                                    )}
                                >
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                            <h3 className="mb-1 text-sm font-bold">
                                {topic.name}
                            </h3>
                            {topic.description && (
                                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                    {topic.description}
                                </p>
                            )}
                            <Badge variant="secondary" className="text-xs">
                                {topic.attempts_count} محاولة مكتملة
                            </Badge>
                        </TiltContent>
                    </Tilt>
                ))}
            </div>
        </div>
    );
}
