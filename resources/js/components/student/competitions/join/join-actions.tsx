import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import join from '@/routes/student/competitions/join';
import { Button } from '@/components/ui/button';

interface JoinActionsProps {
    competition: { slug: string };
    isJoined: boolean;
}

export default function JoinActions({ competition, isJoined }: JoinActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleJoin = () => {
        setLoading(true);
        router.post(join.store.url({ competition: competition.slug }), {}, {
            onFinish: () => setLoading(false),
        });
    };

    if (isJoined) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row">
                <p className="grow text-center text-sm font-bold text-emerald-800 sm:text-right">
                    🎉 أنت منضم بالفعل إلى هذه المسابقة، يمكنك الانتقال مباشرة لبدء الاختبارات!
                </p>
                <Link
                    href={`/student/competitions/${competition.slug}`}
                    className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 sm:w-auto"
                >
                    انتقل للاختبارات
                </Link>
            </div>
        );
    }

    return (
        <Button
            onClick={handleJoin}
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 py-6 text-base font-black text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800"
        >
            {loading ? 'جاري تسجيل انضمامك...' : 'تأكيد الانضمام للمسابقة وبدء التحدي'}
        </Button>
    );
}
