import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

interface Step {
    id: string;
    title: string;
    description: string;
    isActive?: boolean;
}

interface GuideTimelineProps {
    steps: Step[];
    onStepClick?: (id: string) => void;
    className?: string;
}

export function GuideTimeline({
    steps,
    onStepClick,
    className,
}: GuideTimelineProps) {
    const [expandedStep, setExpandedStep] = useState<string | null>(null);

    const handleClick = (id: string) => {
        setExpandedStep((prev) => (prev === id ? null : id));
        onStepClick?.(id);
    };

    return (
        <div className={cn('space-y-0', className)}>
            {steps.map((step, index) => {
                const isExpanded = expandedStep === step.id;

                return (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="group relative"
                    >
                        <button
                            type="button"
                            onClick={() => handleClick(step.id)}
                            className={cn(
                                'relative flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-right transition-all',
                                step.isActive
                                    ? 'border-primary/30 bg-primary/5 shadow-sm'
                                    : 'border-transparent bg-card/50 hover:border-border hover:bg-accent/50',
                                isExpanded && 'rounded-b-none border-b-0',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all',
                                    step.isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
                                )}
                            >
                                {index + 1}
                            </span>

                            <div className="flex-1 text-right">
                                <h3
                                    className={cn(
                                        'text-sm font-semibold transition-colors',
                                        step.isActive
                                            ? 'text-primary'
                                            : 'text-foreground group-hover:text-primary',
                                    )}
                                >
                                    {step.title}
                                </h3>
                                {step.description && (
                                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                        {step.description}
                                    </p>
                                )}
                            </div>

                            <ChevronDown
                                className={cn(
                                    'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                                    isExpanded && 'rotate-180',
                                )}
                            />
                        </button>

                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden rounded-b-xl border border-t-0 bg-card/30 px-5 pr-[3.75rem] pb-4 text-sm leading-relaxed text-muted-foreground"
                            >
                                <p>{step.description}</p>
                            </motion.div>
                        )}

                        {index < steps.length - 1 && (
                            <div className="mr-[1.125rem] h-4 w-px bg-border transition-colors group-hover:bg-primary/20" />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
