import { motion } from 'framer-motion';
import JoinedCard from '@/components/student/competitions/join/joined-card';
import type { Competition } from '@/types/competition';

const gridVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.05 },
    },
};

export default function JoinedGrid({
    competitions: items,
}: {
    competitions: Competition[];
}) {
    if (items.length === 0) {
        return null;
    }

    return (
        <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
            {items.map((competition) => (
                <JoinedCard key={competition.id} competition={competition} />
            ))}
        </motion.div>
    );
}
