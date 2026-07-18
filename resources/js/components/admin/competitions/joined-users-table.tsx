import { Users, SearchX } from 'lucide-react';
import DateDisplay from '@/components/date-display';
import { Badge } from '@/components/ui/badge';
import type { PaginationMeta } from '@/types/pagination';
import type { User } from '@/types/auth';

interface JoinedUser extends User {
    pivot: {
        joined_at: string;
    };
}

interface JoinedUsersTableProps {
    users: JoinedUser[];
    meta: PaginationMeta;
    competitionName: string;
}

export default function JoinedUsersTable({ users, meta, competitionName }: JoinedUsersTableProps) {
    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16">
                <Users className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">لا يوجد طلاب منضمون بعد.</p>
                <p className="text-sm text-muted-foreground/60">
                    يمكن للطلاب الانضمام إلى "{competitionName}" من صفحة المسابقات.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                    <tr className="border-b bg-muted/80 text-start backdrop-blur-sm">
                        <th className="w-12 px-4 py-3 text-center font-medium whitespace-nowrap">#</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">الاسم</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">البريد الإلكتروني</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">تاريخ الانضمام</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">الحالة</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, i) => (
                        <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="px-4 py-3 text-center text-muted-foreground">
                                {meta.from !== null ? meta.from + i : i + 1}
                            </td>
                            <td className="px-4 py-3 font-medium">{user.name}</td>
                            <td className="px-4 py-3 text-muted-foreground" dir="ltr">{user.email}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                                <DateDisplay date={user.pivot.joined_at} format="relative" showTooltip />
                            </td>
                            <td className="px-4 py-3">
                                <Badge variant={user.email_verified_at ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                                    {user.email_verified_at ? 'مفعل' : 'غير مفعل'}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
                {meta.from ?? 0}–{meta.to ?? 0} من أصل {meta.total}
            </div>
        </div>
    );
}
