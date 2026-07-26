import { motion } from 'framer-motion';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { TopicFormData } from '@/types/topic';

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35 },
    },
};

export default function TopicForm({
    data,
    setData,
    processing,
    errors,
    onSubmit,
    submitLabel,
}: {
    data: TopicFormData;
    setData: (key: keyof TopicFormData, value: unknown) => void;
    processing: boolean;
    errors: Record<string, string>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}) {
    return (
        <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={onSubmit}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="name">اسم المحور</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="code">الكود</Label>
                    <Input
                        id="code"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        required
                    />
                    <InputError message={errors.code} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="visibility">الرؤية</Label>
                    <Select
                        value={data.visibility}
                        onValueChange={(val) => setData('visibility', val)}
                    >
                        <SelectTrigger id="visibility">
                            <SelectValue placeholder="اختر الرؤية" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">عام</SelectItem>
                            <SelectItem value="private">خاص</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        المحور العام يُربط بأي عدد من المسابقات، والخاص يُستخدم
                        لمجموعة محدودة
                    </p>
                    <InputError message={errors.visibility} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="is_active">الحالة</Label>
                    <select
                        id="is_active"
                        value={data.is_active ? '1' : '0'}
                        onChange={(e) =>
                            setData('is_active', e.target.value === '1')
                        }
                        className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                    >
                        <option value="1">نشط</option>
                        <option value="0">غير نشط</option>
                    </select>
                    <InputError message={errors.is_active} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="default_questions_count">
                        عدد الأسئلة الافتراضي (للتدريب)
                    </Label>
                    <Input
                        id="default_questions_count"
                        type="number"
                        min={1}
                        value={data.default_questions_count}
                        onChange={(e) =>
                            setData(
                                'default_questions_count',
                                Number(e.target.value),
                            )
                        }
                        required
                    />
                    <InputError message={errors.default_questions_count} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="default_duration_minutes">
                        المدة الافتراضية للتدريب (بالدقائق)
                    </Label>
                    <Input
                        id="default_duration_minutes"
                        type="number"
                        min={1}
                        value={data.default_duration_minutes ?? ''}
                        onChange={(e) =>
                            setData(
                                'default_duration_minutes',
                                e.target.value ? Number(e.target.value) : null,
                            )
                        }
                        placeholder="بدون مؤقت"
                    />
                    <p className="text-xs text-muted-foreground">
                        اتركه فارغاً إذا كان التدريب بدون مؤقت زمني
                    </p>
                    <InputError message={errors.default_duration_minutes} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">الوصف</Label>
                <textarea
                    id="description"
                    className="flex h-20 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                    value={data.description ?? ''}
                    onChange={(e) =>
                        setData('description', e.target.value || null)
                    }
                />
                <InputError message={errors.description} />
            </div>

            <div className="flex flex-col items-center gap-4 border-t pt-4 sm:flex-row sm:justify-between">
                <span className="text-sm text-muted-foreground">
                    {submitLabel === 'إنشاء المحور'
                        ? 'إضافة محور جديد'
                        : 'تحديث بيانات المحور'}
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
