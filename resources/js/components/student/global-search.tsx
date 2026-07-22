import { router } from '@inertiajs/react';
import {
    BookOpen,
    History,
    LoaderCircle,
    Search,
    SearchX,
    Trophy,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const RECENT_SEARCHES_KEY = 'al-bayan:recent-searches';
const MAX_RECENT = 10;

function highlightText(text: string, query: string): React.ReactNode {
    if (!query) {
return text;
}

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

    return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
            ? <mark key={i} className="rounded px-0.5 bg-accent/60">{part}</mark>
            : part,
    );
}

function loadRecentSearches(): string[] {
    try {
        const raw = localStorage.getItem(RECENT_SEARCHES_KEY);

        return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
        return [];
    }
}

function saveRecentSearches(searches: string[]): void {
    try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch {
        // localStorage may be full or unavailable
    }
}

interface SearchResult {
    id: number;
    code: string;
    name: string;
    slug?: string;
}

interface SearchResponse {
    topics: SearchResult[];
    competitions: SearchResult[];
}

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function GlobalSearch({ open, onOpenChange }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearches);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
    const prevOpenRef = useRef(open);
    const prevQueryLengthRef = useRef(0);

    const allResults: { type: 'topic' | 'competition'; item: SearchResult }[] = [];

    if (results) {
        for (const item of results.topics) {
            allResults.push({ type: 'topic', item });
        }

        for (const item of results.competitions) {
            allResults.push({ type: 'competition', item });
        }
    }

    useEffect(() => {
        if (open && !prevOpenRef.current) {
            setQuery('');
            setResults(null);
            setSelectedIndex(-1);
            setTimeout(() => inputRef.current?.focus(), 100);
        }

        prevOpenRef.current = open;
    }, [open]);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        const shouldClearResults = prevQueryLengthRef.current >= 2 && query.length < 2;

        if (query.length < 2) {
            if (shouldClearResults) {
                setResults(null);
                setIsLoading(false);
            }

            prevQueryLengthRef.current = query.length;

            return;
        }

        const startSearch = () => {
            setIsLoading(true);

            debounceRef.current = setTimeout(() => {
                fetch(`/search?q=${encodeURIComponent(query)}`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                    },
                })
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error('Search failed');
                        }

                        return res.json() as Promise<SearchResponse>;
                    })
                    .then((data) => {
                        setResults(data);
                        setSelectedIndex(-1);
                    })
                    .catch(() => {
                        setResults({ topics: [], competitions: [] });
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }, 300);
        };

        startSearch();

        prevQueryLengthRef.current = query.length;

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query]);

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev < allResults.length - 1 ? prev + 1 : 0,
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev > 0 ? prev - 1 : allResults.length - 1,
            );
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            navigateTo(allResults[selectedIndex]);
        }
    }

    function navigateTo(result: { type: 'topic' | 'competition'; item: SearchResult }) {
        onOpenChange(false);

        const trimmed = query.trim();

        if (trimmed.length >= 2) {
            setRecentSearches((prev) => {
                const next = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, MAX_RECENT);
                saveRecentSearches(next);

                return next;
            });
        }

        if (result.type === 'topic') {
            router.visit(`/topics/${result.item.id}`);
        } else {
            router.visit(`/competitions/${result.item.slug}`);
        }
    }

    const hasNoResults = results && !isLoading && allResults.length === 0 && query.length >= 2;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent hideCloseButton className="max-sm:top-8 top-[12vh] max-sm:mx-2 sm:max-w-xl shadow-2xl [--tw-translate-y:0] data-[state=open]:slide-in-from-top-3 data-[state=closed]:slide-out-to-top-3 max-sm:p-4">
                <DialogHeader className="sr-only">
                    <DialogTitle>البحث</DialogTitle>
                </DialogHeader>

                <div className="relative">
                    {isLoading ? (
                        <LoaderCircle className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
                    ) : (
                        <Search className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    )}
                    <Input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="ابحث عن محور أو مسابقة..."
                        className="h-12 ps-10 pe-20 text-base"
                    />
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[11px] leading-none text-muted-foreground transition-colors hover:bg-border"
                    >
                        ESC
                    </button>
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto max-sm:max-h-[50vh]" style={{ maxHeight: 'min(60vh, 400px)' }}>
                    {hasNoResults && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <SearchX className="h-12 w-12 text-muted-foreground/60" />
                            <p className="mt-4 text-sm text-muted-foreground">
                                لا توجد نتائج للبحث &quot;{query}&quot;
                            </p>
                        </div>
                    )}

                    {results && !isLoading && results.topics.length > 0 && (
                        <section>
                            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                المحاور
                            </h3>
                            <div className="flex flex-col gap-1">
                                {results.topics.map((topic) => {
                                    const idx = allResults.findIndex(
                                        (r) => r.type === 'topic' && r.item.id === topic.id,
                                    );

                                    return (
                                        <button
                                            key={`topic-${topic.id}`}
                                            type="button"
                                            onClick={() => navigateTo({ type: 'topic', item: topic })}
                                            onMouseEnter={() => setSelectedIndex(idx)}
                                            className={cn(
                                                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors',
                                                selectedIndex === idx
                                                    ? 'bg-accent text-accent-foreground'
                                                    : 'hover:bg-muted',
                                            )}
                                        >
                                            <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            <span className="flex-1 truncate">{highlightText(topic.name, query)}</span>
                                            <span className="shrink-0 text-xs text-muted-foreground">
                                                {topic.code}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {results && !isLoading && results.competitions.length > 0 && (
                        <section>
                            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                المسابقات
                            </h3>
                            <div className="flex flex-col gap-1">
                                {results.competitions.map((competition) => {
                                    const idx = allResults.findIndex(
                                        (r) => r.type === 'competition' && r.item.id === competition.id,
                                    );

                                    return (
                                        <button
                                            key={`competition-${competition.id}`}
                                            type="button"
                                            onClick={() => navigateTo({ type: 'competition', item: competition })}
                                            onMouseEnter={() => setSelectedIndex(idx)}
                                            className={cn(
                                                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors',
                                                selectedIndex === idx
                                                    ? 'bg-accent text-accent-foreground'
                                                    : 'hover:bg-muted',
                                            )}
                                        >
                                            <Trophy className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            <span className="flex-1 truncate">{highlightText(competition.name, query)}</span>
                                            <span className="shrink-0 text-xs text-muted-foreground">
                                                {competition.code}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {!query && recentSearches.length > 0 && (
                        <section>
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground">
                                    عمليات البحث الأخيرة
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRecentSearches([]);
                                        saveRecentSearches([]);
                                    }}
                                    className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    مسح الكل
                                </button>
                            </div>
                            <div className="flex flex-col gap-1">
                                {recentSearches.map((term) => (
                                    <button
                                        key={term}
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            setQuery(term);
                                        }}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors hover:bg-muted"
                                    >
                                        <History className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        <span className="flex-1 truncate">{term}</span>
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setRecentSearches((prev) => {
                                                    const next = prev.filter((s) => s !== term);
                                                    saveRecentSearches(next);

                                                    return next;
                                                });
                                            }}
                                            className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {!query && recentSearches.length === 0 && (
                        <p className="py-8 text-center text-xs text-muted-foreground/60">
                            اكتب حرفين على الأقل لبدء البحث
                        </p>
                    )}
                </div>

                <div className="-mx-6 -mb-6 mt-2 rounded-b-lg bg-muted/50 px-6 py-2.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[11px] font-medium">↑↓</kbd>
                            <span>للتنقل</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[11px] font-medium">↵</kbd>
                            <span>للاختيار</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[11px] font-medium">ESC</kbd>
                            <span>للإغلاق</span>
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
