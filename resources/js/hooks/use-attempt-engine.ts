import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
    removeFromStorage,
    useLocalStorage,
} from '@/hooks/use-attempt-storage';
import attempts from '@/routes/student/attempts';
import type { Attempt, AttemptSection } from '@/types/attempt';

const ls = (id: number, name: string) => `attempt-${id}-${name}`;

function getCurrentKey(sectionId: number, questionIndex: number): string {
    return `${sectionId}:${questionIndex}`;
}

export function useAttemptEngine(attempt: Attempt) {
    const { id } = attempt;

    const [currentSectionIndex, setCurrentSectionIndex] = useLocalStorage(
        ls(id, 'section'),
        0,
    );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useLocalStorage(
        ls(id, 'question'),
        0,
    );
    const [lockedArray, setLockedArray] = useLocalStorage<string[]>(
        ls(id, 'locked'),
        [],
    );
    const [sectionsData, setSectionsData] = useState<
        Map<number, AttemptSection>
    >(new Map());
    const [isLoadingSection, setIsLoadingSection] = useState(true);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);
    const [isSubmittingSection, setIsSubmittingSection] = useState(false);

    const lockedQuestions = new Set(lockedArray);
    const setLockedQuestions = (
        fn: Set<string> | ((prev: Set<string>) => Set<string>),
    ) => {
        const next = fn instanceof Set ? fn : fn(lockedQuestions);
        setLockedArray([...next]);
    };

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const isSimulation = attempt.type === 'exam';
    const sections = attempt.sections ?? [];
    const currentSection = sections[currentSectionIndex];
    const loadedSection = currentSection
        ? sectionsData.get(currentSection.id)
        : undefined;
    const questions = loadedSection?.questions ?? [];
    const currentQuestion = questions[currentQuestionIndex] ?? null;
    const totalQuestionsInSection =
        currentSection?.questions_count ?? questions.length;
    const currentSectionDuration = currentSection?.duration_minutes ?? 0;
    const isLastQuestionInSection =
        currentQuestionIndex >= totalQuestionsInSection - 1;
    const isLastSection = currentSectionIndex === sections.length - 1;
    const isLastQuestion = isLastSection && isLastQuestionInSection;
    const currentSectionSubmitted = currentSection?.submitted_at !== null;
    const isSectionSubmitted = currentSectionSubmitted;

    const submittedSectionIndices = sections
        .map((s, idx) => (s.submitted_at !== null ? idx : -1))
        .filter((idx) => idx !== -1);

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

        fetch(
            attempts.sections.show({ attempt: attempt.id, section: section.id })
                .url,
        )
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
        loadSection(currentSectionIndex);
    }, [currentSectionIndex]);

    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (currentSectionDuration > 0 && !currentSectionSubmitted) {
            if (currentSection?.started_at) {
                setElapsedSeconds(
                    Math.floor(
                        (Date.now() -
                            new Date(currentSection.started_at).getTime()) /
                            1000,
                    ),
                );
            }

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
    }, [
        currentSectionIndex,
        currentSectionDuration,
        currentSectionSubmitted,
        currentSection?.started_at,
    ]);

    function handleSelectOption(optionId: number) {
        if (!currentQuestion || currentQuestion.selected_option_id === optionId)
            return;

        const isLocked =
            isSimulation &&
            lockedQuestions.has(
                getCurrentKey(currentSection.id, currentQuestion.order),
            );
        if (isLocked) return;

        const url = attempts.questions.update({
            attempt: attempt.id,
            attemptQuestion: currentQuestion.id,
        }).url;

        router.patch(
            url,
            { selected_option_id: optionId },
            {
                preserveScroll: true,
                onError: () => toast.error('فشل حفظ الإجابة'),
            },
        );

        setSectionsData((prev) => {
            const next = new Map(prev);
            const section = next.get(currentSection.id);
            if (section) {
                section.questions = section.questions.map((q) =>
                    q.id === currentQuestion.id
                        ? { ...q, selected_option_id: optionId }
                        : q,
                );
                next.set(section.id, {
                    ...section,
                    questions: [...section.questions],
                });
            }
            return next;
        });
    }

    function canGoBackTo(
        targetSectionIdx: number,
        targetQuestionIdx: number,
    ): boolean {
        if (!isSimulation) return true;
        const section = sections[targetSectionIdx];
        if (!section) return false;
        if (section.submitted_at !== null) return false;
        return !lockedQuestions.has(
            getCurrentKey(section.id, targetQuestionIdx),
        );
    }

    const handleSubmitSection = useCallback(() => {
        if (isSubmittingSection || !currentSection || currentSectionSubmitted)
            return;

        setIsSubmittingSection(true);

        router.post(
            attempts.sections.submit({
                attempt: attempt.id,
                section: currentSection.id,
            }).url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmittingSection(false);
                    if (isLastSection) {
                        removeFromStorage(ls(id, 'section'));
                        removeFromStorage(ls(id, 'question'));
                        removeFromStorage(ls(id, 'locked'));
                        toast.success('تم إنهاء الاختبار بنجاح');
                    }
                },
                onError: () => {
                    setIsSubmittingSection(false);
                    toast.error('فشل تسليم القسم');
                },
            },
        );
    }, [
        attempt.id,
        currentSection,
        currentSectionSubmitted,
        isLastSection,
        isSubmittingSection,
        id,
    ]);

    function goToNext() {
        if (isSimulation && currentQuestion) {
            setLockedQuestions((prev) => {
                const next = new Set(prev);
                next.add(
                    getCurrentKey(currentSection.id, currentQuestion.order),
                );
                return next;
            });
        }

        if (currentQuestionIndex < totalQuestionsInSection - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            return;
        }

        if (!isLastSection) {
            if (isSimulation) handleSubmitSection();
            setCurrentQuestionIndex(0);
            setCurrentSectionIndex((prev) => prev + 1);
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
                setCurrentQuestionIndex(lastQuestionIdx);
                setCurrentSectionIndex(prevSectionIdx);
            }
        }
    }

    function handleFinish() {
        if (isFinishing) return;

        setIsFinishing(true);

        router.post(
            attempts.finish({ attempt: attempt.id }).url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    removeFromStorage(ls(id, 'section'));
                    removeFromStorage(ls(id, 'question'));
                    removeFromStorage(ls(id, 'locked'));
                    setIsFinishing(false);
                },
                onError: () => {
                    setIsFinishing(false);
                    toast.error('فشل إنهاء الاختبار');
                },
            },
        );
    }

    const canGoBack = canGoBackTo(
        currentSectionIndex,
        currentQuestionIndex - 1,
    );

    return {
        currentSectionIndex,
        setCurrentSectionIndex,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        isLoadingSection,
        currentSection,
        loadedSection,
        currentQuestion,
        totalQuestionsInSection,
        currentSectionDuration,
        isSectionSubmitted,
        isSimulation,
        isLastSection,
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
    };
}
