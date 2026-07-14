import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
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

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const isSimulation = attempt.type === 'exam';
    const sections = attempt.sections ?? [];
    const currentSection = sections[currentSectionIndex];
    const loadedSection = currentSection ? sectionsData.get(currentSection.id) : undefined;
    const questions = loadedSection?.questions ?? [];
    const currentQuestion = questions[currentQuestionIndex] ?? null;
    const totalQuestionsInSection = currentSection?.questions_count ?? questions.length;
    const isLastQuestion =
        currentSectionIndex === sections.length - 1 &&
        currentQuestionIndex >= totalQuestionsInSection - 1;
    const totalDuration = sections.reduce((acc, s) => acc + (s.duration_minutes ?? 0), 0);

    const answeredQuestions = new Set<string>();
    for (const [, section] of sectionsData) {
        for (const q of section.questions ?? []) {
            if (q.selected_option_id !== null) {
                answeredQuestions.add(getCurrentKey(section.id, q.order));
            }
        }
    }

    const completedSectionIndices: number[] = [];
    for (const [sectionId, section] of sectionsData) {
        const allAnswered = (section.questions ?? []).every((q) => q.selected_option_id !== null);
        if (allAnswered) {
            const idx = sections.findIndex((s) => s.id === section.id);
            if (idx >= 0) completedSectionIndices.push(idx);
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

    useEffect(() => {
        if (totalDuration > 0) {
            timerRef.current = setInterval(() => {
                setElapsedSeconds((prev) => {
                    if (prev >= totalDuration * 60) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        handleFinish();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);

            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [totalDuration]);

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
        const key = getCurrentKey(section.id, targetQuestionIdx);
        return !lockedQuestions.has(key);
    }

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

        if (currentSectionIndex < sections.length - 1) {
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
                totalMinutes={totalDuration}
                elapsedSeconds={elapsedSeconds}
            />

            <SectionProgress
                sections={sections}
                currentIndex={currentSectionIndex}
                completedIndices={completedSectionIndices}
            />

            <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
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
            </main>

            <NavigationFooter
                currentIndex={currentQuestionIndex}
                totalQuestions={totalQuestionsInSection}
                answeredQuestions={answeredQuestions}
                currentKey={getCurrentKey(currentSection?.id ?? 0, currentQuestionIndex)}
                isLastQuestion={isLastQuestion}
                canGoBack={canGoBack}
                isSimulation={isSimulation}
                onPrevious={goToPrevious}
                onNext={goToNext}
                onFinish={handleFinish}
            />
        </>
    );
}

Take.layout = (page: React.ReactNode) => <ExamWorkspaceLayout>{page}</ExamWorkspaceLayout>;
