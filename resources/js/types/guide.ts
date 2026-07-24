import type { LucideIcon } from 'lucide-react';

export interface GuideFrontmatter {
    title: string;
    slug: string;
    description: string;
    category: string;
    lastReviewed: string;
    version: number;
    officialSources: string[];
    related: string[];
}

export interface TimelineStep {
    id: string;
    title: string;
    description: string;
}

export interface RelatedArticle {
    title: string;
    href: string;
    description: string;
    readTime?: string;
    updated?: string;
}

export interface Source {
    icon: string;
    title: string;
    description: string;
    href?: string;
}

export interface CtaData {
    heading: string;
    description: string;
    buttonText: string;
    buttonHref: string;
}

export interface TableData {
    headers: string[];
    rows: string[][];
}

export interface FaqItem {
    question: string;
    answer: string;
}

export type SectionType = 'content' | 'checklist' | 'tips' | 'warnings' | 'faq' | 'cta' | 'table' | 'legalreference';

export interface ParsedSection {
    id: string;
    title: string;
    type: SectionType;
    number: number;
    icon?: LucideIcon;
    /** Raw markdown paragraphs for 'content' type */
    paragraphs?: string[];
    /** Ordered/unordered lists for 'content' type */
    lists?: { ordered: boolean; items: string[] }[];
    /** Tables for 'content' type */
    tables?: TableData[];
    /** Special blockquotes detected in content (tip, warning, info, legal) */
    callouts?: CalloutData[];
    /** Checklist items */
    checklistItems?: { text: string }[];
    /** Tip/warning items */
    tipItems?: string[];
    warningItems?: string[];
    /** FAQ items */
    faqItems?: FaqItem[];
    /** CTA data */
    cta?: CtaData;
    /** Legal reference items (law name + article + summary pairs) */
    legalItems?: { law: string; article: string; summary: string }[];
}

export type CalloutType = 'tip' | 'warning' | 'info' | 'legal';

export interface CalloutData {
    type: CalloutType;
    title: string;
    message: string;
    law?: string;
    article?: string;
}

export interface GuideDocument {
    frontmatter: GuideFrontmatter;
    hero: {
        title: string;
        description: string;
        stepsCount?: number;
        readTime?: string;
        lastReviewed?: string;
        primaryCta?: { label: string; href: string };
        secondaryCta?: { label: string; href: string };
    };
    timeline: TimelineStep[];
    sections: ParsedSection[];
    relatedArticles: RelatedArticle[];
    sources: Source[];
}