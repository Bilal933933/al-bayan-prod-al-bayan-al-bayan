import { cn } from '@/lib/utils';

interface NotifState {
    daily: boolean;
    comp: boolean;
    streak: boolean;
}

interface StepNotificationsProps {
    notifs: NotifState;
    onToggle: (key: keyof NotifState) => void;
    onPrev: () => void;
    onFinish: () => void;
    loading: boolean;
}

const notifItems = [
    {
        key: 'daily' as const,
        emoji: '📅',
        title: 'تحدي يومي',
        desc: 'سؤال جديد كل يوم للحفاظ على التسلسل',
    },
    {
        key: 'comp' as const,
        emoji: '🏆',
        title: 'المسابقات القادمة',
        desc: 'تذكير قبل ٢٤ ساعة من بدء المسابقة',
    },
    {
        key: 'streak' as const,
        emoji: '🔥',
        title: 'تذكير التسلسل',
        desc: 'تنبيه قبل فقدان أيامك المتتالية',
        defaultActive: true,
    },
];

export function StepNotifications({ notifs, onToggle, onPrev, onFinish, loading }: StepNotificationsProps) {
    return (
        <div className="flex flex-1 flex-col px-4 pb-10 pt-6">
            <div className="mb-2 text-center">
                <span className="text-4xl">🔔</span>
            </div>
            <h2 className="mb-1 text-center text-2xl font-black">البقاء على تواصل</h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
                فعّل الإشعارات لتصلك تحديات يومية وتذكيرات بالمسابقات القادمة.
            </p>

            <div className="mb-6 flex flex-col gap-3">
                {notifItems.map((item) => {
                    const active = notifs[item.key];

                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => onToggle(item.key)}
                            className={cn(
                                'flex items-center gap-4 rounded-xl border-2 p-4 text-right transition-all',
                                active
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border bg-card hover:border-primary',
                            )}
                        >
                            <span className="shrink-0 text-2xl">{item.emoji}</span>
                            <div className="flex-1">
                                <div className="text-sm font-bold">{item.title}</div>
                                <div className="text-xs text-muted-foreground">{item.desc}</div>
                            </div>
                            <div
                                className={cn(
                                    'relative h-7 w-12 shrink-0 rounded-full transition-all',
                                    active ? 'bg-primary' : 'bg-border',
                                )}
                            >
                                <div
                                    className={cn(
                                        'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all',
                                        active ? 'right-0.5' : 'left-0.5',
                                    )}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto flex gap-3">
                <button
                    type="button"
                    onClick={onPrev}
                    className="flex-1 rounded-xl bg-muted px-6 py-4 text-sm font-bold transition-all hover:bg-border"
                >
                    رجوع
                </button>
                <button
                    type="button"
                    onClick={onFinish}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-gradient-to-l from-primary to-primary-dark px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:brightness-90 disabled:opacity-50 disabled:shadow-none"
                >
                    {loading ? 'جاري الحفظ...' : 'إنهاء'}
                </button>
            </div>
        </div>
    );
}
