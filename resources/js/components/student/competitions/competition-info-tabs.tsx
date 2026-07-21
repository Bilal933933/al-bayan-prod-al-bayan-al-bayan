import { useState } from 'react';

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

const tabs: Tab[] = [
    {
        id: 'regulations',
        label: 'الضوابط والشروط',
        content: (
            <ul className="space-y-3">
                {[
                    'أن يكون المتقدم مسجلاً في المنصة',
                    'الالتزام بالوقت المحدد لكل اختبار',
                    'لا يمكن إيقاف الاختبار مؤقتاً بعد البدء',
                    'يُحتسب الوقت منذ الضغط على "ابدأ الاختبار"',
                    'في حالة انتهاء الوقت، يُغلق الاختبار تلقائياً',
                    'النتائج النهائية تظهر بعد انتهاء المسابقة',
                ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                            {i + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: 'instructions',
        label: 'تعليمات الاختبار',
        content: (
            <ul className="space-y-3">
                {[
                    'تأكد من استقرار اتصال الإنترنت قبل البدء',
                    'استخدم متصفح محدث (Chrome, Firefox, Edge)',
                    'يُفضل استخدام جهاز كمبيوتر للاختبارات الطويلة',
                    'اختر الإجابة الصحيحة من بين الخيارات المتاحة',
                    'يمكنك التنقل بين الأسئلة باستخدام أزرار التنقل',
                    'يمكنك وضع علامة مراجعة على الأسئلة للعودة إليها لاحقاً',
                    'لن يتم احتساب إجاباتك إذا غادرت الصفحة',
                ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                            {i + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: 'scoring',
        label: 'طريقة احتساب الدرجات',
        content: (
            <ul className="space-y-3">
                {[
                    'يحصل المتسابق على نقطة واحدة عن كل إجابة صحيحة',
                    'لا تُخصم نقاط للإجابات الخاطئة',
                    'الدرجة النهائية = مجموع النقاط المحققة',
                    'في حالة تساوي النقاط، يُحتسب الوقت كعامل مفاضلة',
                    'يتم فرز المتصدرين بناءً على أعلى الدرجات ثم أقل وقت',
                ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                            {i + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
                    </li>
                ))}
            </ul>
        ),
    },
];

export default function CompetitionInfoTabs() {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap gap-1 border-b border-border bg-muted/30 p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                            activeTab === tab.id
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="p-6 md:p-8">
                {tabs.find((t) => t.id === activeTab)?.content}
            </div>
        </div>
    );
}
