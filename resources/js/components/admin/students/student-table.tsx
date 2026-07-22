import { Link, router } from '@inertiajs/react';
import { SearchX, Users, ArrowUp, ArrowDown } from 'lucide-react';
import StudentTableRow from '@/components/admin/students/student-table-row';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import students from '@/routes/admin/students';
import type { User } from '@/types';
import type { PaginationMeta } from '@/types/pagination';

interface StudentRow extends User {
    attempts_count?: number;
    competitions_count?: number;
}

function handleSort(sort: string, direction: string, field: string) {
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    if (sort === field && direction === 'asc') {
        params.set('direction', 'desc');
    } else {
        params.set('sort', field);
        params.set('direction', 'asc');
    }

    params.set('page', '1');

    router.visit(currentUrl.pathname + '?' + params.toString(), {
        preserveState: true,
        preserveScroll: true,
    });
}

function SortHeader({ field, label, className, sort, direction }: { field: string; label: string; className?: string; sort: string; direction: string }) {
    const isActive = sort === field;

    return (
        <th className={cn('px-4 py-3 font-medium whitespace-nowrap group', className)}>
            <button
                onClick={() => handleSort(sort, direction, field)}
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
                {label}
                {isActive && direction === 'asc' && <ArrowUp className="h-3 w-3" />}
                {isActive && direction === 'desc' && <ArrowDown className="h-3 w-3" />}
            </button>
        </th>
    );
}

export default function StudentTable({
    students: studentList,
    meta,
    searchQuery = '',
    sort = 'created_at',
    direction = 'desc',
}: {
    students: StudentRow[];
    meta: PaginationMeta;
    searchQuery?: string;
    sort?: string;
    direction?: string;
}) {
    if (studentList.length === 0) {
        const hasFilters = searchQuery.trim() !== '';

        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20">
                {hasFilters ? (
                    <>
                        <SearchX className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">لا توجد نتائج تطابق بحثك.</p>
                        <p className="text-sm text-muted-foreground/60">
                            حاول تغيير كلمات البحث أو إلغاء التصفية.
                        </p>
                    </>
                ) : (
                    <>
                        <Users className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">لا يوجد طلاب بعد.</p>
                        <p className="text-sm text-muted-foreground/60">أضف أول طالب للبدء.</p>
                        <Link href={students.create().url} className="mt-2">
                            <Button>إنشاء أول طالب</Button>
                        </Link>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                    <tr className="border-b bg-muted/80 text-start backdrop-blur-sm">
                        <SortHeader sort={sort} direction={direction} field="name" label="الاسم" />
                        <SortHeader sort={sort} direction={direction} field="email" label="البريد الإلكتروني" />
                        <th className="px-4 py-3 font-medium whitespace-nowrap">الحالة</th>
                        <SortHeader sort={sort} direction={direction} field="created_at" label="تاريخ التسجيل" />
                        <th className="px-4 py-3 font-medium whitespace-nowrap text-center">المحاولات</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.map((student, i) => (
                        <StudentTableRow
                            key={student.id}
                            student={student}
                            index={i}
                        />
                    ))}
                </tbody>
            </table>
            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
                {studentList.length} من أصل {meta.total}
            </div>
        </div>
    );
}
