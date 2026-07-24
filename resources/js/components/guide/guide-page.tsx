import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { GuideFeedback } from '@/components/guide/guide-feedback';
import { GuideHero } from '@/components/guide/guide-hero';
import type { GuideHeroProps } from '@/components/guide/guide-hero';
import { GuideSection } from '@/components/guide/guide-section';
import { GuideTimeline } from '@/components/guide/guide-timeline';
import { SourceCard } from '@/components/guide/source-card';
import { Separator } from '@/components/ui/separator';

interface TimelineStep {
    id: string;
    title: string;
    description: string;
}

interface SidebarStep {
    id: string;
    label: string;
}

interface ProgressSection {
    id: string;
    title: string;
}

interface RelatedArticle {
    title: string;
    href: string;
    description: string;
    readTime?: string;
    updated?: string;
}

interface Source {
    icon: string;
    title: string;
    description: string;
    href?: string;
}

interface SectionConfig {
    id: string;
    title: string;
    icon?: LucideIcon;
    number: number;
    readTime?: string;
    content: ReactNode;
}

interface GuidePageProps {
    hero: GuideHeroProps;
    sidebarSteps: SidebarStep[];
    timeline: TimelineStep[];
    sections: SectionConfig[];
    relatedArticles: RelatedArticle[];
    sources: Source[];
    showFeedback?: boolean;
}

export function GuidePage({
    hero,
    sidebarSteps,
    timeline,
    sections,
    relatedArticles,
    sources,
    showFeedback = true,
}: GuidePageProps) {
    return (
        <div className="relative flex gap-8">
            {/* Sidebar — desktop */}
            <aside className="hidden w-60 shrink-0 lg:block print:hidden">
                <nav className="sticky top-24 space-y-1">
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {hero.title}
                    </h4>
                    {sidebarSteps.length > 0 && (
                        <p className="mb-2 text-[10px] text-muted-foreground">
                            {sidebarSteps.length} مرحلة
                        </p>
                    )}
                    {sidebarSteps.map((step) => (
                        <a
                            key={step.id}
                            href={`#${step.id}`}
                            data-sidebar-step={step.id}
                            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:font-medium data-[active=true]:text-primary"
                        >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold text-muted-foreground transition-all data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground">
                                {sidebarSteps.findIndex((s) => s.id === step.id) + 1}
                            </span>
                            <span className="truncate">{step.label}</span>
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-6">
                {/* Hero */}
                <GuideHero {...hero} className="print:border-none print:shadow-none" />

                {/* Timeline */}
                {timeline.length > 0 && (
                    <GuideTimeline steps={timeline} className="mb-4" />
                )}

                {/* Sections */}
                {sections.map((section) => (
                    <GuideSection
                        key={section.id}
                        id={section.id}
                        title={section.title}
                        icon={section.icon}
                        number={section.number}
                    >
                        {section.readTime && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="size-3" />
                                {section.readTime} قراءة
                            </div>
                        )}
                        {section.content}
                    </GuideSection>
                ))}

                <Separator className="my-8" />

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h2 className="mb-4 text-lg font-bold">اقرأ بعد ذلك</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedArticles.map((article) => (
                                <Link
                                    key={article.href}
                                    href={article.href}
                                    className="group rounded-xl border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
                                >
                                    <h3 className="mb-1 text-sm font-semibold transition-colors group-hover:text-primary">
                                        {article.title}
                                    </h3>
                                    <p className="mb-3 text-xs text-muted-foreground">
                                        {article.description}
                                    </p>
                                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                        {article.readTime && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="size-3" />
                                                {article.readTime}
                                            </span>
                                        )}
                                        {article.updated && (
                                            <span>تم التحديث {article.updated}</span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Sources */}
                {sources.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="mb-4 text-lg font-bold">المصادر الرسمية</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {sources.map((source) => (
                                <SourceCard key={source.title} {...source} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Feedback */}
                {showFeedback && <GuideFeedback />}
            </div>
        </div>
    );
}

export type { GuidePageProps, SectionConfig, TimelineStep, SidebarStep, ProgressSection, RelatedArticle, Source };