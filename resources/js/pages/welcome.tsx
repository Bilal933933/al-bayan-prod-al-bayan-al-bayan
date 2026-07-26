import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    ChevronLeft,
    Clock,
    GraduationCap,
    History,
    LayoutGrid,
    Library,
    LineChart,
    type LucideIcon,
    Map,
    Medal,
    Monitor,
    Play,
    ShieldCheck,
    Trophy,
} from 'lucide-react';

import {
    Tilt,
    TiltContent,
} from '@/components/animate-ui/primitives/effects/tilt';
import { MorphingText } from '@/components/animate-ui/primitives/texts/morphing';
import { ShimmeringText } from '@/components/animate-ui/primitives/texts/shimmering';
import { AttemptCard } from '@/components/student/attempts/attempt-card';
import { EvaluationBadge } from '@/components/student/results/evaluation-badge';
import { ProgressChart } from '@/components/student/results/progress-chart';
import { ResultStatsCard } from '@/components/student/results/result-stats-card';
import { PopularTopics } from '@/components/welcome/popular-topics';
import { PodiumTeaser } from '@/components/welcome/podium-teaser';
import { PreviewBadge } from '@/components/welcome/preview-badge';
import { ScoreDistributionChart } from '@/components/welcome/score-distribution-chart';
import { StatsBand } from '@/components/welcome/stats-band';
import { login } from '@/routes';
import { register } from '@/routes';
import { dashboard, leaderboard } from '@/routes/student';
import { index as topicsIndex } from '@/routes/student/topics';
import { index as competitionsIndex } from '@/routes/student/competitions';
import { index as attemptsIndex } from '@/routes/student/attempts';
import { index as resultsIndex } from '@/routes/student/results';
import type { Evaluation, ProgressPoint } from '@/types/result';
import type { LeaderboardEntry } from '@/types/leaderboard';

interface WelcomeProps {
    stats: {
        topics_count: number;
        questions_count: number;
        competitions_count: number;
    };
    podium: LeaderboardEntry[];
    popularTopics: {
        id: number;
        name: string;
        description: string | null;
        attempts_count: number;
    }[];
    scoreDistribution: { range: string; label: string; count: number }[];
    isPreview: boolean;
}

const features = [
    {
        icon: BookOpen,
        title: 'تدريب حر',
        description:
            'اختر موضوعاً وابدأ التدريب بأسئلة عشوائية مع خيارات مرنة للوقت وعدد الأسئلة.',
        href: topicsIndex().url,
    },
    {
        icon: GraduationCap,
        title: 'مسابقات',
        description:
            'شارك في مسابقات محددة بعدة أقسام ومؤقت زمني، ونافس زملاءك على المراكز الأولى.',
        href: competitionsIndex().url,
    },
    {
        icon: LineChart,
        title: 'تتبع التقدم',
        description:
            'راقب تطور مستواك من خلال إحصائيات دقيقة ولوحة متصدرين تحفزك على الاستمرار.',
    },
];

const studentSections = [
    {
        icon: LayoutGrid,
        title: 'محاور التدريب',
        description: 'تصفح المحاور المتاحة وابدأ التدريب على كل محور على حدة.',
        href: topicsIndex().url,
    },
    {
        icon: Trophy,
        title: 'المسابقات',
        description: 'استعرض المسابقات المتاحة، اشترك ونافس زملاءك.',
        href: competitionsIndex().url,
    },
    {
        icon: History,
        title: 'محاولاتي',
        description: 'سجلّ كامل لمحاولاتك السابقة ونتائجها.',
        href: attemptsIndex().url,
    },
    {
        icon: BarChart3,
        title: 'نتائجي',
        description: 'تحليل أدائك وإحصائياتك التفصيلية.',
        href: resultsIndex().url,
    },
    {
        icon: Medal,
        title: 'المتصدرون',
        description: 'شاهد ترتيبك وتنافس مع الأفضل.',
        href: leaderboard().url,
    },
];

const now = new Date();
const daysAgo = (d: number) =>
    new Date(now.getTime() - d * 86400000).toISOString();

