import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TopicSearchProps {
    search: string;
    onSearchChange: (value: string) => void;
    visibilityFilter: string | null;
    onVisibilityChange: (value: string | null) => void;
    counts: { all: number; general: number; private: number };
}

const tabs = [
    { key: null, label: 'الكل' },
    { key: 'general', label: 'عامة' },
    { key: 'private', label: 'خاصة' },
] as const;

export function TopicSearch({
    search,
    onSearchChange,
    visibilityFilter,
    onVisibilityChange,
    counts,
}: TopicSearchProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="relative">
                <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="ابحث عن محور بالاسم أو الكود..."
                    className="h-10 pr-10"
                />
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
                {tabs.map((tab) => {
                    const isActive = visibilityFilter === tab.key;
                    const count =
                        tab.key === null ? counts.all : counts[tab.key];

                    return (
                        <Button
                            key={tab.key ?? 'all'}
                            variant="ghost"
                            size="sm"
                            onClick={() => onVisibilityChange(tab.key)}
                            className={cn(
                                'relative flex-1 gap-1.5 text-sm',
                                isActive && 'bg-background shadow-xs',
                            )}
                        >
                            {tab.label}
                            <span className="text-xs text-muted-foreground">
                                ({count})
                            </span>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
