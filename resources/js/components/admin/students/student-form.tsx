import { motion } from 'framer-motion';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StudentFormData {
    name: string;
    email: string;
    password: string;
    email_verified_at: string | null;
}

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
    },
} as const;

export default function StudentForm({
    data,
    setData,
    processing,
    errors,
    onSubmit,
    submitLabel,
    isEditing = false,
}: {
    data: StudentFormData;
    setData: (key: keyof StudentFormData, value: unknown) => void;
    processing: boolean;
    errors: Record<string, string>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    isEditing?: boolean;
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
                    <Label htmlFor="name">اسم الطالب</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                        id="email"
                        type="email"
                        dir="ltr"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="password">
                        كلمة المرور
                        {isEditing && (
                            <span className="me-1 text-xs text-muted-foreground">
                                (اترك فارغاً لعدم التغيير)
                            </span>
                        )}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        dir="ltr"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required={!isEditing}
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email_verified_at">التحقق من البريد</Label>
                    <select
                        id="email_verified_at"
                        value={data.email_verified_at ? '1' : '0'}
                        onChange={(e) =>
                            setData(
                                'email_verified_at',
                                e.target.value === '1'
                                    ? new Date().toISOString()
                                    : null,
                            )
                        }
                        className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                    >
                        <option value="1">مفعل</option>
                        <option value="0">غير مفعل</option>
                    </select>
                    <InputError message={errors.email_verified_at} />
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 border-t pt-4 sm:flex-row sm:justify-between">
                <span className="text-sm text-muted-foreground">
                    {isEditing ? 'تحديث بيانات الطالب' : 'إضافة طالب جديد'}
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