const mockAttempts: {
    id: number;
    type: 'practice' | 'exam';
    status: 'in_progress' | 'completed' | 'abandoned';
    subject_name: string;
    correct_answers: number;
    total_questions: number;
    started_at: string;
    sections?: {
        id: number;
        attempt_id: number;
        topic_id: number;
        questions_count: number;
        duration_minutes: number;
        order: number;
        submitted_at: string;
        started_at: string;
        questions: never[];
    }[];
}[] = [
    {
        id: 1,
        type: 'practice',
        status: 'completed',
        subject_name: 'التفسير',
        correct_answers: 7,
        total_questions: 10,
        started_at: daysAgo(3),
    },
    {
        id: 2,
        type: 'practice',
        status: 'in_progress',
        subject_name: 'النحو',
        correct_answers: 3,
        total_questions: 6,
        started_at: daysAgo(0),
    },
    {
        id: 3,
        type: 'exam',
        status: 'completed',
        subject_name: 'مسابقة البيان التأهيلية',
        correct_answers: 12,
        total_questions: 15,
        started_at: daysAgo(7),
        sections: [
            {
                id: 1,
                attempt_id: 3,
                topic_id: 1,
                questions_count: 5,
                duration_minutes: 10,
                order: 0,
                submitted_at: daysAgo(7),
                started_at: daysAgo(7),
                questions: [],
            },
            {
                id: 2,
                attempt_id: 3,
                topic_id: 2,
                questions_count: 5,
                duration_minutes: 10,
                order: 1,
                submitted_at: daysAgo(7),
                started_at: daysAgo(7),
                questions: [],
            },
            {
                id: 3,
                attempt_id: 3,
                topic_id: 3,
                questions_count: 5,
                duration_minutes: 10,
                order: 2,
                submitted_at: daysAgo(7),
                started_at: daysAgo(7),
                questions: [],
            },
        ],
    },
    {
        id: 4,
        type: 'practice',
        status: 'completed',
        subject_name: 'الفقه',
        correct_answers: 9,
        total_questions: 10,
        started_at: daysAgo(14),
    },
];

const mockEvaluation: Evaluation = {
    level: 'very_good',
    label: 'جيد جداً',
    color: 'blue',
};

const mockProgress: ProgressPoint[] = [
    { date: '2026-07-01', percentage: 40, type: 'practice' },
    { date: '2026-07-03', percentage: 42, type: 'practice' },
    { date: '2026-07-05', percentage: 50, type: 'practice' },
    { date: '2026-07-07', percentage: 55, type: 'practice' },
    { date: '2026-07-09', percentage: 52, type: 'exam' },
    { date: '2026-07-11', percentage: 60, type: 'practice' },
    { date: '2026-07-13', percentage: 65, type: 'practice' },
    { date: '2026-07-14', percentage: 68, type: 'practice' },
    { date: '2026-07-16', percentage: 72, type: 'exam' },
    { date: '2026-07-17', percentage: 70, type: 'practice' },
    { date: '2026-07-19', percentage: 74, type: 'practice' },
    { date: '2026-07-20', percentage: 78, type: 'practice' },
    { date: '2026-07-22', percentage: 80, type: 'practice' },
    { date: '2026-07-23', percentage: 76, type: 'exam' },
    { date: '2026-07-24', percentage: 82, type: 'practice' },
    { date: '2026-07-25', percentage: 75, type: 'exam' },
    { date: '2026-07-26', percentage: 84, type: 'practice' },
    { date: '2026-07-27', percentage: 83, type: 'exam' },
    { date: '2026-07-28', percentage: 85, type: 'exam' },
    { date: '2026-07-29', percentage: 88, type: 'practice' },
];

function GeometricMotif({ className = '' }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="bayan-motif"
                    width="64"
                    height="64"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M32 4 L38 22 L57 22 L42 33 L48 51 L32 40 L16 51 L22 33 L7 22 L26 22 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bayan-motif)" />
        </svg>
    );
}

function SectionDivider() {
    return (
        <div
            aria-hidden="true"
            className="my-4 flex items-center justify-center gap-4 text-primary/25"
        >
            <span className="h-px w-20 bg-current sm:w-32" />
            <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
            >
                <path d="M10 1 L12.7 7.6 L19 7.6 L13.9 11.7 L15.9 18 L10 14.2 L4.1 18 L6.1 11.7 L1 7.6 L7.3 7.6 Z" />
            </svg>
            <span className="h-px w-20 bg-current sm:w-32" />
        </div>
    );
}

