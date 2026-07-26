import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check, Loader2, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
import {
    Tilt,
    TiltContent,
} from '@/components/animate-ui/primitives/effects/tilt';
import { GuideHero } from '@/components/guide/guide-hero';
import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';

interface QuestionOption {
    id: number;
    text: string;
    order: number;
}

interface Question {
    id: number;
    text: string;
    type: string;
    difficulty: string;
    options: QuestionOption[];
}

interface CheckDetail {
    question_id: number;
    selected_option_id: number;
    correct_option_id: number;
    is_correct: boolean;
}

interface CheckResult {
    total: number;
    correct: number;
    details: CheckDetail[];
}

interface PracticeProps {
    topic: { id: number; name: string } | null;
    questions: Question[];
    error: string | null;
}

const optionLetters = ['أ', 'ب', 'ج', 'د', 'ه', 'و'];

export default function GuestPractice({
    topic,
    questions,
    error,
}: PracticeProps) {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [result, setResult] = useState<CheckResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const hasAllAnswers = useMemo(
        () =>
            questions.length > 0 &&
            questions.every((q) => answers[q.id] !== undefined),
        [questions, answers],
    );

    const handleSelect = (questionId: number, optionId: number) => {
        if (submitted) return;
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    };

    const getOptionClass = (questionId: number, optionId: number) => {
        const base =
            'flex w-full items-center gap-4 rounded-xl border-2 p-4 text-right transition-all duration-200';
        const selected = answers[questionId] === optionId;

        if (!submitted) {
            return `${base} ${selected ? 'border-primary bg-primary/10 ring-2 ring-primary/20 text-primary shadow-sm' : 'border-border text-muted-foreground hover:border-muted-foreground/25 hover:bg-muted'} cursor-pointer`;
        }

        const detail = result?.details.find(
            (d) => d.question_id === questionId,
        );
        const isCorrectOption = detail?.correct_option_id === optionId;
        const isSelectedWrong = selected && detail && !detail.is_correct;

        if (isCorrectOption) {
            return `${base} border-success bg-success/10 text-success`;
        }

        if (isSelectedWrong) {
            return `${base} border-destructive bg-destructive/10 text-destructive`;
        }

        return `${base} border-border text-muted-foreground opacity-60`;
    };

    const getIcon = (questionId: number, optionId: number) => {
        if (!submitted) return null;

        const detail = result?.details.find(
            (d) => d.question_id === questionId,
        );
        const isCorrectOption = detail?.correct_option_id === optionId;
        const isSelected = answers[questionId] === optionId;
        const isSelectedWrong = isSelected && detail && !detail.is_correct;

        if (isCorrectOption) {
            return <Check className="h-5 w-5 text-success" />;
        }

        if (isSelectedWrong) {
            return <X className="h-5 w-5 text-destructive" />;
        }

        return null;
    };

    const handleSubmit = async () => {
        if (!topic || loading) return;

        setLoading(true);
        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') ?? '';
            const response = await fetch(`/practice/${topic.id}/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    answers: questions.map((q) => ({
                        question_id: q.id,
                        selected_option_id: answers[q.id],
                    })),
                }),
            });

            if (!response.ok) {
                alert('حدث خطأ أثناء التصحيح. حاول مرة أخرى.');
                return;
            }

            const data: CheckResult = await response.json();
            setResult(data);
            setSubmitted(true);
        } catch {
            alert('حدث خطأ في الاتصال. حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setResult(null);
        setSubmitted(false);
    };

    if (error) {
        return (
            <>
                <Head title="تجربة تدريبية" />
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
                    <h1 className="text-2xl font-bold">عذراً</h1>
                    <p className="text-muted-foreground">{error}</p>
                    <Button asChild>
                        <Link href="/">العودة للرئيسية</Link>
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={topic ? `تجربة: ${topic.name}` : 'تجربة تدريبية'} />

            <div className="mx-auto min-h-screen max-w-3xl px-4 py-8">
                <GuideHero
                    title={topic?.name ?? 'تجربة تدريبية'}
                    description={`اختبر ${questions.length} أسئلة عشوائية من هذا المحور دون الحاجة لتسجيل الدخول.`}
                    stepsCount={questions.length}
                    className="mb-8"
                />

                <div className="space-y-6">
                    {questions.map((question, qi) => (
                        <Tilt key={question.id} maxTilt={3} perspective={600}>
                            <TiltContent className="rounded-2xl bg-card p-6 shadow-sm">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        سؤال {qi + 1} من {questions.length}
                                    </span>
                                </div>
                                <p className="mb-4 text-base leading-relaxed sm:text-lg">
                                    {question.text}
                                </p>

                                <div className="space-y-3" role="radiogroup">
                                    {question.options.map((option, oi) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            disabled={submitted}
                                            onClick={() =>
                                                handleSelect(
                                                    question.id,
                                                    option.id,
                                                )
                                            }
                                            role="radio"
                                            aria-checked={
                                                answers[question.id] ===
                                                option.id
                                            }
                                            className={getOptionClass(
                                                question.id,
                                                option.id,
                                            )}
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-current bg-transparent text-sm font-bold">
                                                {getIcon(
                                                    question.id,
                                                    option.id,
                                                ) ??
                                                    optionLetters[oi] ??
                                                    String(oi + 1)}
                                            </span>
                                            <span className="text-base leading-relaxed font-medium">
                                                {option.text}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </TiltContent>
                        </Tilt>
                    ))}
                </div>

                {submitted && result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 rounded-2xl border bg-card p-8 text-center shadow-sm"
                    >
                        <p className="mb-2 text-sm text-muted-foreground">
                            نتيجتك
                        </p>
                        <p className="font-mono text-5xl font-black tracking-tight text-primary">
                            <SlidingNumber number={result.correct} inView />
                            <span className="mx-1 text-2xl text-muted-foreground">
                                /
                            </span>
                            <span className="text-2xl text-muted-foreground">
                                <SlidingNumber number={result.total} inView />
                            </span>
                        </p>

                        <div className="mt-6 flex items-center justify-center gap-3">
                            <Button variant="outline" onClick={handleRetry}>
                                أعد المحاولة
                            </Button>
                            <Button asChild>
                                <Link
                                    href={register()}
                                    className="inline-flex items-center gap-1.5"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    أنشئ حساباً لتتابع تقدمك
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                )}

                {!submitted && (
                    <div className="mt-8 flex items-center justify-center gap-3">
                        <Button
                            disabled={!hasAllAnswers || loading}
                            onClick={handleSubmit}
                            size="lg"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                'صحّح إجاباتي'
                            )}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={login()}>لدي حساب</Link>
                        </Button>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        </>
    );
}
