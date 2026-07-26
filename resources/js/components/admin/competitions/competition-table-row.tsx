import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, Layers, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ClassificationBadge from '@/components/admin/competitions/classification-badge';
import RowActions from '@/components/data-table-row-actions';
import DeleteDialog from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { COMPETITION_ICONS } from '@/config/competition-icons';
import competitions from '@/routes/admin/competitions';
import type { Competition } from '@/types/competition';

export default function CompetitionTableRow({
    competition,
    index = 0,
}: {
    competition: Competition;
    index?: number;
}) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    const rowBg =
        competition.classification === 'container'
            ? 'bg-primary/[0.03]'
            : competition.classification === 'child'
              ? 'bg-muted/20'
              : '';

    return (
        <motion.tr
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className={`border-b transition-colors hover:bg-muted/50 ${rowBg}`}
        >
            <td
                className="px-4 py-3 break-words"
                style={
                    competition.color
                        ? {
                              borderInlineStart: `3px solid ${competition.color}`,
                              backgroundImage: `linear-gradient(to right, ${competition.color}08, transparent)`,
                          }
                        : undefined
                }
            >
                <div className="flex items-center gap-2 ps-1">
                    {competition.color && (
                        <span
                            className="h-4 w-4 shrink-0 rounded-full"
                            style={{ backgroundColor: competition.color }}
                        />
                    )}
                    {(() => {
                        const iconEntry = competition.icon
                            ? COMPETITION_ICONS[competition.icon]
                            : null;

                        if (iconEntry) {
                            const Icon = iconEntry.icon;

                            return (
                                <span className="shrink-0">
                                    <Icon className="h-4 w-4" />
                                </span>
                            );
                        }

                        return null;
                    })()}
                    <Link
                        href={
                            competitions.show({ competition: competition.slug })
                                .url
                        }
                        className="break-words transition-colors hover:text-primary"
                    >
                        {competition.name}
                    </Link>
                </div>
            </td>
            <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                {competition.code}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <ClassificationBadge
                    classification={competition.classification}
                />
            </td>
            <td className="px-4 py-3 whitespace-nowrap">{competition.order}</td>
            <td className="px-4 py-3 break-words">
                {competition.parent ? (
                    <Link
                        href={
                            competitions.show({
                                competition: competition.parent.slug,
                            }).url
                        }
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                    >
                        {competition.parent.color && (
                            <span
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{
                                    backgroundColor: competition.parent.color,
                                }}
                            />
                        )}
                        <span className="break-words">
                            {competition.parent.name}
                        </span>
                    </Link>
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </td>
            <td className="px-4 py-3 text-center whitespace-nowrap">
                {(competition.children_count ?? 0) > 0 ? (
                    <Badge variant="secondary">
                        {competition.children_count}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground">
                        {competition.children_count ?? 0}
                    </span>
                )}
            </td>
            <td className="px-4 py-3">
                <RowActions
                    items={[
                        {
                            label: 'عرض التفاصيل',
                            icon: Eye,
                            href: competitions.show({
                                competition: competition.slug,
                            }).url,
                        },
                        {
                            label: 'تعديل',
                            icon: Pencil,
                            href: competitions.edit({
                                competition: competition.slug,
                            }).url,
                        },
                        ...(competition.can_have_topics
                            ? [
                                  {
                                      label: 'إدارة المحاور',
                                      icon: Layers,
                                      href: competitions.topics.edit({
                                          competition: competition.slug,
                                      }).url,
                                  } as const,
                              ]
                            : []),
                        { separator: true },
                        {
                            label: 'حذف',
                            icon: Trash2,
                            variant: 'destructive' as const,
                            onClick: () => setDeleteOpen(true),
                        },
                    ]}
                />
                <DeleteDialog
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    description={`هل أنت متأكد من حذف المسابقة "${competition.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
                    onDelete={() => {
                        router.delete(
                            competitions.destroy(competition.slug).url,
                            {
                                onSuccess: () => setDeleteOpen(false),
                                onFinish: () => setDeleteOpen(false),
                            },
                        );
                    }}
                />
            </td>
        </motion.tr>
    );
}
