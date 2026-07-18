import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import JoinedGrid from '@/components/student/competitions/join/joined-grid';
import type { Competition } from '@/types/competition';

const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

export default function MyCompetitionsSection({
    competitions,
}: {
    competitions: Competition[];
}) {
    if (competitions.length === 0) {
        return null;
    }

    return (
        <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="relative rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 md:p-6"
        >
            <div className="absolute inset-y-0 start-0 w-1 rounded-s-xl bg-emerald-500" />

            <div className="ms-3">
                <div className="mb-4 flex items-center gap-3">
                    <Bookmark className="h-5 w-5 text-emerald-600" />
                    <div>
                        <h2 className="text-lg font-bold text-emerald-900">
                            مسابقاتي
                        </h2>
                        <p className="text-sm text-emerald-700/70">
                            المسابقات التي انضممت إليها
                        </p>
                    </div>
                    <span className="me-auto text-sm font-medium text-emerald-600">
                        ({competitions.length})
                    </span>
                </div>

                <JoinedGrid competitions={competitions} />
            </div>
        </motion.section>
    );
}
