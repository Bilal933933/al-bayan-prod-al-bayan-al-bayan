import type {
    CalloutData,
    FaqItem,
    GuideDocument,
    ParsedSection,
    RelatedArticle,
    Source,
    TableData,
    TimelineStep,
} from '@/types/guide';

/* ─── Front matter parser (minimal YAML) ─── */

function parseFrontmatter(raw: string): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    for (const line of raw.split('\n')) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }

        const colonIdx = trimmed.indexOf(':');

        if (colonIdx === -1) {
            continue;
        }

        const key = trimmed.slice(0, colonIdx).trim();
        let value: unknown = trimmed.slice(colonIdx + 1).trim();

        if (value === '') {
            data[key] = [];
            continue;
        }

        if (value === 'true') {
            value = true;
        } else if (value === 'false') {
            value = false;
        } else if (/^\d+$/.test(value as string)) {
            value = Number(value);
        }

        data[key] = value;
    }

    return data;
}

function parseFrontmatterArray(raw: string, key: string): string[] {
    const result: string[] = [];
    const lines = raw.split('\n');
    let inKey = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed === `${key}:`) {
            inKey = true;
            continue;
        }

        if (inKey) {
            if (trimmed.startsWith('- ')) {
                result.push(trimmed.slice(2).trim());
            } else if (!trimmed.startsWith('-') && trimmed.includes(':')) {
                break;
            }
        }
    }

    return result;
}

/* ─── Blockquote / callout detection ─── */

function parseCallouts(lines: string[]): {
    callouts: CalloutData[];
    remaining: string[];
} {
    const callouts: CalloutData[] = [];
    const remaining: string[] = [];
    let i = 0;

    while (i < lines.length) {
        const trimmed = lines[i].trim();

        if (trimmed.startsWith('> ')) {
            const text = trimmed.slice(2).trim();
            const boldMatch = text.match(/^\*\*(.+?)\*\*[：:]\s*(.+)/);

            if (boldMatch) {
                const label = boldMatch[1];
                const message = boldMatch[2];
                const lines2: string[] = [message];
                i++;

                while (i < lines.length && lines[i].trim().startsWith('> ')) {
                    const sub = lines[i].trim().slice(2).trim();

                    if (sub.startsWith('**') && sub.includes('**:')) {
                        break;
                    }

                    if (sub.startsWith('>')) {
                        lines2[lines2.length - 1] += ' ' + sub.slice(1).trim();
                    } else {
                        lines2[lines2.length - 1] += ' ' + sub;
                    }

                    i++;
                }

                const msg = lines2.join(' ');

                if (/قانون/i.test(label) && /مادة/i.test(msg)) {
                    const articleMatch = msg.match(/مادة\s*\(?(\d+)\)?/);
                    callouts.push({
                        type: 'legal',
                        title: 'مرجع قانوني',
                        message: msg,
                        law: label,
                        article: articleMatch ? articleMatch[1] : '',
                    });
                } else if (/نصيحة/i.test(label)) {
                    callouts.push({ type: 'tip', title: label, message: msg });
                } else if (/تنبيه|تحذير/i.test(label)) {
                    callouts.push({
                        type: 'warning',
                        title: label,
                        message: msg,
                    });
                } else if (/معلومة/i.test(label)) {
                    callouts.push({ type: 'info', title: label, message: msg });
                } else {
                    callouts.push({ type: 'info', title: label, message: msg });
                }

                continue;
            }

            remaining.push(lines[i]);
        } else {
            remaining.push(lines[i]);
        }

        i++;
    }

    return { callouts, remaining };
}

/* ─── Table parser ─── */

function parseMdTable(lines: string[]): TableData | null {
    const headerLine = lines.find(
        (l) => l.trim().startsWith('|') && l.includes('---'),
    );
    const headerIdx = headerLine ? lines.indexOf(headerLine) : -1;

    if (headerIdx === -1 || headerIdx === 0) {
        return null;
    }

    const headerRow = lines[headerIdx - 1].trim();
    const headers = headerRow
        .split('|')
        .filter(Boolean)
        .map((h) => h.trim());

    const rows: string[][] = [];

    for (let i = headerIdx + 1; i < lines.length; i++) {
        const row = lines[i].trim();

        if (!row.startsWith('|')) {
            break;
        }

        const cells = row
            .split('|')
            .filter(Boolean)
            .map((c) => c.trim());

        if (cells.length > 0) {
            rows.push(cells);
        }
    }

    return rows.length > 0 ? { headers, rows } : null;
}

