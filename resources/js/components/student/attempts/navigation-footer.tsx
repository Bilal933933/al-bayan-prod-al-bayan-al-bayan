import { ArrowLeft, ArrowRight, CheckCircle, Flag, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationFooterProps {
    currentIndex: number;
    totalQuestions: number;
    answeredQuestions: Set<string>;
    currentKey: string;
    isLastQuestion: boolean;
    isLastQuestionInSection: boolean;
    isSimulation: boolean;
    isSectionSubmitted: boolean;
    canGoBack: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onFinish: () => void;
    onSubmitSection: () => void;
    isSubmittingSection: boolean;
}

export function NavigationFooter({
    currentIndex,
    totalQuestions,
    answeredQuestions,
    currentKey,
    isLastQuestion,
    isLastQuestionInSection,
    isSimulation,
    isSectionSubmitted,
    canGoBack,
    onPrevious,
    onNext,
    onFinish,
    onSubmitSection,
    isSubmittingSection,
}: NavigationFooterProps) {
    const sectionKey = currentKey.split(':')[0];

    function renderNextButton() {
        if (isLastQuestion) {
            return (
                <Button variant="destructive" size="sm" onClick={onFinish}>
                    <Flag className="ml-1.5 h-4 w-4" />
                    إنهاء الاختبار
                </Button>
            );
        }

        if (isSimulation && isLastQuestionInSection && !isSectionSubmitted) {
            return (
                <Button
                    variant="default"
                    size="sm"
                    onClick={onSubmitSection}
                    disabled={isSubmittingSection}
                    className="gap-1"
                >
                    {isSubmittingSection ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        <CheckCircle className="h-4 w-4" />
                    )}
                    تسليم القسم
                </Button>
            );
        }

        if (isSimulation && isLastQuestionInSection && isSectionSubmitted) {
            return (
                <Button variant="default" size="sm" onClick={onNext} className="gap-1">
                    التالي
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                </Button>
            );
        }

        return (
            <Button variant="default" size="sm" onClick={onNext}>
                التالي
                <ArrowLeft className="mr-1.5 h-4 w-4" />
            </Button>
        );
    }

    const remaining = totalQuestions - currentIndex - 1;

    return (
        <footer className="sticky bottom-0 z-50 border-t bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
                <div>
                    {!isSimulation && (
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentIndex === 0 || !canGoBack}
                            onClick={onPrevious}
                        >
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                            السابق
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(totalQuestions, 15) }, (_, i) => {
                        const key = `${sectionKey}:${i}`;
                        const isCurrent = i === currentIndex;
                        const isAnswered = answeredQuestions.has(key);
                        const dist = Math.abs(i - currentIndex);
                        const size = isCurrent ? 'h-2.5 w-2.5' : dist <= 1 ? 'h-2 w-2' : 'h-1.5 w-1.5';
                        const opacity = isCurrent ? 'opacity-100' : dist <= 2 ? 'opacity-80' : 'opacity-50';

                        return (
                            <span
                                key={i}
                                className={cn(
                                    'rounded-full transition-all duration-300',
                                    size,
                                    opacity,
                                    isCurrent && 'ring-2 ring-primary/40',
                                    isAnswered && !isCurrent && 'bg-primary',
                                    !isAnswered && !isCurrent && 'bg-muted-foreground/25',
                                    isCurrent && isAnswered && 'bg-primary',
                                    isCurrent && !isAnswered && 'bg-primary/40',
                                )}
                            />
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    {remaining > 0 && (
                        <span className="hidden text-xs text-muted-foreground sm:inline tabular-nums">
                            {remaining} متبقي
                        </span>
                    )}
                    {renderNextButton()}
                </div>
            </div>
        </footer>
    );
}
