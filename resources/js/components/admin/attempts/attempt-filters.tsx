import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface AttemptFiltersProps {
    filters: {
        search: string;
        type: string | null;
        status: string | null;
        topic_id: string | null;
        competition_id: string | null;
    };
    topics: { id: number; name: string }[];
    competitions: { id: number; name: string }[];
}

function navigateWithParams(overrides: Record<string, string | undefined>) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    for (const [key, value] of Object.entries(overrides)) {
        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
    }

    router.visit(url.pathname + '?' + params.toString(), {
        preserveState: true,
        preserveScroll: true,
    });
}

export default function AttemptFilters({ filters, topics, competitions }: AttemptFiltersProps) {
    const [searchInput, setSearchInput] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== filters.search) {
                navigateWithParams({ search: searchInput || undefined });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput, filters.search]);

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="بحث باسم الطالب أو البريد..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pe-9"
                />
            </div>

            <Select
                value={filters.type ?? 'all'}
                onValueChange={(val) => navigateWithParams({ type: val === 'all' ? undefined : val })}
            >
                <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="النوع" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="practice">تدريب</SelectItem>
                    <SelectItem value="exam">محاكاة</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.status ?? 'all'}
                onValueChange={(val) => navigateWithParams({ status: val === 'all' ? undefined : val })}
            >
                <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="abandoned">مهمل</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.topic_id ?? 'all'}
                onValueChange={(val) => navigateWithParams({ topic_id: val === 'all' ? undefined : val })}
            >
                <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="المحور" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">جميع المحاور</SelectItem>
                    {topics.map((topic) => (
                        <SelectItem key={topic.id} value={String(topic.id)}>
                            {topic.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.competition_id ?? 'all'}
                onValueChange={(val) => navigateWithParams({ competition_id: val === 'all' ? undefined : val })}
            >
                <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="المسابقة" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">جميع المسابقات</SelectItem>
                    {competitions.map((comp) => (
                        <SelectItem key={comp.id} value={String(comp.id)}>
                            {comp.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
