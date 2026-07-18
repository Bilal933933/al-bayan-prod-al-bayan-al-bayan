import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
    const { url } = usePage();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={url}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
