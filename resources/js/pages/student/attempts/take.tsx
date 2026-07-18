import { AnimatePresence, motion } from 'framer-motion';
import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ExamHeader } from '@/components/student/attempts/exam-header';
import { NavigationFooter } from '@/components/student/attempts/navigation-footer';
import { QuestionCard } from '@/components/student/attempts/question-card';
import { SectionProgress } from '@/components/student/attempts/section-progress';
import ExamWorkspaceLayout from '@/layouts/exam-workspace-layout';
import attempts from '@/routes/student/attempts';
import type { Attempt, AttemptSection } from '@/types/attempt';

interface TakeProps {
    attempt: Attempt;
}

function getCurrentKey(sectionId: number, questionIndex: number): string {
    return `${sectionId}:${questionIndex}`;
}

export default function Take({ attempt }: TakeProps) {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [sectionsData, setSectionsData] = useState<Map<number, AttemptSection>>(new Map());
    const [isLoadingSection, setIsLoadingSection] = useState(true);
    const [lockedQuestions, setLockedQuestions] = useState<Set<string>>(new Set());
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);
    const [isSubmittingSection, setIsSubmittingSection] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const isSimulation = attempt.type === 'exam';
    const sections = attempt.sections ?? [];
    const currentSection = sections[currentSectionIndex];
    const loadedSection = currentSection ? sectionsData.get(currentSection.id) : undefined;
    const questions = loadedSection?.questions ?? [];
    const currentQuestion = questions[currentQuestionIndex] ?? null;
    const totalQuestionsInSection = currentSection?.questions_count ?? questions.length;
    const currentSectionDuration = currentSection?.duration_minutes ?? 0;
    const isLastQuestionInSection = currentQuestionIndex >= totalQuestionsInSection - 1;
    const isLastSection = currentSectionIndex === sections.length - 1;
    const isLastQuestion = isLastSection && isLastQuestionInSection;
    const currentSectionSubmitted = currentSection?.submitted_at !== null;
    const isSectionSubmitted = currentSectionSubmitted;

    const submittedSectionIndices: number[] = [];
    for (const [idx, s] of sections.entries()) {
        if (s.submitted_at !== null) {
            submittedSectionIndices.push(idx);
        }
    }

    const answeredQuestions = new Set<string>();
    for (const [, section] of sectionsData) {
        for (const q of section.questions ?? []) {
            if (q.selected_option_id !== null) {
                answeredQuestions.add(getCurrentKey(section.id, q.order));
            }
        }
    }

    function loadSection(sectionIndex: number) {
        const section = sections[sectionIndex];
        if (!section) return;

        const cached = sectionsData.get(section.id);
        if (cached?.questions) {
            setIsLoadingSection(false);
            return;
        }

        setIsLoadingSection(true);

        fetch(attempts.sections.show({ attempt: attempt.id, section: section.id }).url)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to load section');
                return res.json();
            })
            .then((data: AttemptSection) => {
                setSectionsData((prev) => {
                    const next = new Map(prev);
                    next.set(data.id, data);
                    return next;
                });
                setIsLoadingSection(false);
            })
            .catch(() => {
                toast.error('فشل تحميل أسئلة القسم. حاول مرة أخرى.');
                setIsLoadingSection(false);
            });
    }

    useEffect(() => {
        loadSection(0);
    }, []);

    // Per-section timer
    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (currentSectionDuration > 0 && !currentSectionSubmitted) {
            setElapsedSeconds(0);

            timerRef.current = setInterval(() => {
                setElapsedSeconds((prev) => {
                    if (prev >= currentSectionDuration * 60 - 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        handleSubmitSection();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentSectionIndex, currentSectionDuration, currentSectionSubmitted]);

    // Keyboard shortcuts
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (isLoadingSection || !currentQuestion || isSectionSubmitted) return;

            if (e.key >= '1' && e.key <= '9') {
                const idx = parseInt(e.key) - 1;
                const option = currentQuestion.question.options?.[idx];
                if (option?.id) {
                    handleSelectOption(option.id);
                }
                return;
            }

            if (e.key === 'Enter' || e.key === 'ArrowLeft') {
                e.preventDefault();
                goToNext();
                return;
            }

            if (e.key === 'ArrowRight' && !isSimulation) {
                e.preventDefault();
                goToPrevious();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentQuestion, isLoadingSection, isSectionSubmitted, isSimulation]);

    function handleSelectOption(optionId: number) {
        if (!currentQuestion || currentQuestion.selected_option_id === optionId) return;

        const isLocked = isSimulation && lockedQuestions.has(
            getCurrentKey(currentSection.id, currentQuestion.order)
        );
        if (isLocked) return;

        const url = attempts.questions.update({
            attempt: attempt.id,
            attemptQuestion: currentQuestion.id,
        }).url;

        router.patch(url, { selected_option_id: optionId }, {
            preserveScroll: true,
            onError: () => {
                toast.error('فشل حفظ الإجابة');
            },
        });

        setSectionsData((prev) => {
            const next = new Map(prev);
            const section = next.get(currentSection.id);
            if (section) {
                section.questions = section.questions.map((q) =>
                    q.id === currentQuestion.id
                        ? { ...q, selected_option_id: optionId }
                        : q,
                );
                next.set(section.id, { ...section, questions: [...section.questions] });
            }
            return next;
        });
    }

    function canGoBackTo(targetSectionIdx: number, targetQuestionIdx: number): boolean {
        if (!isSimulation) return true;
        const section = sections[targetSectionIdx];
        if (!section) return false;
        if (section.submitted_at !== null) return false;
        const key = getCurrentKey(section.id, targetQuestionIdx);
        return !lockedQuestions.has(key);
    }

    const handleSubmitSection = useCallback(() => {
        if (isSubmittingSection || !currentSection) return;
        if (currentSectionSubmitted) return;

        setIsSubmittingSection(true);

        router.post(
            attempts.sections.submit({ attempt: attempt.id, section: currentSection.id }).url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmittingSection(false);
                    if (isLastSection) {
                        toast.success('تم إنهاء الاختبار بنجاح');
                    }
                },
                onError: () => {
                    setIsSubmittingSection(false);
                    toast.error('فشل تسليم القسم');
                },
            },
        );
    }, [currentSection, currentSectionSubmitted, isLastSection, isSubmittingSection]);

    function goToNext() {
        if (isSimulation && currentQuestion) {
            setLockedQuestions((prev) => {
                const next = new Set(prev);
                next.add(getCurrentKey(currentSection.id, currentQuestion.order));
                return next;
            });
        }

        if (currentQuestionIndex < totalQuestionsInSection - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            return;
        }

        if (!isLastSection) {
            if (isSimulation) {
                handleSubmitSection();
            }

            const nextSectionIdx = currentSectionIndex + 1;
            setCurrentQuestionIndex(0);
            setCurrentSectionIndex(nextSectionIdx);
            loadSection(nextSectionIdx);
        }
    }

    function goToPrevious() {
        if (currentQuestionIndex > 0) {
            const targetIdx = currentQuestionIndex - 1;
            if (canGoBackTo(currentSectionIndex, targetIdx)) {
                setCurrentQuestionIndex(targetIdx);
            }
            return;
        }

        if (currentSectionIndex > 0) {
            const prevSectionIdx = currentSectionIndex - 1;
            const prevSection = sections[prevSectionIdx];
            if (!prevSection) return;
            const lastQuestionIdx = (prevSection.questions_count ?? 1) - 1;
            if (canGoBackTo(prevSectionIdx, lastQuestionIdx)) {
                setCurrentSectionIndex(prevSectionIdx);
                setCurrentQuestionIndex(lastQuestionIdx);
                loadSection(prevSectionIdx);
            }
        }
    }

    function handleFinish() {
        if (isFinishing) return;
        if (!confirm('هل أنت متأكد من إنهاء الاختبار؟')) return;

        setIsFinishing(true);
        router.post(attempts.finish({ attempt: attempt.id }).url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsFinishing(false);
            },
            onError: () => {
                setIsFinishing(false);
                toast.error('فشل إنهاء الاختبار');
            },
        });
    }

    const canGoBack = canGoBackTo(currentSectionIndex, currentQuestionIndex - 1);

    return (
        <>
            <Head title={`${isSimulation ? 'محاكاة' : 'تدريب'} - ${attempt.subject_name}`} />

            <ExamHeader
                type={attempt.type}
                sectionName={currentSection?.topic?.name ?? `المحور ${currentSectionIndex + 1}`}
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
                    <div className="rounded-lg bg-warning/10 border border-warning/30 px-4 py-3 text-sm text-warning">
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
                            isLocked={isSimulation && currentQuestion !== null && lockedQuestions.has(
                                getCurrentKey(currentSection?.id ?? 0, currentQuestion?.order ?? 0)
                            )}
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
                currentKey={getCurrentKey(currentSection?.id ?? 0, currentQuestionIndex)}
                isLastQuestion={isLastQuestion}
                isLastQuestionInSection={isLastQuestionInSection}
                isSimulation={isSimulation}
                isSectionSubmitted={isSectionSubmitted}
                canGoBack={canGoBack}
                onPrevious={goToPrevious}
                onNext={goToNext}
                onFinish={handleFinish}
                onSubmitSection={handleSubmitSection}
                isSubmittingSection={isSubmittingSection}
            />
        </>
    );
}

Take.layout = (page: React.ReactNode) => <ExamWorkspaceLayout>{page}</ExamWorkspaceLayout>;
