interface StepWelcomeProps {
    onNext: () => void;
    onSkip: () => void;
}

export function StepWelcome({ onNext, onSkip }: StepWelcomeProps) {
    return (
        <div className="flex flex-1 flex-col justify-center px-4 pb-10 pt-6">
            <div className="relative mx-auto mb-7 flex h-48 w-48 items-center justify-center">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="absolute rounded-full border-2 border-primary-light opacity-60"
                        style={{
                            width: `${200 - i * 40}px`,
                            height: `${200 - i * 40}px`,
                            animation: `pulse-ring 3s ease-out infinite`,
                            animationDelay: `${i}s`,
                        }}
                    />
                ))}
                <span
                    className="relative z-10 animate-[float_3s_ease-in-out_infinite] text-7xl drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0 8px 20px rgba(5,150,105,0.2))' }}
                >
                    📖
                </span>
            </div>

            <h1 className="mb-3 text-center text-2xl font-black leading-tight">
                مرحباً بك في منصة البيان! 🎉
            </h1>
            <p className="mb-8 text-center text-sm leading-relaxed text-muted-foreground">
                منصتك الأولى لاختبار معرفتك في العلوم الإسلامية.<br />
                مسابقات تفاعلية، محاولات تدريبية، وتحديات يومية تنتظرك.
            </p>

            <div className="mb-6 rounded-xl bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                        <div className="text-sm font-bold">ابدأ رحلتك التعليمية</div>
                        <div className="text-xs text-muted-foreground">٤ خطوات بسيطة لإعداد حسابك</div>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={onNext}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary to-primary-dark px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            >
                هيا نبدأ
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            <div className="mt-4 text-center">
                <button
                    type="button"
                    onClick={onSkip}
                    className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                    تخطي الترحيب
                </button>
            </div>
        </div>
    );
}
