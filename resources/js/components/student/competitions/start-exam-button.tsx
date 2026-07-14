import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const pulseVariants = {
    idle: { scale: 1 },
    pulse: {
        scale: [1, 1.02, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
};

export default function StartExamButton({
    code,
    onClick,
}: {
    code?: string;
    onClick?: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="flex justify-center"
        >
            <motion.button
                variants={buttonVariants}
                whileTap="tap"
                whileHover="hover"
                onClick={onClick}
                className="relative flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-shadow duration-200 hover:shadow-primary/50"
            >
                <motion.span
                    variants={pulseVariants}
                    animate="pulse"
                    className="absolute inset-0 -z-10 rounded-xl bg-primary/20"
                />

                <span className="relative z-10 flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    ابدأ الاختبار
                </span>

                {code && (
                    <span className="relative z-10 text-xs opacity-80 font-mono">
                        ({code})
                    </span>
                )}
            </motion.button>
        </motion.div>
    );
}
