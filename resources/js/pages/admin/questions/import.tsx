import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, FileUp, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import questions from '@/routes/admin/questions';
import type { BreadcrumbItem } from '@/types';

interface Errors {
    import?: string[];
    file?: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'الأسئلة', href: questions.index() },
    { title: 'استيراد', href: questions.importFile() },
];

const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Import() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { errors } = usePage<{ errors: Errors }>().props;

    const importErrors = Array.isArray(errors?.import) ? errors.import : [];
    const fileErrors = Array.isArray(errors?.file) ? errors.file : [];
    const allErrors = [...importErrors, ...fileErrors];

    const handleSubmit = () => {
        if (!file) {
            return;
        }

        setLoading(true);

        router.post(questions.importFile.store().url, { file }, {
            forceFormData: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('تم إرسال الأسئلة للمعالجة');
                setFile(null);
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
                toast.error('فشل الاستيراد. تحقق من الملف وحاول مرة أخرى.');
            },
        });
    };

    return (
        <>
            <Head title="استيراد أسئلة" />

            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-2xl flex-col gap-6 p-6"
            >
                <Heading title="استيراد أسئلة" description="رفع ملف Excel أو CSV لاستيراد الأسئلة دفعة واحدة" />

                <Alert>
                    <FileSpreadsheet className="h-4 w-4" />
                    <AlertTitle>تنسيق الملف المطلوب</AlertTitle>
                    <AlertDescription>
                        <p className="mb-2 text-sm">
                            الملف يجب أن يحتوي على صف رأس ثم بيانات الأسئلة ابتداءً من الصف الثاني.
                        </p>
                        <div className="overflow-x-auto rounded-lg border bg-card text-xs">
                            <table className="w-full text-right">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-2 font-bold">العمود</th>
                                        <th className="p-2 font-bold">الاسم</th>
                                        <th className="p-2 font-bold">الوصف</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b"><td className="p-2">A</td><td className="p-2 font-bold">topic_code</td><td className="p-2 text-muted-foreground">كود الموضوع (مثال: MATH-101)</td></tr>
                                    <tr className="border-b"><td className="p-2">B</td><td className="p-2 font-bold">type</td><td className="p-2 text-muted-foreground">نوع السؤال: mcq أو true_false</td></tr>
                                    <tr className="border-b"><td className="p-2">C</td><td className="p-2 font-bold">text</td><td className="p-2 text-muted-foreground">نص السؤال</td></tr>
                                    <tr className="border-b"><td className="p-2">D</td><td className="p-2 font-bold">difficulty</td><td className="p-2 text-muted-foreground">مستوى الصعوبة: easy, medium, hard</td></tr>
                                    <tr className="border-b"><td className="p-2">E</td><td className="p-2 font-bold">explanation</td><td className="p-2 text-muted-foreground">الشرح (اختياري)</td></tr>
                                    <tr className="border-b"><td className="p-2">F - K</td><td className="p-2 font-bold">option_1 ... option_6</td><td className="p-2 text-muted-foreground">خيارات الإجابة (2-6 خيارات)</td></tr>
                                    <tr><td className="p-2">L</td><td className="p-2 font-bold">correct_option</td><td className="p-2 text-muted-foreground">رقم الخيار الصحيح (1-6)</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </AlertDescription>
                </Alert>

                {allErrors.length > 0 && (
                    <Alert variant="destructive">
                        <AlertTitle>خطأ</AlertTitle>
                        <AlertDescription>
                            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                                {allErrors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="rounded-2xl border-2 border-dashed bg-card p-8">
                    <div
                        className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl p-8 transition-colors ${dragOver ? 'bg-primary/5' : 'bg-muted/30'}`}
                        onDragOver={(e) => {
 e.preventDefault(); setDragOver(true); 
}}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            const droppedFile = e.dataTransfer.files[0];

                            if (droppedFile && ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'].includes(droppedFile.type)) {
                                setFile(droppedFile);
                            } else {
                                toast.error('الرجاء رفع ملف Excel أو CSV فقط');
                            }
                        }}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                        <FileUp className="h-10 w-10 text-muted-foreground/40" />
                        <div className="text-center">
                            <p className="font-bold">اسحب الملف إلى هنا أو اضغط للاختيار</p>
                            <p className="mt-1 text-xs text-muted-foreground">Excel أو CSV - الحد الأقصى 20 ميجابايت</p>
                        </div>
                    </div>

                    {file && (
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-muted p-3">
                            <div className="flex items-center gap-2 text-sm">
                                <FileSpreadsheet className="h-5 w-5 text-primary" />
                                <span className="font-bold">{file.name}</span>
                                <span className="text-muted-foreground">({(file.size / 1024).toFixed(1)} كيلوبايت)</span>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {loading ? 'جاري الرفع...' : 'رفع واستيراد'}
                            </Button>
                        </div>
                    )}
                </div>

                <Link
                    href={questions.index().url}
                    className="text-center text-sm text-muted-foreground underline transition-colors hover:text-foreground"
                >
                    العودة إلى قائمة الأسئلة
                </Link>
            </motion.div>
        </>
    );
}

Import.layout = {
    breadcrumbs,
};
