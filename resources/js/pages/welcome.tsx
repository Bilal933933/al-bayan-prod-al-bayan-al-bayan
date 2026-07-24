import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, GraduationCap, Library, LineChart, Map, Monitor } from 'lucide-react';

import { Tilt, TiltContent } from '@/components/animate-ui/primitives/effects/tilt';
import { MorphingText } from '@/components/animate-ui/primitives/texts/morphing';
import { ShimmeringText } from '@/components/animate-ui/primitives/texts/shimmering';
import { login } from '@/routes';
import { register } from '@/routes';
import { dashboard } from '@/routes/student';

const features = [
    {
        icon: BookOpen,
        title: 'تدريب حر',
        description: 'اختر موضوعاً وابدأ التدريب بأسئلة عشوائية مع خيارات مرنة للوقت وعدد الأسئلة.',
    },
    {
        icon: GraduationCap,
        title: 'مسابقات',
        description: 'شارك في مسابقات محددة بعدة أقسام ومؤقت زمني، ونافس زملاءك على المراكز الأولى.',
    },
    {
        icon: LineChart,
        title: 'تتبع التقدم',
        description: 'راقب تطور مستواك من خلال إحصائيات دقيقة ولوحة متصدرين تحفزك على الاستمرار.',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="منصة البيان" />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-primary/5">
                <header className="flex items-center justify-end gap-4 p-6 md:px-12">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                        >
                            لوحة التحكم
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="rounded-xl border bg-card px-5 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent"
                            >
                                تسجيل الدخول
                            </Link>
                            <Link
                                href={register()}
                                className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                            >
                                إنشاء حساب
                            </Link>
                        </>
                    )}
                </header>

                <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
                    <div className="mx-auto max-w-3xl">
                        <div className="relative">
                            <div className="absolute -inset-20 rounded-full bg-primary/10 blur-3xl" />
                            <div className="absolute -inset-40 rounded-full bg-primary/[0.03] blur-3xl" />

                            <div className="relative space-y-6">
                                <h1 className="text-5xl font-black sm:text-6xl md:text-7xl leading-tight">
                                    <ShimmeringText
                                        text="منصة البيان"
                                        duration={30}
                                        color="oklch(0.4888 0.0819 173.48)"
                                        shimmeringColor="oklch(0.85 0.15 81.37)"
                                    />
                                </h1>

                                <MorphingText
                                    text={[
                                        'اختبر معلوماتك في أي وقت.',
                                        'تدرب وتنافس مع زملائك وتتبع تقدمك.',
                                    ]}
                                    loop
                                    holdDelay={3000}
                                    className="mx-auto block max-w-xl text-lg text-muted-foreground leading-relaxed"
                                />

                                <div className="flex items-center justify-center gap-4 pt-4">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                                        >
                                            ابدأ الآن
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={register()}
                                                className="rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                                            >
                                                ابدأ مجاناً
                                            </Link>
                                            <Link
                                                href={login()}
                                                className="rounded-xl border bg-card px-8 py-3 text-base font-semibold text-foreground shadow-sm transition-all hover:bg-accent"
                                            >
                                                لدي حساب
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 grid w-full max-w-5xl gap-6 sm:grid-cols-3">
                        {features.map((feature) => (
                            <Tilt key={feature.title} maxTilt={5} perspective={600}>
                                <TiltContent className="group relative overflow-hidden rounded-2xl border bg-card/50 p-6 text-right transition-all hover:shadow-lg">
                                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {feature.description}
                                </p>
                                </TiltContent>
                            </Tilt>
                        ))}
                    </div>

                    {/* Guide section */}
                    <div className="mt-20 w-full max-w-5xl">
                        <div className="mb-6 flex items-center gap-2">
                            <Library className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold">ابدأ رحلتك مع دليل البيان</h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <Link href="/guide/journey" className="group rounded-xl border bg-card p-5 text-right transition-all hover:border-primary/30 hover:shadow-sm">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Map className="h-5 w-5" />
                                </div>
                                <h3 className="mb-1 text-sm font-bold">رحلة المتقدم</h3>
                                <p className="text-xs text-muted-foreground">من الإعلان إلى التعيين — خطوة بخطوة</p>
                            </Link>
                            <Link href="/guide/exam-format" className="group rounded-xl border bg-card p-5 text-right transition-all hover:border-primary/30 hover:shadow-sm">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Monitor className="h-5 w-5" />
                                </div>
                                <h3 className="mb-1 text-sm font-bold">كيف يعمل الامتحان</h3>
                                <p className="text-xs text-muted-foreground">المحاور، التصحيح، النظام</p>
                            </Link>
                            <Link href="/guide/exam-day" className="group rounded-xl border bg-card p-5 text-right transition-all hover:border-primary/30 hover:shadow-sm">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <h3 className="mb-1 text-sm font-bold">دليل يوم الاختبار</h3>
                                <p className="text-xs text-muted-foreground">من البيت إلى اللجنة — خطوة بخطوة</p>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
