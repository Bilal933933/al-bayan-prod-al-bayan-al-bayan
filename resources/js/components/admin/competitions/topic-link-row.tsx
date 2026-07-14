import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import VisibilityBadge from '@/components/admin/topics/visibility-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TopicWithPivot } from '@/types/topic';

export interface LinkedTopicData {
    topic_id: number;
    questions_count: number;
    duration_minutes: number;
    difficulty_distribution: Record<string, number> | null;
}

export default function TopicLinkRow({
    topic,
    index,
    onRemove,
    onChange,
}: {
    topic: TopicWithPivot;
    index: number;
    onRemove: () => void;
    onChange: (data: Partial<LinkedTopicData>) => void;
}) {
    return (
        <motion.tr
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="border-b transition-colors hover:bg-muted/50"
        >
            <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium md:text-sm">{topic.name}</span>
                    <VisibilityBadge visibility={topic.visibility} />
                </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-muted-foreground">
                {topic.code}
            </td>
            <td className="px-4 py-2">
                <div className="grid gap-1">
                    <Label className="sr-only">عدد الأسئلة</Label>
                    <Input
                        type="number"
                        min={1}
                        value={topic.pivot.questions_count}
                        onChange={(e) => onChange({ questions_count: Number(e.target.value) })}
                        className="h-7 w-16 text-center text-xs sm:w-20 sm:text-sm"
                    />
                </div>
            </td>
            <td className="px-4 py-2">
                <div className="grid gap-1">
                    <Label className="sr-only">المدة (دقائق)</Label>
                    <Input
                        type="number"
                        min={1}
                        value={topic.pivot.duration_minutes}
                        onChange={(e) => onChange({ duration_minutes: Number(e.target.value) })}
                        className="h-7 w-16 text-center text-xs sm:w-20 sm:text-sm"
                    />
                </div>
            </td>
            <td className="px-4 py-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="h-7 w-7 text-destructive hover:text-destructive"
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            </td>
        </motion.tr>
    );
}