import { motion } from 'framer-motion';
import CompetitionCard from '@/components/student/competitions/competition-card';
import type { Competition } from '@/types/competition';

const gridVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.05 },
    },
};

export default function CompetitionGrid({
    competitions: items,
}: {
    competitions: Competition[];
}) {
    if (items.length === 0) {
        return null;
    }

    const containers = items.filter((c) => c.classification === 'container');
    const cards = items.filter((c) => c.classification !== 'container');

    return (
        <div className="space-y-6">
            {containers.length > 0 && (
                <div className="flex flex-col gap-5">
                    {containers.map((competition) => (
                        <CompetitionCard
                            key={competition.id}
                            competition={competition}
                        />
                    ))}
                </div>
            )}

            {cards.length > 0 && (
                <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                >
                    {cards.map((competition) => (
                        <CompetitionCard
                            key={competition.id}
                            competition={competition}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}
