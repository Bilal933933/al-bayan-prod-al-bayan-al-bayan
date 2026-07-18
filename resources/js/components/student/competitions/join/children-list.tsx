import type { ChildCompetition } from '@/types/competition';

interface ChildrenListProps {
    children: ChildCompetition[];
}

export default function ChildrenList({ children }: ChildrenListProps) {
    if (children.length === 0) {
        return null;
    }

    return (
        <div className="border-t border-slate-100 pt-6">
            <h3 className="mb-3 text-sm font-bold text-slate-700">
                الاختبارات المتاحة تحت مظلة هذه المسابقة:
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {children.map((child) => (
                    <div
                        key={child.id}
                        className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs font-bold text-slate-600"
                    >
                        {child.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
