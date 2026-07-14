import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import competitions from '@/routes/admin/competitions';
import type { Competition } from '@/types/competition';

export default function DeleteCompetitionDialog({
    competition,
}: {
    competition: Competition;
}) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    function handleDelete() {
        setProcessing(true);
        router.delete(competitions.destroy(competition.id).url, {
            onSuccess: () => setOpen(false),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </motion.span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>تأكيد الحذف</DialogTitle>
                    <DialogDescription>
                        هل أنت متأكد من حذف المسابقة "{competition.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
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
