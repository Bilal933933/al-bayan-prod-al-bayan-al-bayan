import { useEffect, useRef } from 'react';

interface SuccessScreenProps {
    selectedTopics: number;
    difficulty: string;
    notifStreak: boolean;
}

const diffNames: Record<string, string> = {
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
};

export function SuccessScreen({
    selectedTopics,
    difficulty,
    notifStreak,
}: SuccessScreenProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const container = ref.current;
        const colors = [
            '#059669',
            '#0d9488',
            '#f59e0b',
            '#ef4444',
            '#3b82f6',
            '#8b5cf6',
        ];

        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('div');
            piece.className = 'pointer-events-none fixed';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.top = '-10px';
            piece.style.width = `${Math.random() * 8 + 6}px`;
            piece.style.height = `${Math.random() * 8 + 6}px`;
            piece.style.background =
                colors[Math.floor(Math.random() * colors.length)];
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animation = `confetti-fall ${Math.random() * 2 + 3}s ease-out forwards`;
            piece.style.animationDelay = `${Math.random()}s`;
            container.appendChild(piece);
        }
    }, []);

    return (
        <div
            ref={ref}
            className="flex flex-1 flex-col items-center justify-center px-4 pt-6 pb-10"
        >
            <div className="relative mb-7 flex h-36 w-36 items-center justify-center">
                <div className="border-primary-light absolute inset-[-8px] animate-[pulse-ring_2s_ease-out_infinite] rounded-full border-[3px]" />
                <div className="from-primary-light flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br to-primary/5">
                    <span className="text-5xl">🎊</span>
                </div>
            </div>

            <h1 className="mb-3 text-center text-2xl font-black">
                أهلاً بك في البيان!
            </h1>
            <p className="mb-8 text-center text-sm text-muted-foreground">
                حسابك جاهز. استعد لرحلة مليئة بالمعرفة والتحديات!
            </p>

            <div className="mb-8 grid w-full grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <div className="text-xl font-extrabold text-primary">
                        {selectedTopics}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                        مواضيع مختارة
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <div className="text-xl font-extrabold text-primary">
                        {diffNames[difficulty] || 'متوسط'}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                        المستوى
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <div className="text-xl font-extrabold text-primary">
                        {notifStreak ? '🔥' : '—'}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                        التسلسل
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => (window.location.href = '/dashboard')}
                className="to-primary-dark flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
                ابدأ التعلم
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </button>
        </div>
    );
}
