import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import CompetitionGrid from '@/components/student/competitions/competition-grid';
import { cn } from '@/lib/utils';
import type { Competition } from '@/types/competition';

const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

export default function ContainerSection({
    title,
    subtitle,
    icon: Icon = FolderOpen,
    competitions,
    accentColor = 'bg-primary',
}: {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    competitions: Competition[];
    accentColor?: string;
}) {
    if (competitions.length === 0) {
return null;
}

    return (
        <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="relative rounded-xl border bg-card p-4 md:p-6"
        >
            <div className={cn('absolute inset-y-0 start-0 w-1 rounded-s-xl', accentColor)} />

            <div className="ms-3 flex items-center gap-3 mb-4">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div>
                    <h2 className="text-lg font-semibold">{title}</h2>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    )}
                </div>
                <span className="text-sm text-muted-foreground me-auto">
                    ({competitions.length})
                </span>
            </div>

            <div className="ms-3">
                <CompetitionGrid competitions={competitions} />
            </div>
        </motion.section>
    );
}
