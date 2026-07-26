import { Head, router } from '@inertiajs/react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { ProgressBar } from '@/components/student/onboarding/progress-bar';
import { StepDifficulty } from '@/components/student/onboarding/step-difficulty';
import { StepNotifications } from '@/components/student/onboarding/step-notifications';
import { StepTopics } from '@/components/student/onboarding/step-topics';
import { StepWelcome } from '@/components/student/onboarding/step-welcome';
import { SuccessScreen } from '@/components/student/onboarding/success-screen';
import ExamWorkspaceLayout from '@/layouts/exam-workspace-layout';
import onboarding from '@/routes/student/onboarding';
import type { OnboardingTopic } from '@/types/onboarding';

interface OnboardingPageProps {
    topics: OnboardingTopic[];
}

export default function OnboardingPage({ topics }: OnboardingPageProps) {
    const [step, setStep] = useState(0);
    const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
    const [difficulty, setDifficulty] = useState<string | null>(null);
    const [notifs, setNotifs] = useState({
        daily: false,
        comp: false,
        streak: true,
    });
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleTopicToggle = useCallback((id: number) => {
        setSelectedTopics((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
        );
    }, []);

    const handleNotifToggle = useCallback(
        (key: 'daily' | 'comp' | 'streak') => {
            setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
        },
        [],
    );

    const handleFinish = useCallback(() => {
        if (!difficulty || selectedTopics.length === 0) {
            return;
        }

        setLoading(true);
        router.post(
            onboarding.store().url,
            {
                topic_ids: selectedTopics,
                difficulty,
                notifications: notifs,
            },
            {
                onSuccess: () => setCompleted(true),
                onError: () => setLoading(false),
            },
        );
    }, [selectedTopics, difficulty, notifs]);

    useEffect(() => {
        if (completed) {
            return;
        }

        const onPopState = () => {
            if (step > 0) {
                setStep(step - 1);
            }
        };
        window.addEventListener('popstate', onPopState);

        return () => window.removeEventListener('popstate', onPopState);
    }, [step, completed]);

    const content = useMemo(() => {
        if (completed) {
            return (
                <SuccessScreen
                    selectedTopics={selectedTopics.length}
                    difficulty={difficulty ?? 'intermediate'}
                    notifStreak={notifs.streak}
                />
            );
        }

        switch (step) {
            case 0:
                return (
                    <StepWelcome
                        onNext={() => setStep(1)}
                        onSkip={() => {
                            router.post(
                                onboarding.store().url,
                                {
                                    topic_ids: [topics[0]?.id].filter(Boolean),
                                    difficulty: 'intermediate',
                                    notifications: {
                                        daily: false,
                                        comp: false,
                                        streak: false,
                                    },
                                },
                                {
                                    onSuccess: () =>
                                        (window.location.href = '/dashboard'),
                                },
                            );
                        }}
                    />
                );
            case 1:
                return (
                    <StepTopics
                        topics={topics}
                        selectedIds={selectedTopics}
                        onToggle={handleTopicToggle}
                        onNext={() => setStep(2)}
                        onPrev={() => setStep(0)}
                    />
                );
            case 2:
                return (
                    <StepDifficulty
                        selected={difficulty}
                        onSelect={setDifficulty}
                        onNext={() => setStep(3)}
                        onPrev={() => setStep(1)}
                    />
                );
            case 3:
                return (
                    <StepNotifications
                        notifs={notifs}
                        onToggle={handleNotifToggle}
                        onPrev={() => setStep(2)}
                        onFinish={handleFinish}
                        loading={loading}
                    />
                );
            default:
                return null;
        }
    }, [
        step,
        completed,
        selectedTopics,
        difficulty,
        notifs,
        loading,
        topics,
        handleTopicToggle,
        handleNotifToggle,
        handleFinish,
    ]);

    return (
        <>
            <Head title="مرحباً بك" />

            <div
                className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-4"
                dir="rtl"
            >
                {!completed && (
                    <ProgressBar
                        currentStep={step}
                        totalSteps={4}
                        onStepClick={(n) => {
                            if (n < step) {
                                setStep(n);
                            }
                        }}
                    />
                )}

                {content}
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes pulse-ring {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(1.4); opacity: 0; }
                }
                @keyframes confetti-fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
        </>
    );
}

OnboardingPage.layout = (page: React.ReactNode) => (
    <ExamWorkspaceLayout>{page}</ExamWorkspaceLayout>
);
