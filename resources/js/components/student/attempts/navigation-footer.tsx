import { ArrowLeft, ArrowRight, CheckCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationFooterProps {
    currentIndex: number;
    totalQuestions: number;
    answeredQuestions: Set<string>;
    currentKey: string;
    isLastQuestion: boolean;
    canGoBack: boolean;
    isSimulation: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onFinish: () => void;
}

export function NavigationFooter({
    currentIndex,
    totalQuestions,
    answeredQuestions,
    currentKey,
    isLastQuestion,
    canGoBack,
    isSimulation,
    onPrevious,
    onNext,
    onFinish,
}: NavigationFooterProps) {
    return (
        <footer className="sticky bottom-0 z-50 border-t bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
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
                        const key = `${currentKey.split(':')[0]}:${i}`;
                        const isCurrent = i === currentIndex;
                        const isAnswered = answeredQuestions.has(key);

                        return (
                            <span
                                key={i}
                                className={cn(
                                    'h-2 w-2 rounded-full transition-all',
                                    isCurrent && 'h-2.5 w-2.5 ring-2 ring-primary/40',
                                    isAnswered && !isCurrent && 'bg-primary',
                                    !isAnswered && !isCurrent && 'bg-muted-foreground/25',
                                    isCurrent && isAnswered && 'bg-primary',
                                    isCurrent && !isAnswered && 'bg-primary/40',
                                )}
                            />
                        );
                    })}
                </div>

                <div>
                    {isLastQuestion ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={onFinish}
                        >
                            <Flag className="ml-1.5 h-4 w-4" />
                            إنهاء الاختبار
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={onNext}
                        >
                            التالي
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </footer>
    );
}
