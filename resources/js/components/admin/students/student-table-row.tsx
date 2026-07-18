import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import RowActions from '@/components/data-table-row-actions';
import DateDisplay from '@/components/date-display';
import DeleteDialog from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import students from '@/routes/admin/students';
import type { User } from '@/types';

interface StudentRow extends User {
    attempts_count?: number;
    competitions_count?: number;
}

export default function StudentTableRow({
    student,
    index = 0,
}: {
    student: StudentRow;
    index?: number;
}) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    function handleDelete() {
        router.delete(students.destroy(student.id).url, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setDeleteOpen(false),
        });
    }

    return (
        <motion.tr
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="border-b transition-colors hover:bg-muted/50"
        >
            <td className="px-4 py-3 font-medium">
                <Link
                    href={students.show({ student: student.id }).url}
                    className="hover:text-primary transition-colors"
                >
                    {student.name}
                </Link>
            </td>
            <td className="px-4 py-3 text-muted-foreground font-mono text-xs" dir="ltr">
                {student.email}
            </td>
            <td className="whitespace-nowrap px-4 py-3">
                {student.email_verified_at ? (
                    <Badge variant="default" className="bg-success/15 text-success border-success/30 text-[10px] px-1.5 py-0">
                        مفعل
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-muted-foreground text-[10px] px-1.5 py-0">
                        غير مفعل
                    </Badge>
                )}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                <DateDisplay date={student.created_at} format="short" />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-center text-sm">
                {student.attempts_count ?? 0}
            </td>
            <td className="px-4 py-3">
                <RowActions
                    items={[
                        {
                            label: 'عرض التفاصيل',
                            icon: Eye,
                            href: students.show({ student: student.id }).url,
                        },
                        {
                            label: 'تعديل',
                            icon: Pencil,
                            href: students.edit({ student: student.id }).url,
                        },
                        { separator: true },
                        {
                            label: 'حذف',
                            icon: Trash2,
                            variant: 'destructive',
                            onClick: () => setDeleteOpen(true),
                        },
                    ]}
                />
                <DeleteDialog
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    description={`هل أنت متأكد من حذف الطالب "${student.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                    onDelete={handleDelete}
                />
            </td>
        </motion.tr>
    );
}
