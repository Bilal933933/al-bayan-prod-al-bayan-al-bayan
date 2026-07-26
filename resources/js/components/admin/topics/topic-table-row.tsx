import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import VisibilityBadge from '@/components/admin/topics/visibility-badge';
import RowActions from '@/components/data-table-row-actions';
import DeleteDialog from '@/components/delete-dialog';
import topics from '@/routes/admin/topics';
import type { Topic } from '@/types/topic';

export default function TopicTableRow({
    topic,
    index = 0,
}: {
    topic: Topic;
    index?: number;
}) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <motion.tr
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="border-b transition-colors hover:bg-muted/50"
        >
            <td className="px-4 py-3 font-medium break-words">{topic.name}</td>
            <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                {topic.code}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <VisibilityBadge visibility={topic.visibility} />
            </td>
            <td className="px-4 py-3 text-center whitespace-nowrap">
                {topic.default_questions_count}
            </td>
            <td className="px-4 py-3 text-center whitespace-nowrap">
                {topic.default_duration_minutes
                    ? `${topic.default_duration_minutes} د`
                    : '—'}
            </td>
            <td className="px-4 py-3 text-center whitespace-nowrap">
                {topic.competitions_count ?? 0}
            </td>
            <td className="px-4 py-3">
                <RowActions
                    items={[
                        {
                            label: 'عرض التفاصيل',
                            icon: Eye,
                            href: topics.show({ topic: topic.id }).url,
                        },
                        {
                            label: 'تعديل',
                            icon: Pencil,
                            href: topics.edit({ topic: topic.id }).url,
                        },
                        { separator: true },
                        {
                            label: 'حذف',
                            icon: Trash2,
                            variant: 'destructive',
                            onClick: () => setDeleteOpen(true),
                        },
                    ]}
                />
                <DeleteDialog
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    description={`هل أنت متأكد من حذف المحور "${topic.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
                    onDelete={() => {
                        router.delete(topics.destroy(topic.id).url, {
                            onSuccess: () => setDeleteOpen(false),
                            onFinish: () => setDeleteOpen(false),
                        });
                    }}
                />
            </td>
        </motion.tr>
    );
}
