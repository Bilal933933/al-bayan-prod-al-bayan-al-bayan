import { ArrowLeft, ArrowRight, CheckCircle, Flag, LayoutGrid, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface NavigationFooterProps {
    currentIndex: number;
    totalQuestions: number;
    answeredQuestions: Set<string>;
    flaggedQuestions: Set<string>;
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
    onToggleFlag: () => void;
    onJumpToQuestion: (index: number) => void;
    isSubmittingSection: boolean;
}

function QuestionGrid({
    totalQuestions,
    currentIndex,
    answeredQuestions,
    flaggedQuestions,
    sectionKey,
    onJump,
}: {
    totalQuestions: number;
    currentIndex: number;
    answeredQuestions: Set<string>;
    flaggedQuestions: Set<string>;
    sectionKey: string;
    onJump: (index: number) => void;
}) {
    return (
        <div className="w-72">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold">أسئلة القسم</h4>
                <span className="text-xs text-muted-foreground">{answeredQuestions.size} من {totalQuestions} مُجاب</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalQuestions }, (_, i) => {
                    const key = `${sectionKey}:${i}`;
                    const isAnswered = answeredQuestions.has(key);
                    const isFlagged = flaggedQuestions.has(key);
                    const isCurrent = i === currentIndex;

                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onJump(i)}
                            className={cn(
                                'relative h-9 w-9 rounded-lg text-sm font-medium transition-all',
                                isCurrent && 'ring-2 ring-primary ring-offset-2',
                                isAnswered && !isCurrent && 'bg-primary text-primary-foreground',
                                !isAnswered && !isCurrent && 'bg-muted text-muted-foreground hover:bg-muted/80',
                                isCurrent && isAnswered && 'bg-primary text-primary-foreground',
                                isCurrent && !isAnswered && 'bg-primary/20 text-primary',
                            )}
                            aria-label={`سؤال ${i + 1}${isAnswered ? '، مُجاب' : ''}${isFlagged ? '، مُعلَّم' : ''}${isCurrent ? '، الحالي' : ''}`}
                        >
                            {i + 1}
                            {isFlagged && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-warning">
                                    <Flag className="h-2 w-2 fill-warning-foreground text-warning-foreground" />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export function NavigationFooter({
    currentIndex,
    totalQuestions,
    answeredQuestions,
    flaggedQuestions,
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
    onToggleFlag,
    onJumpToQuestion,
    isSubmittingSection,
}: NavigationFooterProps) {
    const sectionKey = currentKey.split(':')[0];
    const isFlagged = flaggedQuestions.has(currentKey);
    const remaining = totalQuestions - currentIndex - 1;

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

    return (
        <footer className="sticky bottom-0 z-50 border-t bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-2">
                    {(!isSimulation || canGoBack) && (
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentIndex === 0 || !canGoBack}
                            onClick={onPrevious}
                            aria-label="السؤال السابق"
                        >
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                            السابق
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleFlag}
                        className={cn('gap-1.5', isFlagged && 'text-warning hover:text-warning/80')}
                        aria-label={isFlagged ? 'إزالة العلم من هذا السؤال' : 'تحديد هذا السؤال للمراجعة'}
                    >
                        <Flag className={cn('h-4 w-4', isFlagged && 'fill-warning')} />
                        <span className="hidden sm:inline">{isFlagged ? 'مُعلَّم' : 'علّم'}</span>
                    </Button>

                    {!isSimulation && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-1.5" aria-label="فتح لوحة المراجعة">
                                    <LayoutGrid className="h-4 w-4" />
                                    <span className="hidden sm:inline text-xs">{currentIndex + 1}/{totalQuestions}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="center" className="w-auto p-4">
                                <QuestionGrid
                                    totalQuestions={totalQuestions}
                                    currentIndex={currentIndex}
                                    answeredQuestions={answeredQuestions}
                                    flaggedQuestions={flaggedQuestions}
                                    sectionKey={sectionKey}
                                    onJump={onJumpToQuestion}
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                <div className="flex flex-1 items-center gap-1.5 overflow-x-auto px-4">
                    {Array.from({ length: totalQuestions }, (_, i) => {
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
