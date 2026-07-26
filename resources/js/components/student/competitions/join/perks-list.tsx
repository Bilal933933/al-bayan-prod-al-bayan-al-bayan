import { CheckCircle2, Trophy } from 'lucide-react';

const PERKS = [
    'صلاحية الوصول الكاملة لاختبارات المحاكاة الفرعية والتدريب المكثف.',
    'إدراج اسمك ونقاطك تلقائياً في لوحة المتصدرين العامة للمسابقة للتنافس الشريف.',
    'تتبع حي ومستمر لتقدمك الإجمالي، مع حساب إحصائيات أيام الاستمرارية ونشاطك المتتالي.',
    'حفظ مراجعات تفصيلية لكل محاولة مكتملة لمعرفة نقاط القوة والضعف لديك.',
];

export default function PerksList() {
    return (
        <div className="border-t border-slate-100 pt-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span>ماذا ستحصل عليه بعد الانضمام؟</span>
            </h3>
            <ul className="space-y-3">
                {PERKS.map((perk, idx) => (
                    <li
                        key={idx}
                        className="flex items-start gap-3 text-sm font-medium text-slate-600"
                    >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        <span>{perk}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
