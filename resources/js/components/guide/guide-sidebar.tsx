import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Step {
    id: string;
    label: string;
}

interface GuideSidebarProps {
    steps: Step[];
    activeStep: string;
    className?: string;
}

export function GuideSidebar({ steps, activeStep, className }: GuideSidebarProps) {
    return (
        <nav className={cn('sticky top-24 space-y-1', className)}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                رحلة المتقدم
            </h4>
            {steps.map((step) => {
                const isActive = step.id === activeStep;
                const isPast = steps.findIndex((s) => s.id === activeStep) > steps.findIndex((s) => s.id === step.id);

                return (
                    <a
                        key={step.id}
                        href={`#${step.id}`}
                        className={cn(
                            'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
                            isActive && 'bg-primary/10 font-medium text-primary',
                            !isActive && 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        )}
                    >
                        <span
                            className={cn(
                                'flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all',
                                isActive && 'border-primary bg-primary text-primary-foreground',
                                isPast && !isActive && 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400',
                                !isActive && !isPast && 'border-border',
                            )}
                        >
                            {isPast ? '✓' : steps.findIndex((s) => s.id === step.id) + 1}
                        </span>
                        <span className="truncate">{step.label}</span>
                        {isActive && (
                            <motion.div
                                layoutId="sidebar-active"
                                className="absolute right-0 h-5 w-0.5 rounded-full bg-primary"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                    </a>
                );
            })}
        </nav>
    );
}