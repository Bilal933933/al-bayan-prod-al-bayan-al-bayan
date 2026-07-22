import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Download, Eye, FileQuestion, MoreHorizontal, Pencil, Search, SearchX, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import DifficultyBadge from '@/components/admin/questions/difficulty-badge';
import DeleteDialog from '@/components/delete-dialog';
import Heading from '@/components/heading';
import { LaravelPagination } from '@/components/laravel-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes/admin';
import questions from '@/routes/admin/questions';
import type { BreadcrumbItem } from '@/types';
import type { PaginationMeta } from '@/types/pagination';
import type { Question } from '@/types/question';

const TYPE_BAGES: Record<string, { label: string; className: string }> = {
    mcq: { label: 'اختيار من متعدد', className: 'bg-info/20 text-info' },
    true_false: { label: 'صح/خطأ', className: 'bg-palette-3/20 text-palette-3' },
};

interface IndexProps {
    questions: {
        data: Question[];
    } & PaginationMeta;
    topics: { id: number; name: string }[];
    sort: string;
    direction: string;
    search: string;
    filter: string;
    filters: {
        topic_id?: string;
        difficulty?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'الأسئلة', href: questions.index() },
];

function navigateWithParams(overrides: Record<string, string | undefined>) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined || value === '') {
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

export default function Index({
    questions: questionsPage,
    topics: topicList,
    search: currentSearch = '',
    filter = 'all',
    filters = {},
}: IndexProps) {
    const [searchInput, setSearchInput] = useState(currentSearch || '');
    const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== currentSearch) {
                navigateWithParams({ search: searchInput || undefined, page: '1' });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput, currentSearch]);

    const allQuestions = questionsPage.data;

    function handleDelete() {
        if (!deleteTarget) {
return;
}

        setDeleting(true);

        router.delete(questions.destroy({ question: deleteTarget.id }).url, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    }

    return (
        <>
            <Head title="الأسئلة" />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-5 p-6"
            >
                {/* رأس الصفحة */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Heading title="الأسئلة" description="إدارة بنك الأسئلة" />
                    <div className="flex shrink-0 gap-2">
                        <Link href={questions.importFile().url}>
                            <Button variant="outline">
                                <Download className="h-4 w-4" />
                                استيراد
                            </Button>
                        </Link>
                        <Link href={questions.create().url}>
                            <Button>إضافة سؤال</Button>
                        </Link>
                    </div>
                </div>

                {/* شريط التصفية والبحث */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="بحث بنص السؤال..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pe-9"
                        />
                    </div>

                    <Select
                        value={filters.topic_id ?? 'all'}
                        onValueChange={(val) => navigateWithParams({ topic_id: val === 'all' ? undefined : val, page: '1' })}
                    >
                        <SelectTrigger className="w-full sm:w-44">
                            <SelectValue placeholder="جميع المحاور" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">جميع المحاور</SelectItem>
                            {topicList.map((topic) => (
                                <SelectItem key={topic.id} value={String(topic.id)}>
                                    {topic.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.difficulty ?? 'all'}
                        onValueChange={(val) => navigateWithParams({ difficulty: val === 'all' ? undefined : val, page: '1' })}
                    >
                        <SelectTrigger className="w-full sm:w-36">
                            <SelectValue placeholder="جميع المستويات" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">جميع المستويات</SelectItem>
                            <SelectItem value="easy">سهل</SelectItem>
                            <SelectItem value="medium">متوسط</SelectItem>
                            <SelectItem value="hard">صعب</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filter}
                        onValueChange={(val) => navigateWithParams({ filter: val === 'all' ? undefined : val, page: '1' })}
                    >
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="جميع الأنواع" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">جميع الأنواع</SelectItem>
                            <SelectItem value="mcq">اختيار من متعدد</SelectItem>
                            <SelectItem value="true_false">صح/خطأ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* الجدول */}
                {allQuestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20">
                        {currentSearch || filter !== 'all' || filters.topic_id || filters.difficulty ? (
                            <>
                                <SearchX className="h-10 w-10 text-muted-foreground/30" />
                                <p className="text-muted-foreground">لا توجد نتائج تطابق بحثك.</p>
                                <p className="text-sm text-muted-foreground/60">حاول تغيير كلمات البحث أو إلغاء التصفية.</p>
                            </>
                        ) : (
                            <>
                                <FileQuestion className="h-10 w-10 text-muted-foreground/30" />
                                <p className="text-muted-foreground">لا توجد أسئلة بعد.</p>
                                <p className="text-sm text-muted-foreground/60">أضف أول سؤال للبدء.</p>
                                <Link href={questions.create().url} className="mt-2">
                                    <Button>إنشاء أول سؤال</Button>
                                </Link>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 z-10">
                                    <tr className="border-b bg-muted/80 text-start backdrop-blur-sm">
                                        <th className="px-4 py-3 font-medium whitespace-nowrap">نص السؤال</th>
                                        <th className="px-4 py-3 font-medium whitespace-nowrap">المحور</th>
                                        <th className="px-4 py-3 font-medium whitespace-nowrap">النوع</th>
                                        <th className="px-4 py-3 font-medium whitespace-nowrap">المستوى</th>
                                        <th className="px-4 py-3 font-medium whitespace-nowrap text-center">الخيارات</th>
                                        <th className="px-4 py-3 font-medium whitespace-nowrap">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allQuestions.map((question, i) => {
                                        const typeConfig = TYPE_BAGES[question.type] ?? { label: question.type, className: '' };

                                        return (
                                            <motion.tr
                                                key={question.id}
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                                className="border-b transition-colors hover:bg-muted/50"
                                            >
                                                <td className="break-words px-4 py-3 max-w-xs">
                                                    <Link
                                                        href={questions.show({ question: question.id }).url}
                                                        className="hover:text-primary transition-colors line-clamp-2"
                                                    >
                                                        {question.text}
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                                                    {question.topic?.name ?? '—'}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <Badge variant="secondary" className={typeConfig.className}>
                                                        {typeConfig.label}
                                                    </Badge>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <DifficultyBadge difficulty={question.difficulty} />
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                                    {question.options_count !== undefined ? (
                                                        <Badge variant="outline">{question.options_count}</Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" side="left">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={questions.show({ question: question.id }).url}>
                                                                    <Eye className="h-4 w-4" />
                                                                    عرض
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={questions.edit({ question: question.id }).url}>
                                                                    <Pencil className="h-4 w-4" />
                                                                    تعديل
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() => setDeleteTarget(question)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                حذف
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
                                {allQuestions.length} من أصل {questionsPage.total}
                            </div>
                        </div>
                        <LaravelPagination meta={questionsPage} />
                    </>
                )}
            </motion.div>

                <DeleteDialog
                    open={deleteTarget !== null}
                    onOpenChange={(open) => {
 if (!open) {
setDeleteTarget(null);
} 
}}
                    description="هل أنت متأكد من حذف هذا السؤال؟ هذا الإجراء لا يمكن التراجع عنه."
                    onDelete={handleDelete}
                    processing={deleting}
                />
        </>
    );
}

Index.layout = {
    breadcrumbs,
};
