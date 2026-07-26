interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    onStepClick: (step: number) => void;
}

export function ProgressBar({
    currentStep,
    totalSteps,
    onStepClick,
}: ProgressBarProps) {
    const percent = ((currentStep + 1) / totalSteps) * 100;
    const stepLabels = ['الترحيب', 'المواضيع', 'المستوى', 'الإشعارات'];

    return (
        <div className="sticky top-0 z-10 bg-background pt-4 pb-2">
            <div className="mb-1.5 h-1 w-full overflow-hidden rounded-full bg-border">
                <div
                    className="h-full rounded-full bg-gradient-to-l from-primary to-accent transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div className="mb-4 flex justify-between text-xs font-medium text-muted-foreground">
                <span>
                    الخطوة {currentStep + 1} من {totalSteps}
                </span>
                <span>{Math.round(percent)}%</span>
            </div>
            <div className="flex justify-center gap-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onStepClick(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            i === currentStep
                                ? 'w-6 bg-primary'
                                : i < currentStep
                                  ? 'w-2 bg-primary/40'
                                  : 'w-2 bg-border'
                        }`}
                        aria-label={stepLabels[i]}
                    />
                ))}
            </div>
        </div>
    );
}
