import { motion } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import type { Competition } from '@/types/competition';

export default function ParentSelect({
    availableParents,
    value,
    onChange,
    error,
}: {
    availableParents: Competition[];
    value: number | null;
    onChange: (value: number | null) => void;
    error?: string;
}) {
    const selectedParent = availableParents.find((p) => p.id === value);

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid gap-2"
        >
            <Label htmlFor="parent_id">المسابقة الأب</Label>
            <Select
                value={value?.toString() ?? 'null'}
                onValueChange={(val) => onChange(val === 'null' ? null : Number(val))}
            >
                <SelectTrigger id="parent_id">
                    <SelectValue placeholder="بدون أب (مسابقة مستقلة)">
                        {selectedParent && (
                            <span className="flex items-center gap-2">
                                {selectedParent.name}
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    حاوية
                                </Badge>
                            </span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="null">
                        <span className="text-muted-foreground">بدون أب (مسابقة مستقلة)</span>
                    </SelectItem>
                    {availableParents.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id.toString()}>
                            <span className="flex items-center gap-2">
                                {parent.name}
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    حاوية
                                </Badge>
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
                فقط المسابقات من نوع "حاوية" تظهر هنا
            </p>
            <InputError message={error} />
        </motion.div>
    );
}
