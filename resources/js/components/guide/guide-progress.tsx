import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface GuideProgressProps {
    sections: { id: string; title: string }[];
    className?: string;
}

export function GuideProgress({ sections, className }: GuideProgressProps) {
    const [progress, setProgress] = useState(0);
    const [currentTitle, setCurrentTitle] = useState(sections[0]?.title || '');

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
            setProgress(pct);

            let active = sections[0]?.title || '';

            for (const section of sections) {
                const el = document.getElementById(section.id);

                if (el && el.offsetTop <= scrollTop + 200) {
                    active = section.title;
                }
            }

            setCurrentTitle(active);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    return (
        <div
            className={cn(
                'sticky top-0 z-40 bg-background/80 backdrop-blur-md',
                className,
            )}
        >
            <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2 md:px-8">
                <span className="text-xs font-medium whitespace-nowrap text-muted-foreground">
                    رحلة المتقدم
                </span>

                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                        className="absolute inset-y-0 right-0 rounded-full bg-primary"
                        style={{ width: `${progress * 100}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>

                <span className="truncate text-xs text-muted-foreground">
                    {currentTitle}
                </span>

                <span className="shrink-0 text-xs text-muted-foreground">
                    {Math.round(progress * 100)}%
                </span>
            </div>
        </div>
    );
}