/* ─── Section splitter ─── */

interface RawSection {
    title: string;
    lines: string[];
}

function splitSections(body: string): RawSection[] {
    const sections: RawSection[] = [];
    const lines = body.split('\n');
    let current: RawSection | null = null;

    for (const line of lines) {
        const headingMatch = line.match(/^##\s+(.+)/);

        if (headingMatch) {
            if (current && current.lines.length > 0) {
                sections.push(current);
            }

            current = { title: headingMatch[1].trim(), lines: [] };
        } else if (current) {
            current.lines.push(line);
        }
    }

    if (current && current.lines.length > 0) {
        sections.push(current);
    }

    return sections;
}

/* ─── Section classifiers ─── */

function classifySection(title: string): {
    type: ParsedSection['type'];
    cleanTitle: string;
} {
    const lower = title.trim();

    if (/^hero$/i.test(lower)) {
        return { type: 'content', cleanTitle: title };
    }

    if (/^timeline$/i.test(lower)) {
        return { type: 'content', cleanTitle: title };
    }

    if (/^main content$/i.test(lower)) {
        return { type: 'content', cleanTitle: title };
    }

    if (/^checklist[：:]\s*(.+)/i.test(lower)) {
        const m = lower.match(/^checklist[：:]\s*(.+)/i);

        return { type: 'checklist', cleanTitle: m ? m[1] : title };
    }

    if (/^tips$/i.test(lower)) {
        return { type: 'tips', cleanTitle: 'نصائح سريعة' };
    }

    if (/^warnings$/i.test(lower)) {
        return { type: 'warnings', cleanTitle: 'تحذيرات مهمة' };
    }

    if (/^faq$/i.test(lower)) {
        return { type: 'faq', cleanTitle: 'أسئلة شائعة' };
    }

    if (/^faq[：:]\s*(.+)/i.test(lower)) {
        const m = lower.match(/^faq[：:]\s*(.+)/i);

        return { type: 'faq', cleanTitle: m ? m[1] : 'أسئلة شائعة' };
    }

    if (/^cta$/i.test(lower)) {
        return { type: 'cta', cleanTitle: 'جرّب الآن' };
    }

    if (/^(comparisontable|table)[：:]\s*(.+)/i.test(lower)) {
        const m = lower.match(/^(?:comparisontable|table)[：:]\s*(.+)/i);

        return { type: 'table', cleanTitle: m ? m[1] : 'جدول مقارنة' };
    }

    if (/^legalreference$/i.test(lower)) {
        return { type: 'legalreference', cleanTitle: 'مراجع قانونية' };
    }

    if (/^relatedarticles$/i.test(lower)) {
        return { type: 'content', cleanTitle: title };
    }

    if (/^officialsources$/i.test(lower)) {
        return { type: 'content', cleanTitle: title };
    }

    return { type: 'content', cleanTitle: title };
}

/* ─── Paragraph + list parser ─── */

function parseContentLines(lines: string[]): {
    paragraphs: string[];
    lists: { ordered: boolean; items: string[] }[];
    tables: TableData[];
} {
    const paragraphs: string[] = [];
    const lists: { ordered: boolean; items: string[] }[] = [];
    const tables: TableData[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        if (!line) {
            i++;
            continue;
        }

        // Table
        if (line.startsWith('|')) {
            const tableLines: string[] = [];

            while (i < lines.length && lines[i].trim().startsWith('|')) {
                tableLines.push(lines[i]);
                i++;
            }

            const table = parseMdTable(tableLines);

            if (table) {
                tables.push(table);
            }

            continue;
        }

        // Ordered list
        if (/^\d+[.)]\s/.test(line)) {
            const items: string[] = [];

            while (i < lines.length && /^\d+[.)]\s/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''));
                i++;
            }

            lists.push({ ordered: true, items });
            continue;
        }

        // Unordered list
        if (line.startsWith('- ')) {
            const items: string[] = [];

            while (i < lines.length && lines[i].trim().startsWith('- ')) {
                items.push(lines[i].trim().slice(2).trim());
                i++;
            }

            lists.push({ ordered: false, items });
            continue;
        }

        // Paragraph
        const paraLines: string[] = [line];
        i++;

        while (i < lines.length) {
            const next = lines[i].trim();

            if (
                !next ||
                next.startsWith('- ') ||
                /^\d+[.)]\s/.test(next) ||
                next.startsWith('|')
            ) {
                break;
            }

            paraLines.push(next);
            i++;
        }

        paragraphs.push(paraLines.join(' '));
    }

    return { paragraphs, lists, tables };
}

