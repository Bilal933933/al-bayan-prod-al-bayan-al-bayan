import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { GuideChecklist } from '@/components/guide/guide-checklist';
import { GuideLayout } from '@/components/guide/guide-layout';
import { GuidePage } from '@/components/guide/guide-page';
import { InfoBox } from '@/components/guide/info-box';
import { LegalReference } from '@/components/guide/legal-reference';
import type { GuideDocument, ParsedSection } from '@/types/guide';

/* ─── Inline markdown → React nodes ─── */

function inlineToReact(text: string): ReactNode {
    const parts: ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);

        if (boldMatch) {
            parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
            remaining = remaining.slice(boldMatch[0].length);
            continue;
        }

        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);

        if (linkMatch) {
            parts.push(
                <a
                    key={key++}
                    href={linkMatch[2]}
                    className="text-primary underline"
                >
                    {linkMatch[1]}
                </a>,
            );
            remaining = remaining.slice(linkMatch[0].length);
            continue;
        }

        const codeMatch = remaining.match(/^`([^`]+)`/);

        if (codeMatch) {
            parts.push(
                <code key={key++} className="rounded bg-muted px-1 text-sm">
                    {codeMatch[1]}
                </code>,
            );
            remaining = remaining.slice(codeMatch[0].length);
            continue;
        }

        parts.push(remaining[0]);
        remaining = remaining.slice(1);
    }

    return <>{parts}</>;
}

/* ─── Render a content section ─── */

function renderContentSection(section: ParsedSection): ReactNode {
    const elements: ReactNode[] = [];
    let key = 0;

    // Paragraphs
    for (const para of section.paragraphs || []) {
        elements.push(
            <p key={key++} className="text-sm leading-relaxed">
                {inlineToReact(para)}
            </p>,
        );
    }

    // Lists
    for (const list of section.lists || []) {
        const Tag = list.ordered ? 'ol' : 'ul';
        elements.push(
            <Tag
                key={key++}
                className={`list-inside space-y-1 text-sm ${list.ordered ? 'list-decimal' : 'list-disc'}`}
            >
                {list.items.map((item, i) => (
                    <li key={i}>{inlineToReact(item)}</li>
                ))}
            </Tag>,
        );
    }

    // Tables
    for (const table of section.tables || []) {
        elements.push(
            <div key={key++} className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    {table.headers.length > 0 && (
                        <thead>
                            <tr className="bg-muted/50">
                                {table.headers.map((h, i) => (
                                    <th
                                        key={i}
                                        className="p-3 text-right font-semibold text-foreground"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody className="divide-y">
                        {table.rows.map((row, ri) => (
                            <tr key={ri}>
                                {row.map((cell, ci) => (
                                    <td
                                        key={ci}
                                        className="p-3 text-muted-foreground"
                                    >
                                        {inlineToReact(cell)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>,
        );
    }

    // Callouts (blockquotes → InfoBox / LegalReference)
    for (const callout of section.callouts || []) {
        if (callout.type === 'legal') {
            elements.push(
                <LegalReference
                    key={key++}
                    law={callout.title}
                    article={callout.article || ''}
                    summary={callout.message}
                />,
            );
        } else if (callout.type === 'tip') {
            elements.push(
                <InfoBox
                    key={key++}
                    type="tip"
                    title={callout.title}
                    message={callout.message}
                />,
            );
        } else if (callout.type === 'warning') {
            elements.push(
                <InfoBox
                    key={key++}
                    type="warning"
                    title={callout.title}
                    message={callout.message}
                />,
            );
        } else if (callout.type === 'info') {
            elements.push(
                <InfoBox
                    key={key++}
                    type="info"
                    title={callout.title}
                    message={callout.message}
                />,
            );
        }
    }

    return <div className="space-y-3">{elements}</div>;
}

/* ─── Render any section by type ─── */

function renderSection(section: ParsedSection): ReactNode {
    switch (section.type) {
        case 'content':
            return renderContentSection(section);

        case 'checklist':
            return (
                <GuideChecklist
                    items={(section.checklistItems || []).map((item, i) => ({
                        id: `check-${i}`,
                        text: item.text,
                    }))}
                />
            );

        case 'tips':
            return (
                <div className="grid gap-3 md:grid-cols-2">
                    {(section.tipItems || []).map((item, i) => (
                        <InfoBox
                            key={i}
                            type="tip"
                            title="نصيحة"
                            message={item}
                        />
                    ))}
                </div>
            );

        case 'warnings':
            return (
                <div className="grid gap-3">
                    {(section.warningItems || []).map((item, i) => (
                        <InfoBox
                            key={i}
                            type="warning"
                            title="تنبيه"
                            message={item}
                        />
                    ))}
                </div>
            );

        case 'faq':
            return (
                <div className="grid gap-3">
                    {(section.faqItems || []).map((item, i) => (
                        <InfoBox
                            key={i}
                            type="info"
                            title={item.question}
                            message={item.answer}
                        />
                    ))}
                </div>
            );

        case 'cta':
            return (
                <div className="rounded-xl border bg-card p-6 text-center">
                    <h3 className="mb-2 text-lg font-bold">
                        {section.cta?.heading}
                    </h3>
                    {section.cta?.description && (
                        <p className="mb-4 text-sm text-muted-foreground">
                            {section.cta.description}
                        </p>
                    )}
                    <Link
                        href={section.cta?.buttonHref || '/student/topics'}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-primary to-primary/80 px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:from-primary/90 hover:to-primary/70"
                    >
                        {section.cta?.buttonText || 'ابدأ الآن'}
                    </Link>
                </div>
            );

        case 'table':
            return (
                <>
                    {(section.tables || []).map((table, ti) => (
                        <div
                            key={ti}
                            className="overflow-hidden rounded-lg border"
                        >
                            <table className="w-full text-sm">
                                {table.headers.length > 0 && (
                                    <thead>
                                        <tr className="bg-muted/50">
                                            {table.headers.map((h, i) => (
                                                <th
                                                    key={i}
                                                    className="p-3 text-right font-semibold text-foreground"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                )}
                                <tbody className="divide-y">
                                    {table.rows.map((row, ri) => (
                                        <tr key={ri}>
                                            {row.map((cell, ci) => (
                                                <td
                                                    key={ci}
                                                    className="p-3 text-muted-foreground"
                                                >
                                                    {inlineToReact(cell)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </>
            );

        case 'legalreference':
            return (
                <div className="space-y-3">
                    {(section.legalItems || []).map((item, i) => (
                        <LegalReference
                            key={i}
                            law={item.law}
                            article={item.article}
                            summary={item.summary}
                        />
                    ))}
                </div>
            );

        default:
            return null;
    }
}

/* ─── GuideRenderer ─── */

interface GuideRendererProps {
    document: GuideDocument;
}

export function GuideRenderer({ document }: GuideRendererProps) {
    const { frontmatter, hero, timeline, sections, relatedArticles, sources } =
        document;

    const sidebarSteps = sections.map((s) => ({ id: s.id, label: s.title }));
    const progressSections = sections
        .slice(0, 5)
        .map((s) => ({ id: s.id, title: s.title }));

    return (
        <GuideLayout
            title={hero.title}
            description={hero.description}
            progressSections={progressSections}
            lastReviewed={frontmatter.lastReviewed}
        >
            <GuidePage
                hero={{
                    title: hero.title,
                    description: hero.description,
                    stepsCount: hero.stepsCount || sections.length,
                    readTime: hero.readTime,
                    lastReviewed: hero.lastReviewed,
                    primaryCta: hero.primaryCta,
                    secondaryCta: hero.secondaryCta,
                }}
                sidebarSteps={sidebarSteps}
                timeline={timeline}
                sections={sections.map((section) => ({
                    id: section.id,
                    title: section.title,
                    icon: section.icon,
                    number: section.number,
                    readTime: `${Math.max(1, ((section.paragraphs?.length || 0) + (section.tipItems?.length || 0) + (section.warningItems?.length || 0)) * 2)} دقائق`,
                    content: renderSection(section),
                }))}
                relatedArticles={relatedArticles}
                sources={sources}
            />
        </GuideLayout>
    );
}
