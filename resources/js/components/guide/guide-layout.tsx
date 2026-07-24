import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { AppHeader } from '@/components/app-header';
import { GuideProgress } from '@/components/guide/guide-progress';
import { login } from '@/routes';
import { register } from '@/routes';

interface ProgressSection {
    id: string;
    title: string;
}

interface GuideLayoutProps {
    title: string;
    description: string;
    progressSections: ProgressSection[];
    children: ReactNode;
    lastReviewed?: string;
}

function useScrollSpy(sectionIds: string[], offset = 120): string {
    const [activeId, setActiveId] = useState(sectionIds[0] || '');
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY + offset;
            let current = sectionIds[0] || '';

            for (const id of sectionIds) {
                const el = document.getElementById(id);

                if (el && el.offsetTop <= scrollY) {
current = id;
}
            }

            setActiveId(current);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [sectionIds, offset]);

    return activeId;
}

export function GuideLayout({ title, description, progressSections, children, lastReviewed }: GuideLayoutProps) {
    const { auth } = usePage().props;
    const { url: pathname } = usePage();
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => window.print();

    return (
        <>
            <Head title={`${title} — منصة البيان`}>
                <meta name="description" content={description} />
            </Head>

            <GuideProgress sections={progressSections} />

            <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-primary/5 print:bg-white">
                {/* Header — AppHeader for logged-in, mini header for guests */}
                {auth.user ? (
                    <AppHeader />
                ) : (
                    <header className="flex items-center justify-between gap-4 p-6 md:px-12 print:hidden">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-accent"
                            >
                                <Printer className="size-4" />
                                طباعة الدليل
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
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
                        </div>
                    </header>
                )}

                <main ref={printRef} className={`mx-auto w-full max-w-6xl px-4 pb-20 md:px-8 print:max-w-full print:px-0 ${auth.user ? 'pt-20' : 'pt-6'}`}>
                    {/* Breadcrumb */}
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground print:hidden"
                    >
                        <Link href="/" className="transition-colors hover:text-foreground">الرئيسية</Link>
                        <span className="text-xs">&gt;</span>
                        <Link href="/guide/journey" className="transition-colors hover:text-foreground">مركز المعرفة</Link>
                        <span className="text-xs">&gt;</span>
                        <span className="font-medium text-foreground">{title}</span>
                    </motion.nav>

                    {/* Identity badge */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="mb-4 flex items-center gap-2 print:hidden"
                    >
                        <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            📘 دليل البيان
                        </span>
                        {lastReviewed && (
                            <span className="text-xs text-muted-foreground">
                                آخر مراجعة {lastReviewed}
                            </span>
                        )}
                    </motion.div>

                    {/* Guide-to-guide navigation */}
                    <nav className="mb-6 flex flex-wrap gap-x-1 gap-y-0.5 print:hidden" dir="rtl">
                        {[
                            { href: '/guide/journey', label: 'رحلة المتقدم' },
                            { href: '/guide/exam-day', label: 'دليل يوم الاختبار' },
                            { href: '/guide/exam-format', label: 'كيف يعمل الامتحان' },
                            { href: '/guide/getting-started', label: 'كيف تبدأ الاستعداد' },
                            { href: '/guide/after-results', label: 'بعد إعلان النتيجة' },
                            { href: '/guide/faq', label: 'الأسئلة الشائعة' },
                            { href: '/guide/resources', label: 'المصادر الرسمية' },
                        ].map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {children}
                </main>
            </div>
        </>
    );
}

export { useScrollSpy };