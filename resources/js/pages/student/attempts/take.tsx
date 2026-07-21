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
import ExamWorkspaceLayout from '@/layouts/exam-workspace-layout';
import type { Attempt } from '@/types/attempt';

interface TakeProps {
    attempt: Attempt;
}

export default function Take({ attempt }: TakeProps) {
    const {
        currentSectionIndex,
        currentQuestionIndex,
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
    } = useAttemptEngine(attempt);

    const [showFinishDialog, setShowFinishDialog] = useState(false);

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
                <div className="mx-auto w-full max-w-3xl px-4 pt-2">
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
                currentKey={`${currentSection?.id}:${currentQuestionIndex}`}
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
                isSubmittingSection={isSubmittingSection}
            />

            <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>تأكيد إنهاء الاختبار</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من إنهاء الاختبار؟ سيتم تسليم جميع الإجابات ولن تتمكن من العودة.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowFinishDialog(false)}>
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