/* ─── Main parser ─── */

export function parseGuideDocument(markdown: string): GuideDocument {
    // Separate front matter
    const fmMatch = markdown.match(/^---\n([\s\S]*?)\n---\n/);
    const fmRaw = fmMatch ? fmMatch[1] : '';
    const body = fmMatch ? markdown.slice(fmMatch[0].length) : markdown;

    const frontmatter = {
        title: (parseFrontmatter(fmRaw).title as string) || '',
        slug: (parseFrontmatter(fmRaw).slug as string) || '',
        description: (parseFrontmatter(fmRaw).description as string) || '',
        category: (parseFrontmatter(fmRaw).category as string) || '',
        lastReviewed: (parseFrontmatter(fmRaw).lastReviewed as string) || '',
        version: (parseFrontmatter(fmRaw).version as number) || 1,
        officialSources: parseFrontmatterArray(fmRaw, 'officialSources'),
        related: parseFrontmatterArray(fmRaw, 'related'),
    };

    const rawSections = splitSections(body);

    const heroTitle = frontmatter.title;
    let heroDescription = frontmatter.description;
    const timelineSteps: TimelineStep[] = [];
    const sections: ParsedSection[] = [];
    const relatedArticles: RelatedArticle[] = [];
    const sources: Source[] = [];
    let sectionCounter = 0;

    for (const raw of rawSections) {
        const { type, cleanTitle } = classifySection(raw.title);
        const normalizedTitle = raw.title.trim().toLowerCase();
        const lines = raw.lines.filter(
            (l) => l.trim() !== '---' && l.trim() !== '',
        );

        // ─── Hero ───
        if (normalizedTitle === 'hero') {
            const heroLines = lines.filter(
                (l) => !l.trim().startsWith('#') && l.trim() !== '>',
            );
            const blockquotes = lines.filter((l) => l.trim().startsWith('> '));
            const descLines = [
                ...heroLines,
                ...blockquotes.map((l) => l.trim().slice(2).trim()),
            ];
            heroDescription = descLines
                .join(' ')
                .replace(/\*\*(.+?)\*\*/g, '$1');
            continue;
        }

        // ─── Timeline ───
        if (normalizedTitle === 'timeline') {
            const codeBlock = lines.find((l) => l.trim().startsWith('```'));

            if (codeBlock) {
                const codeIdx = lines.indexOf(codeBlock);
                const codeLines: string[] = [];

                for (let i = codeIdx + 1; i < lines.length; i++) {
                    const cl = lines[i].trim();

                    if (cl.startsWith('```')) {
                        break;
                    }

                    if (cl && !cl.startsWith('↓')) {
                        codeLines.push(cl);
                    }
                }

                let prevTitle = '';

                for (const cl of codeLines) {
                    const parts = cl.split('—');
                    const title = parts[0].trim();

                    if (title) {
                        if (prevTitle) {
                            timelineSteps.push({
                                id: `step-${timelineSteps.length + 1}`,
                                title: prevTitle,
                                description: '',
                            });
                        }

                        prevTitle = title;
                    }
                }

                if (prevTitle) {
                    timelineSteps.push({
                        id: `step-${timelineSteps.length + 1}`,
                        title: prevTitle,
                        description: '',
                    });
                }
            }

            continue;
        }

        // ─── Main Content ───
        if (normalizedTitle === 'main content') {
            const h3Blocks: { title: string; lines: string[] }[] = [];
            let currentH3: { title: string; lines: string[] } | null = null;

            for (const line of lines) {
                const h3Match = line.match(/^###\s+(.+)/);

                if (h3Match) {
                    if (currentH3 && currentH3.lines.length > 0) {
                        h3Blocks.push(currentH3);
                    }

                    currentH3 = { title: h3Match[1].trim(), lines: [] };
                } else if (currentH3) {
                    currentH3.lines.push(line);
                }
            }

            if (currentH3 && currentH3.lines.length > 0) {
                h3Blocks.push(currentH3);
            }

            for (const block of h3Blocks) {
                sectionCounter++;
                const titleClean = block.title.replace(/^\d+[.\s]*\s*/, '');
                const id = `step-${titleClean
                    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .toLowerCase()}`;
                const contentResult = parseContentLines(block.lines);
                const { callouts } = parseCallouts(block.lines);
                const section: ParsedSection = {
                    id,
                    title: titleClean,
                    type: 'content',
                    number: sectionCounter,
                };

                if (contentResult.paragraphs.length > 0) {
                    section.paragraphs = contentResult.paragraphs;
                }

                if (contentResult.lists.length > 0) {
                    section.lists = contentResult.lists;
                }

                if (contentResult.tables.length > 0) {
                    section.tables = contentResult.tables;
                }

                if (callouts.length > 0) {
                    section.callouts = callouts;
                }

                sections.push(section);
            }

            continue;
        }

        // ─── Checklist ───
        if (type === 'checklist') {
            sectionCounter++;
            const items = lines
                .filter((l) => l.trim().match(/^- \[.?\]\s/))
                .map((l) => ({ text: l.trim().replace(/^- \[.?\]\s*/, '') }));

            if (items.length > 0) {
                sections.push({
                    id: `step-checklist-${sectionCounter}`,
                    title: cleanTitle,
                    type: 'checklist',
                    number: sectionCounter,
                    checklistItems: items,
                });
            }

            continue;
        }

        // ─── Tips ───
        if (type === 'tips') {
            sectionCounter++;
            const items = lines
                .filter((l) => l.trim().startsWith('- '))
                .map((l) => l.trim().slice(2).trim())
                .filter(Boolean);

            if (items.length > 0) {
                sections.push({
                    id: `step-tips-${sectionCounter}`,
                    title: cleanTitle,
                    type: 'tips',
                    number: sectionCounter,
                    tipItems: items,
                });
            }

            continue;
        }

        // ─── Warnings ───
        if (type === 'warnings') {
            sectionCounter++;
            const items = lines
                .filter((l) => l.trim().startsWith('- '))
                .map((l) => l.trim().slice(2).trim())
                .filter(Boolean);

            if (items.length > 0) {
                sections.push({
                    id: `step-warnings-${sectionCounter}`,
                    title: cleanTitle,
                    type: 'warnings',
                    number: sectionCounter,
                    warningItems: items,
                });
            }

            continue;
        }

        // ─── FAQ ───
        if (type === 'faq') {
            sectionCounter++;
            const faqItems: FaqItem[] = [];
            let currentQ = '';
            let currentA = '';

            for (const line of lines) {
                const h3Match = line.match(/^###\s+(.+)/);

                if (h3Match) {
                    if (currentQ && currentA) {
                        faqItems.push({
                            question: currentQ,
                            answer: currentA.trim(),
                        });
                    }

                    currentQ = h3Match[1].trim();
                    currentA = '';
                } else if (currentQ) {
                    currentA += ' ' + line.trim();
                }
            }

            if (currentQ && currentA) {
                faqItems.push({ question: currentQ, answer: currentA.trim() });
            }

            if (faqItems.length > 0) {
                sections.push({
                    id: `step-faq-${sectionCounter}`,
                    title: cleanTitle,
                    type: 'faq',
                    number: sectionCounter,
                    faqItems,
                });
            }

            continue;
        }

        // ─── CTA ───
        if (type === 'cta') {
            sectionCounter++;
            const headingLine = lines.find((l) => l.trim().startsWith('**'));
            const descLines = lines.filter(
                (l) =>
                    !l.trim().startsWith('**') &&
                    !l.trim().startsWith('[') &&
                    l.trim(),
            );
            const buttonMatch = lines
                .map((l) => l.trim())
                .find((l) => l.startsWith('[') && l.includes(']('));
            let buttonText = 'ابدأ الآن';
            let buttonHref = '/student/topics';

            if (buttonMatch) {
                const m = buttonMatch.match(/^\[([^\]]+)\]\(([^)]+)\)/);

                if (m) {
                    buttonText = m[1];
                    buttonHref = m[2];
                }
            }

            sections.push({
                id: `step-cta-${sectionCounter}`,
                title: cleanTitle,
                type: 'cta',
                number: sectionCounter,
                cta: {
                    heading: headingLine
                        ? headingLine.trim().replace(/\*\*/g, '')
                        : 'استعد الآن',
                    description: descLines.join(' '),
                    buttonText,
                    buttonHref,
                },
            });
            continue;
        }

        // ─── Table ───
        if (type === 'table') {
            sectionCounter++;
            const table = parseMdTable(lines);

            if (table) {
                sections.push({
                    id: `step-table-${sectionCounter}`,
                    title: cleanTitle,
                    type: 'table',
                    number: sectionCounter,
                    tables: [table],
                });
            }

            continue;
        }

        // ─── LegalReference ───
        if (normalizedTitle === 'legalreference') {
            sectionCounter++;
            const legalItems = lines
                .filter((l) => l.trim().match(/^\*\*.+?\*\*[：:]/))
                .map((l) => {
                    const match = l.trim().match(/^\*\*(.+?)\*\*[：:]\s*(.+)/);

                    if (!match) {
                        return null;
                    }

                    const law = match[1];
                    const summary = match[2];
                    const articleMatch = summary.match(/مادة\s*\(?(\d+)\)?/);

                    return {
                        law,
                        article: articleMatch ? articleMatch[1] : '',
                        summary,
                    };
                })
                .filter(Boolean) as {
                law: string;
                article: string;
                summary: string;
            }[];

            if (legalItems.length > 0) {
                sections.push({
                    id: `step-legal-${sectionCounter}`,
                    title: 'مراجع قانونية',
                    type: 'legalreference',
                    number: sectionCounter,
                    legalItems,
                });
            }

            continue;
        }

        // ─── RelatedArticles ───
        if (normalizedTitle === 'relatedarticles') {
            for (const line of lines) {
                const match = line.trim().match(/^-\s*\[([^\]]+)\]\(([^)]+)\)/);

                if (match) {
                    relatedArticles.push({
                        title: match[1],
                        href: match[2],
                        description: '',
                    });
                }
            }

            continue;
        }

        // ─── OfficialSources ───
        if (normalizedTitle === 'officialsources') {
            const table = parseMdTable(lines);

            if (table) {
                for (const row of table.rows) {
                    sources.push({
                        icon: '🏛',
                        title: row[0] || '',
                        description: row[1] || '',
                        href: row[1]?.startsWith('http') ? row[1] : undefined,
                    });
                }
            }

            continue;
        }

        // ─── Fallback: unhandled content sections ───
        sectionCounter++;
        const cleanId = raw.title
            .replace(/\s+/g, '-')
            .replace(/[^\w\u0600-\u06FF\s-]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
        const parsed = parseContentLines(lines);
        const { callouts } = parseCallouts(lines);
        const fallbackSection: ParsedSection = {
            id: `step-${cleanId || `section-${sectionCounter}`}`,
            title: raw.title,
            type: 'content',
            number: sectionCounter,
        };

        if (parsed.paragraphs.length > 0) {
            fallbackSection.paragraphs = parsed.paragraphs;
        }

        if (parsed.lists.length > 0) {
            fallbackSection.lists = parsed.lists;
        }

        if (parsed.tables.length > 0) {
            fallbackSection.tables = parsed.tables;
        }

        if (callouts.length > 0) {
            fallbackSection.callouts = callouts;
        }

        sections.push(fallbackSection);
    }

    // Build timeline from sections if not provided
    const effectiveTimeline =
        timelineSteps.length > 0
            ? timelineSteps
            : sections.slice(0, 11).map((s) => ({
                  id: s.id,
                  title: s.title,
                  description: '',
              }));

    const hero = {
        title: heroTitle,
        description: heroDescription,
        stepsCount: sections.length,
        readTime: `${Math.max(1, Math.round(sections.reduce((acc, s) => acc + ((s.paragraphs?.length || 0) + (s.tipItems?.length || 0) + (s.warningItems?.length || 0) + (s.faqItems?.length || 0)), 0) / 3))} دقائق`,
        lastReviewed: frontmatter.lastReviewed,
        primaryCta: { label: 'ابدأ التدريب', href: '/student/topics' },
        secondaryCta: { label: 'رحلة المتقدم', href: '/guide/journey' },
    };

    return {
        frontmatter,
        hero,
        timeline: effectiveTimeline,
        sections,
        relatedArticles,
        sources,
    };
}
