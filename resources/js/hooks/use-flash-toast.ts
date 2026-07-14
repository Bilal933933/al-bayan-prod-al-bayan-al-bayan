import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;

            // التنسيق 1: كائن toast صريح (Inertia::flash('toast', [...]))
            const toastData = flash?.toast as FlashToast | undefined;
            if (toastData) {
                toast[toastData.type](toastData.message);
                return;
            }

            // التنسيق 2: مفاتيح مسطّحة (->with('success', '...'))
            const typeMap: Record<string, FlashToast['type']> = {
                success: 'success',
                error: 'error',
                warning: 'warning',
                info: 'info',
            };

            for (const [key, type] of Object.entries(typeMap)) {
                if (flash?.[key]) {
                    toast[type](flash[key]);
                    break;
                }
            }
        });
    }, []);
}
