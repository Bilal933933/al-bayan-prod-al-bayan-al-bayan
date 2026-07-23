'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

type ShimmeringTextProps = Omit<HTMLMotionProps<'span'>, 'children'> & {
    text: string;
    duration?: number;
    color?: string;
    shimmeringColor?: string;
};

function ShimmeringText({
    text,
    duration = 2,
    color = 'var(--color-neutral-500)',
    shimmeringColor = 'white',
    style,
    ...props
}: ShimmeringTextProps) {
    return (
        <motion.span
            {...props}
            style={{
                display: 'inline-block',
                color: 'transparent',
                backgroundImage: `
linear-gradient(
90deg,
${color} 0%,
${color} 35%,
${shimmeringColor} 50%,
${color} 65%,
${color} 100%
)
`,
                backgroundSize: '250% 100%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                ...style,
            }}
            animate={{
                backgroundPosition: ['200% 0%', '-200% 0%'],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
            }}
        >
            {text}
        </motion.span>
    );
}

export { ShimmeringText, type ShimmeringTextProps };
