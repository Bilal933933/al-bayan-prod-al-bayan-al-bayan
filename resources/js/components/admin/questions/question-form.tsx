import { motion } from 'framer-motion';
import OptionFields from '@/components/admin/questions/option-fields';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { QuestionFormData } from '@/types/question';

interface TopicOption {
    id: number;
    name: string;
}

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35 },
    },
};

export default function QuestionForm({
    data,
    setData,
    processing,
    errors,
    onSubmit,
    submitLabel,
    topics,
}: {
    data: QuestionFormData;
    setData: (key: keyof QuestionFormData, value: unknown) => void;
    processing: boolean;
    errors: Record<string, string>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    topics: TopicOption[];
}) {
    function handleTypeChange(newType: 'mcq' | 'true_false') {
        if (newType === 'true_false') {
            setData('type', newType);
            setData('options', [
                { text: 'صح', is_correct: false },
                { text: 'خطأ', is_correct: false },
            ]);
        } else {
            setData('type', newType);
        }
    }

    return (
        <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={onSubmit}
            className="space-y-6"
        >
            {/* الصف الأول: المحور + النوع */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="topic_id">المحور</Label>
                    <Select
                        value={String(data.topic_id)}
                        onValueChange={(val) => setData('topic_id', Number(val))}
                    >
                        <SelectTrigger id="topic_id">
                            <SelectValue placeholder="اختر المحور" />
                        </SelectTrigger>
                        <SelectContent>
                            {topics.map((topic) => (
                                <SelectItem key={topic.id} value={String(topic.id)}>
                                    {topic.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.topic_id} />
                </div>

                <div className="grid gap-2">
                    <Label>نوع السؤال</Label>
                    <div className="flex items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                checked={data.type === 'mcq'}
                                onChange={() => handleTypeChange('mcq')}
                                className="h-4 w-4 border-gray-300 text-primary"
                            />
                            <span className="text-sm">اختيار من متعدد</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                checked={data.type === 'true_false'}
                                onChange={() => handleTypeChange('true_false')}
                                className="h-4 w-4 border-gray-300 text-primary"
                            />
                            <span className="text-sm">صح/خطأ</span>
                        </label>
                    </div>
                    <InputError message={errors.type} />
                </div>
            </div>

            {/* نص السؤال (كامل العرض) */}
            <div className="grid gap-2">
                <Label htmlFor="text">نص السؤال</Label>
                <textarea
                    id="text"
                    className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-24 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                    value={data.text}
                    onChange={(e) => setData('text', e.target.value)}
                    placeholder="أدخل نص السؤال..."
                />
                <InputError message={errors.text} />
            </div>

            {/* الصف: الصعوبة + الحالة */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="difficulty">مستوى الصعوبة</Label>
                    <Select
                        value={data.difficulty}
                        onValueChange={(val) => setData('difficulty', val as 'easy' | 'medium' | 'hard')}
                    >
                        <SelectTrigger id="difficulty">
                            <SelectValue placeholder="اختر المستوى" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">سهل</SelectItem>
                            <SelectItem value="medium">متوسط</SelectItem>
                            <SelectItem value="hard">صعب</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.difficulty} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="is_active">الحالة</Label>
                    <select
                        id="is_active"
                        value={data.is_active ? '1' : '0'}
                        onChange={(e) => setData('is_active', e.target.value === '1')}
                        className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                    >
                        <option value="1">نشط</option>
                        <option value="0">غير نشط</option>
                    </select>
                    <InputError message={errors.is_active} />
                </div>
            </div>

            {/* الخيارات */}
            <OptionFields
                options={data.options}
                type={data.type}
                onChange={(options) => setData('options', options)}
                errors={errors}
            />

            {/* شرح الإجابة (يظهر في النتائج) */}
            <div className="grid gap-2">
                <Label htmlFor="explanation">
                    شرح الإجابة
                    <span className="text-xs text-muted-foreground me-1">(يظهر في صفحة النتائج)</span>
                </Label>
                <textarea
                    id="explanation"
                    className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-20 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                    value={data.explanation ?? ''}
                    onChange={(e) => setData('explanation', e.target.value || null)}
                    placeholder="شرح يظهر للطالب بعد انتهاء المحاولة..."
                />
                <InputError message={errors.explanation} />
            </div>

            {/* أزرار الإرسال */}
            <div className="flex flex-col items-center gap-4 pt-4 border-t sm:flex-row sm:justify-between">
                <span className="text-sm text-muted-foreground">
                    {submitLabel === 'إنشاء السؤال' ? 'إضافة سؤال جديد' : 'تحديث بيانات السؤال'}
                </span>
                <div className="flex w-full gap-3 sm:w-auto">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="flex-1 sm:flex-none"
                    >
                        إلغاء
                    </Button>
                    <Button
                        disabled={processing}
                        className="flex-1 sm:flex-none"
                    >
                        {processing ? 'جاري الحفظ...' : submitLabel}
                    </Button>
                </div>
            </div>
        </motion.form>
    );
}
