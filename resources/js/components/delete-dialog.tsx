import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description: string;
    onDelete: () => void;
    processing?: boolean;
}

export default function DeleteDialog({
    open,
    onOpenChange,
    title = 'تأكيد الحذف',
    description,
    onDelete,
    processing: externalProcessing,
}: DeleteDialogProps) {
    const [internalProcessing, setInternalProcessing] = useState(false);

    const processing = externalProcessing ?? internalProcessing;

    function handleDelete() {
        if (externalProcessing === undefined) {
            setInternalProcessing(true);
        }

        onDelete();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        إلغاء
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? 'جاري الحذف...' : 'تأكيد الحذف'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}