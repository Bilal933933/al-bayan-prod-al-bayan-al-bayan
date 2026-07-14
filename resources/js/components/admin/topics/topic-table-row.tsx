import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, Pencil } from 'lucide-react';
import DeleteTopicDialog from '@/components/admin/topics/delete-topic-dialog';
import VisibilityBadge from '@/components/admin/topics/visibility-badge';
import { Button } from '@/components/ui/button';
import topics from '@/routes/admin/topics';
import type { Topic } from '@/types/topic';

export default function TopicTableRow({
    topic,
    index = 0,
}: {
    topic: Topic;
    index?: number;
}) {
    return (
        <motion.tr
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="border-b transition-colors hover:bg-muted/50"
        >
            <td className="break-words px-4 py-3 font-medium">{topic.name}</td>
            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{topic.code}</td>
            <td className="whitespace-nowrap px-4 py-3">
                <VisibilityBadge visibility={topic.visibility} />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-center">{topic.default_questions_count}</td>
            <td className="whitespace-nowrap px-4 py-3 text-center">
                {topic.default_duration_minutes ? `${topic.default_duration_minutes} د` : '—'}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-center">{topic.competitions_count ?? 0}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <Link href={topics.show({ topic: topic.id }).url} className="shrink-0">
                        <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={topics.edit({ topic: topic.id }).url} className="shrink-0">
                        <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DeleteTopicDialog topic={topic} />
                </div>
            </td>
        </motion.tr>
    );
}