function SectionHeading({
    icon: Icon,
    title,
    children,
}: {
    icon: LucideIcon;
    title: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-[18px] w-[18px]" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {children}
        </div>
    );
}

export default function Welcome({
    stats,
    podium,
    popularTopics,
    scoreDistribution,
    isPreview,
}: WelcomeProps) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="منصة البيان" />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-primary/5">
                <header className="sticky top-0 z-30 flex items-center justify-end gap-4 border-b border-transparent bg-background/70 p-6 backdrop-blur-md md:px-12">
                    {auth.user ? (
                        <Link
                            href={dashboard().url}
                            className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                        >
                            لوحة التحكم
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login().url}
                                className="rounded-xl border bg-card px-5 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent"
                            >
                                تسجيل الدخول
                            </Link>
                            <Link
                                href={register().url}
                                className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                            >
                                إنشاء حساب
                            </Link>
                        </>
                    )}
                </header>

                <main className="flex flex-1 flex-col items-center px-6 pb-24 text-center">
                    <div className="mx-auto max-w-3xl pt-16">
                        <div className="relative">
                            <div className="absolute -inset-24 -z-10 overflow-hidden rounded-[3rem]">
                                <GeometricMotif className="absolute inset-0 h-full w-full text-primary/[0.08]" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
                            </div>

                            <div className="relative space-y-7">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    منصة معتمدة لاختبارات العلوم الشرعية
                                    والعربية
                                </div>

                                <h1 className="text-6xl leading-[1.1] font-black sm:text-7xl md:text-8xl">
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
                                    className="mx-auto block max-w-xl text-lg leading-relaxed text-muted-foreground"
                                />

                                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard().url}
                                            className="rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                                        >
                                            ابدأ الآن
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={register().url}
                                                className="rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                                            >
                                                ابدأ مجاناً
                                            </Link>
                                            <Link
                                                href="/try-demo"
                                                className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/30 bg-primary/5 px-8 py-3 text-base font-semibold text-primary shadow-sm transition-all hover:border-primary/60 hover:bg-primary/10"
                                            >
                                                <Play className="h-4 w-4" />
                                                جرّب الاختبار
                                            </Link>
                                            <Link
                                                href={login().url}
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

                    {/* About + Knowledge Center cards */}
                    <div className="mt-20 grid w-full max-w-5xl gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border bg-card/50 p-7 text-right shadow-sm">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold">
                                منصة البيان
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                جهة رسمية معتمدة تقدم اختبارات تدريبية شاملة في
                                العلوم الشرعية والعربية. محتوى موثّق، تقييم
                                دقيق، وتجربة مجانية للجميع.
                            </p>
                        </div>
                        <Link
                            href="/guide/getting-started"
                            className="group rounded-2xl border bg-card/50 p-7 text-right shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                <Library className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold">
                                مركز المعرفة
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                دليل شامل — من رحلة المتقدم ونظام الامتحان إلى
                                الأسئلة الشائعة والمصادر.
                            </p>
                            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                                اقرأ المزيد
                                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            </span>
                        </Link>
                    </div>

                    {/* Real-time stats */}
                    <StatsBand
                        topicsCount={stats.topics_count}
                        questionsCount={stats.questions_count}
                        competitionsCount={stats.competitions_count}
                    />

                    {/* Features grid — the three pillars, given more presence than the nav-style cards below */}
                    <div className="mt-24 grid w-full max-w-5xl gap-6 sm:grid-cols-3">
                        {features.map((feature) => (
                            <Tilt
                                key={feature.title}
                                maxTilt={6}
                                perspective={600}
                            >
                                <TiltContent className="group relative h-full overflow-hidden rounded-2xl border border-t-2 border-t-primary/40 bg-card/50 p-7 text-right transition-all hover:shadow-lg">
                                    {'href' in feature ? (
                                        <Link
                                            href={feature.href!}
                                            className="block h-full"
                                        >
                                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <feature.icon className="h-7 w-7" />
                                            </div>
                                            <h3 className="mb-2 text-xl font-bold">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </Link>
                                    ) : (
                                        <>
                                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <feature.icon className="h-7 w-7" />
                                            </div>
                                            <h3 className="mb-2 text-xl font-bold">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </>
                                    )}
                                </TiltContent>
                            </Tilt>
                        ))}
                    </div>

                    {/* Student sections — each card links to its corresponding page */}
                    <div className="mt-24 w-full max-w-5xl">
                        <SectionHeading
                            icon={LayoutGrid}
                            title="تصفّح المنصة"
                        />
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {studentSections.map((section) => (
                                <Link
                                    key={section.title}
                                    href={auth.user ? section.href : register()}
                                    className="group rounded-xl border bg-card/50 p-5 text-right transition-all hover:border-primary/30 hover:shadow-sm"
                                >
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <section.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mb-1 text-sm font-bold">
                                        {section.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        {section.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <SectionDivider />

                    {/* Recent attempts preview — always mock */}
                    <div className="mt-4 w-full max-w-5xl">
                        <SectionHeading icon={Clock} title="محاولاتي">
                            <PreviewBadge />
                        </SectionHeading>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {mockAttempts.map((attempt) => (
                                <AttemptCard
                                    key={attempt.id}
                                    attempt={attempt}
                                    href={
                                        auth.user
                                            ? attemptsIndex().url
                                            : register().url
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    {/* Results preview — always mock */}
                    <div className="mt-24 w-full max-w-5xl">
                        <SectionHeading icon={BarChart3} title="نتائجي">
                            <PreviewBadge />
                            <EvaluationBadge evaluation={mockEvaluation} />
                        </SectionHeading>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <ResultStatsCard
                                icon={History}
                                label="إجمالي المحاولات"
                                value={12}
                                sub="آخر 30 يوماً"
                            />
                            <ResultStatsCard
                                icon={BarChart3}
                                label="متوسط النسبة"
                                value={72}
                                sub="من 100%"
                            />
                            <ResultStatsCard
                                icon={Clock}
                                label="الوقت الإجمالي"
                                value="3 ساعات"
                            />
                        </div>
                        <div className="mt-4 rounded-xl border bg-card p-4">
                            <ProgressChart data={mockProgress} />
                        </div>
                    </div>

                    {/* Podium preview */}
                    <PodiumTeaser podium={podium} isPreview={isPreview} />

                    {/* Popular topics */}
                    <PopularTopics
                        topics={popularTopics}
                        isPreview={isPreview}
                    />

                    {/* Score distribution */}
                    <ScoreDistributionChart
                        data={scoreDistribution}
                        isPreview={isPreview}
                    />

                    <SectionDivider />

                    {/* Guide section */}
                    <div className="mt-4 w-full max-w-5xl">
                        <SectionHeading
                            icon={Library}
                            title="ابدأ رحلتك مع دليل البيان"
                        />
                        <div className="grid gap-4 sm:grid-cols-3">
                            <Link
                                href="/guide/journey"
                                className="group rounded-xl border bg-card p-5 text-right transition-all hover:border-primary/30 hover:shadow-sm"
                            >
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Map className="h-5 w-5" />
                                </div>
                                <h3 className="mb-1 text-sm font-bold">
                                    رحلة المتقدم
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    من الإعلان إلى التعيين — خطوة بخطوة
                                </p>
                            </Link>
                            <Link
                                href="/guide/exam-format"
                                className="group rounded-xl border bg-card p-5 text-right transition-all hover:border-primary/30 hover:shadow-sm"
                            >
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Monitor className="h-5 w-5" />
                                </div>
                                <h3 className="mb-1 text-sm font-bold">
                                    كيف يعمل الامتحان
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    المحاور، التصحيح، النظام
                                </p>
                            </Link>
                            <Link
                                href="/guide/exam-day"
                                className="group rounded-xl border bg-card p-5 text-right transition-all hover:border-primary/30 hover:shadow-sm"
                            >
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <h3 className="mb-1 text-sm font-bold">
                                    دليل يوم الاختبار
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    من البيت إلى اللجنة — خطوة بخطوة
                                </p>
                            </Link>
                        </div>
                    </div>

                    {/* Trust bar */}
                    <div className="mt-16 w-full max-w-5xl">
                        <div className="rounded-xl border bg-card/30 p-4">
                            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                                    معلومات رسمية موثقة
                                </span>
                                <Link
                                    href="/guide/getting-started"
                                    className="underline underline-offset-4 hover:text-foreground"
                                >
                                    مركز المعرفة
                                </Link>
                                <Link
                                    href="/guide/faq"
                                    className="underline underline-offset-4 hover:text-foreground"
                                >
                                    الأسئلة الشائعة
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
