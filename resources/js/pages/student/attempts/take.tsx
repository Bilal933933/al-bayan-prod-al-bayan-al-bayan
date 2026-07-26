import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { useState } from 'react';
import { ExamHeader } from '@/components/student/attempts/exam-header';
import { NavigationFooter } from '@/components/student/attempts/navigation-footer';
import { QuestionCard } from '@/components/student/attempts/question-card';
import { SectionProgress } from '@/components/student/attempts/section-progress';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAttemptEngine } from '@/hooks/use-attempt-engine';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import ExamWorkspaceLayout from '@/layouts/exam-workspace-layout';
import type { Attempt } from '@/types/attempt';

interface TakeProps {
    attempt: Attempt;
}

export default function Take({ attempt }: TakeProps) {
    const {
        currentSectionIndex,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        isLoadingSection,
        currentSection,
        currentQuestion,
        totalQuestionsInSection,
        currentSectionDuration,
        isSectionSubmitted,
        isSimulation,
        isLastQuestion,
        isSubmittingSection,
        submittedSectionIndices,
        answeredQuestions,
        elapsedSeconds,
        canGoBack,
        goToNext,
        goToPrevious,
        handleSelectOption,
        handleSubmitSection,
        handleFinish,
        sections,
        lockedQuestions,
        flaggedQuestions,
        toggleFlag,
    } = useAttemptEngine(attempt);

    const [showFinishDialog, setShowFinishDialog] = useState(false);

    const currentKey = `${currentSection?.id}:${currentQuestionIndex ?? 0}`;

    const jumpToQuestion = (index: number) => {
        if (!isSimulation && index >= 0 && index < totalQuestionsInSection) {
            setCurrentQuestionIndex(index);
        }
    };
    const optionsCount = currentQuestion?.question.options?.length ?? 0;

    useKeyboardShortcuts({
        onNext: goToNext,
        onPrevious: goToPrevious,
        onFlag: () => toggleFlag(currentKey),
        onSubmit: handleSubmitSection,
        onSelectOption: (index: number) => {
            const option = currentQuestion?.question.options?.[index];

            if (option?.id) {
                handleSelectOption(option.id);
            }
        },
        optionsCount,
        isEnabled: !showFinishDialog,
    });

    return (
        <>
            <Head
                title={`${isSimulation ? 'محاكاة' : 'تدريب'} - ${attempt.subject_name}`}
            />

            <ExamHeader
                type={attempt.type}
                sectionName={
                    currentSection?.topic?.name ??
                    `المحور ${currentSectionIndex + 1}`
                }
                sectionIndex={currentSectionIndex}
                totalSections={sections.length}
                totalMinutes={currentSectionDuration}
                elapsedSeconds={elapsedSeconds}
            />

            <SectionProgress
                sections={sections}
                currentIndex={currentSectionIndex}
                completedIndices={submittedSectionIndices}
            />

            {isSectionSubmitted && (
                <div
                    className="mx-auto w-full max-w-3xl px-4 pt-2"
                    role="alert"
                >
                    <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
                        تم تسليم هذا القسم. سيتم نقلك إلى القسم التالي قريباً.
                    </div>
                </div>
            )}

            <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion?.id ?? 'loading'}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        <QuestionCard
                            question={currentQuestion}
                            questionIndex={currentQuestionIndex}
                            totalQuestions={totalQuestionsInSection}
                            isLocked={
                                isSimulation &&
                                currentQuestion !== null &&
                                lockedQuestions.has(
                                    `${currentSection?.id}:${currentQuestion?.order}`,
                                )
                            }
                            isLoading={isLoadingSection}
                            onSelectOption={handleSelectOption}
                        />
                    </motion.div>
                </AnimatePresence>
            </main>

            <NavigationFooter
                currentIndex={currentQuestionIndex}
                totalQuestions={totalQuestionsInSection}
                answeredQuestions={answeredQuestions}
                flaggedQuestions={flaggedQuestions}
                currentKey={currentKey}
                isLastQuestion={isLastQuestion}
                isLastQuestionInSection={
                    currentQuestionIndex >= totalQuestionsInSection - 1
                }
                isSimulation={isSimulation}
                isSectionSubmitted={isSectionSubmitted}
                canGoBack={canGoBack}
                onPrevious={goToPrevious}
                onNext={goToNext}
                onFinish={() => setShowFinishDialog(true)}
                onSubmitSection={handleSubmitSection}
                onToggleFlag={() => toggleFlag(currentKey)}
                onJumpToQuestion={jumpToQuestion}
                isSubmittingSection={isSubmittingSection}
            />

            <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
                <DialogContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    aria-describedby="finish-desc"
                >
                    <DialogHeader>
                        <DialogTitle>تأكيد إنهاء الاختبار</DialogTitle>
                        <DialogDescription id="finish-desc">
                            هل أنت متأكد من إنهاء الاختبار؟ سيتم تسليم جميع
                            الإجابات ولن تتمكن من العودة.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            autoFocus
                            onClick={() => setShowFinishDialog(false)}
                        >
                            إلغاء
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setShowFinishDialog(false);
                                handleFinish();
                            }}
                        >
                            <Flag className="ml-1.5 h-4 w-4" />
                            إنهاء الاختبار
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Take.layout = (page: React.ReactNode) => (
    <ExamWorkspaceLayout>{page}</ExamWorkspaceLayout>
);
