import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import ClassificationBadge from '@/components/admin/competitions/classification-badge';
import ParentSelect from '@/components/admin/competitions/parent-select';
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
import { COMPETITION_ICONS, ICON_KEYS } from '@/config/competition-icons';
import type { Competition, CompetitionFormData } from '@/types/competition';

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
    },
};

export default function CompetitionForm({
    data,
    setData,
    processing,
    errors,
    onSubmit,
    submitLabel,
    availableParents,
}: {
    data: CompetitionFormData;
    setData: (key: keyof CompetitionFormData, value: unknown) => void;
    processing: boolean;
    errors: Record<string, string>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    availableParents: Pick<Competition, 'id' | 'name'>[];
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const existingImageUrl = data.image ? '/storage/' + data.image : null;
    const displayPreview = previewUrl ?? existingImageUrl;

    useEffect(() => {
        return () => {
            if (previewUrl) {
URL.revokeObjectURL(previewUrl);
}
        };
    }, [previewUrl]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;

        if (previewUrl) {
URL.revokeObjectURL(previewUrl);
}

        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            setData('image_file', file);
        } else {
            setPreviewUrl(null);
            setData('image_file', null);
        }
    }

    function handleRemoveImage() {
        if (previewUrl) {
URL.revokeObjectURL(previewUrl);
}

        setPreviewUrl(null);
        setData('image_file', null);
        setData('image', null);

        if (!fileInputRef.current) {
return;
}

        fileInputRef.current.value = '';
    }

    return (
        <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={onSubmit}
            className="space-y-6"
        >
            {/* الصف الأول: الاسم + الكود */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="name">اسم المسابقة</Label>
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

            {/* الرابط المختصر (slug) */}
            <div className="grid gap-2">
                <Label htmlFor="slug">
                    الرابط المختصر
                    <span className="text-xs text-muted-foreground me-1">(اختياري)</span>
                </Label>
                <Input
                    id="slug"
                    dir="ltr"
                    value={data.slug ?? ''}
                    onChange={(e) => setData('slug', e.target.value || null)}
                    placeholder="مثال: linguistic"
                />
                <p className="text-xs text-muted-foreground">
                    إذا تركت الحقل فارغاً، سيتم إنشاء الرابط تلقائياً من الكود.
                </p>
                <InputError message={errors.slug} />
            </div>

            {/* تصنيف المسابقة (حاوية/مستقلة/ابن) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label>التصنيف</Label>
                    <ClassificationBadge classification={data.classification} />
                    <div className="mt-1 flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="classification"
                                checked={data.classification === 'container'}
                                onChange={() => {
                                    setData('classification', 'container');
                                    setData('parent_id', null);
                                }}
                                className="h-4 w-4 border-gray-300 text-primary"
                            />
                            <span className="text-sm">حاوية</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="classification"
                                checked={data.classification === 'standalone'}
                                onChange={() => {
                                    setData('classification', 'standalone');
                                    setData('parent_id', null);
                                }}
                                className="h-4 w-4 border-gray-300 text-primary"
                            />
                            <span className="text-sm">مستقلة</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="classification"
                                checked={data.classification === 'child'}
                                onChange={() => setData('classification', 'child')}
                                className="h-4 w-4 border-gray-300 text-primary"
                            />
                            <span className="text-sm">ابن</span>
                        </label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {data.classification === 'container'
                            ? 'الحاوية تُستخدم كتصنيف ولا تُربط بمحاور'
                            : data.classification === 'child'
                                ? 'الابن يتبع حاوية ويُربط بمحاور وأسئلة'
                                : 'المستقلة لا تتبع أحد وتُربط مباشرة بالمحاور والأسئلة'}
                    </p>
                    <InputError message={errors.classification} />
                </div>

                <div className="grid gap-2">
                    {/* حقل فارغ للمحافظة على تناسق الـ Grid */}
                </div>
            </div>

            {/* المسابقة الأب (تظهر فقط إذا كان التصنيف "ابن") */}
            {data.classification === 'child' && (
                <ParentSelect
                    availableParents={availableParents as Competition[]}
                    value={data.parent_id}
                    onChange={(value) => setData('parent_id', value)}
                    error={errors.parent_id}
                />
            )}

            {/* الصف: الحالة + الصورة */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                <div className="grid gap-2">
                    <Label>صورة العرض</Label>
                    <div className="flex flex-col gap-3">
                        {displayPreview ? (
                            <div className="relative w-full max-w-xs overflow-hidden rounded-lg border">
                                <img
                                    src={displayPreview}
                                    alt="معاينة الصورة"
                                    className="h-32 w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white text-xs hover:bg-black/80"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="flex h-32 w-full max-w-xs items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                                لا توجد صورة
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {displayPreview ? 'تغيير الصورة' : 'اختيار صورة'}
                            </Button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        الصيغ المدعومة: JPEG, PNG, GIF, Webp — الحد الأقصى 2MB
                    </p>
                    <InputError message={errors.image_file ?? errors.image} />
                </div>
            </div>

            {/* الصف: اللون + الأيقونة */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="color">اللون المميز</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="color"
                            type="color"
                            value={data.color ?? '#000000'}
                            onChange={(e) => setData('color', e.target.value)}
                            className="h-9 w-14 cursor-pointer p-1"
                        />
                        <span className="text-xs text-muted-foreground font-mono">
                            {data.color ?? '—'}
                        </span>
                    </div>
                    <InputError message={errors.color} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="icon">الأيقونة</Label>
                    <Select
                        value={data.icon ?? 'null'}
                        onValueChange={(val) => setData('icon', val === 'null' ? null : val)}
                    >
                        <SelectTrigger id="icon" className="w-full">
                            <SelectValue placeholder="اختر أيقونة">
                                {data.icon && COMPETITION_ICONS[data.icon] && (
                                    <span className="flex items-center gap-2">
                                        {(() => {
                                            const Icon = COMPETITION_ICONS[data.icon].icon;

                                            return <Icon className="h-4 w-4" />;
                                        })()}
                                        {COMPETITION_ICONS[data.icon].label}
                                    </span>
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="null">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    بدون أيقونة
                                </span>
                            </SelectItem>
                            {ICON_KEYS.map((key) => {
                                const entry = COMPETITION_ICONS[key];
                                const Icon = entry.icon;

                                return (
                                    <SelectItem key={key} value={key}>
                                        <span className="flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            {entry.label}
                                        </span>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.icon} />
                </div>
            </div>

            {/* الوصف (كامل العرض) */}
            <div className="grid gap-2">
                <Label htmlFor="description">الوصف</Label>
                <textarea
                    id="description"
                    className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-20 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                    value={data.description ?? ''}
                    onChange={(e) => setData('description', e.target.value || null)}
                />
                <InputError message={errors.description} />
            </div>

            {/* أزرار الإرسال */}
            <div className="flex flex-col items-center gap-4 pt-4 border-t sm:flex-row sm:justify-between">
                <span className="text-sm text-muted-foreground">
                    {submitLabel === 'إنشاء المسابقة' ? 'إضافة مسابقة جديدة' : 'تحديث بيانات المسابقة'}
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
