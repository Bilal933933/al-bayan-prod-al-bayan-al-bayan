import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsOptions {
    onSelectOption: (index: number) => void;
    onNext: () => void;
    onPrevious: () => void;
    onFlag: () => void;
    onSubmit?: () => void;
    optionsCount: number;
    isEnabled?: boolean;
}

const arabicMap: Record<string, number> = {
    أ: 0,
    ا: 0,
    ب: 1,
    ج: 2,
    د: 3,
    ه: 4,
    ة: 4,
};

export function useKeyboardShortcuts({
    onSelectOption,
    onNext,
    onPrevious,
    onFlag,
    onSubmit,
    optionsCount,
    isEnabled = true,
}: KeyboardShortcutsOptions) {
    const handler = useCallback(
        (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            if (document.querySelector('[role="dialog"]')) {
                return;
            }

            const key = e.key;
            const num = parseInt(key);

            if (!isNaN(num) && num >= 1 && num <= optionsCount) {
                e.preventDefault();
                onSelectOption(num - 1);

                return;
            }

            if (arabicMap[key] !== undefined && arabicMap[key] < optionsCount) {
                e.preventDefault();
                onSelectOption(arabicMap[key]);

                return;
            }

            switch (key) {
                case 'ArrowRight':
                    e.preventDefault();
                    onPrevious();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    onNext();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    onFlag();
                    break;
                case 's':
                case 'S':
                    if (onSubmit) {
                        e.preventDefault();
                        onSubmit();
                    }

                    break;
            }
        },
        [onSelectOption, onNext, onPrevious, onFlag, onSubmit, optionsCount],
    );

    useEffect(() => {
        if (!isEnabled) {
            return;
        }

        window.addEventListener('keydown', handler);

        return () => window.removeEventListener('keydown', handler);
    }, [handler, isEnabled]);
}
