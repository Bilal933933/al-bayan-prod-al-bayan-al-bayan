import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import competitions from '@/routes/admin/competitions';
import ClassificationBadge from '@/components/admin/competitions/classification-badge';
import DeleteCompetitionDialog from '@/components/admin/competitions/delete-competition-dialog';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import { COMPETITION_ICONS } from '@/config/competition-icons';
import type { Competition } from '@/types/competition';

export default function CompetitionTableRow({
    competition,
    index = 0,
}: {
    competition: Competition;
    index?: number;
}) {
    return (
        <motion.tr
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="border-b transition-colors hover:bg-muted/50"
        >
            <td className="break-words px-4 py-3"
                style={competition.color ? {
                    borderInlineStart: `3px solid ${competition.color}`,
                    backgroundImage: `linear-gradient(to right, ${competition.color}08, transparent)`,
                } : undefined}
            >
                <div className="flex items-center gap-2 ps-1">
                    {competition.color && (
                        <span
                            className="h-4 w-4 shrink-0 rounded-full"
                            style={{ backgroundColor: competition.color }}
                        />
                    )}
                    {(() => {
                        const iconEntry = competition.icon ? COMPETITION_ICONS[competition.icon] : null;
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
                        href={competitions.show({ competition: competition.id }).url}
                        className="break-words hover:text-primary transition-colors"
                    >
                        {competition.name}
                    </Link>
                </div>
            </td>
            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{competition.code}</td>
            <td className="whitespace-nowrap px-4 py-3">
                <ClassificationBadge classification={competition.classification} />
            </td>
            <td className="whitespace-nowrap px-4 py-3">{competition.order}</td>
            <td className="break-words px-4 py-3">
                {competition.parent ? (
                    <Link
                        href={competitions.show({ competition: competition.parent.id }).url}
                        className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                        {competition.parent.color && (
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: competition.parent.color }} />
                        )}
                        <span className="break-words">{competition.parent.name}</span>
                    </Link>
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-center">{competition.children_count ?? 0}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <Link href={competitions.show({ competition: competition.id }).url} className="shrink-0">
                        <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={competitions.edit({ competition: competition.id }).url} className="shrink-0">
                        <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DeleteCompetitionDialog competition={competition} />
                </div>
            </td>
        </motion.tr>
    );
}
