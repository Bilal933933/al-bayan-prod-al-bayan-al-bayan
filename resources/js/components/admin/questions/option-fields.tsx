import { Plus, X } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Option {
    text: string;
    is_correct: boolean;
}

interface OptionFieldsProps {
    options: Option[];
    type: 'mcq' | 'true_false';
    onChange: (options: Option[]) => void;
    errors?: Record<string, string>;
}

export default function OptionFields({ options, type, onChange, errors }: OptionFieldsProps) {
    function handleTextChange(index: number, text: string) {
        const updated = options.map((opt, i) => (i === index ? { ...opt, text } : opt));
        onChange(updated);
    }

    function handleCorrectChange(index: number) {
        const updated = options.map((opt, i) => ({ ...opt, is_correct: i === index }));
        onChange(updated);
    }

    function addOption() {
        onChange([...options, { text: '', is_correct: false }]);
    }

    function removeOption(index: number) {
        if (options.length <= 2) {
return;
}

        const updated = options.filter((_, i) => i !== index);
        onChange(updated);
    }

    return (
        <div className="grid gap-3">
            <Label>الخيارات</Label>

            {type === 'true_false' ? (
                <div className="space-y-2">
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                            <input
                                type="radio"
                                name="correct_option"
                                checked={option.is_correct}
                                onChange={() => handleCorrectChange(index)}
                                className="h-4 w-4 shrink-0 border-gray-300 text-primary"
                            />
                            <span className="text-sm font-medium">{option.text}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="correct_option"
                                checked={option.is_correct}
                                onChange={() => handleCorrectChange(index)}
                                className="h-4 w-4 shrink-0 border-gray-300 text-primary"
                            />
                            <Input
                                value={option.text}
                                onChange={(e) => handleTextChange(index, e.target.value)}
                                placeholder={`الخيار ${index + 1}`}
                                className="flex-1"
                            />
                            {options.length > 2 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeOption(index)}
                                    className="shrink-0 text-muted-foreground hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-1">
                        <Plus className="h-4 w-4" />
                        إضافة خيار
                    </Button>
                </div>
            )}

            {errors?.options && <InputError message={errors.options} />}
        </div>
    );
}
