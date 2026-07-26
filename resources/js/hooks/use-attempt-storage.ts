import { useCallback, useSyncExternalStore } from 'react';

function readValue<T>(key: string, defaultValue: T): T {
    try {
        const raw = localStorage.getItem(key);

        if (raw === null) {
            return defaultValue;
        }

        return JSON.parse(raw) as T;
    } catch {
        return defaultValue;
    }
}

function getSnapshot(key: string) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function subscribe(key: string, onStoreChange: () => void) {
    window.addEventListener('storage', onStoreChange);

    return () => window.removeEventListener('storage', onStoreChange);
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
    const raw = useSyncExternalStore(
        (cb) => subscribe(key, cb),
        () => getSnapshot(key),
        () => null,
    );

    let value: T = defaultValue;

    try {
        if (raw !== null) {
            const parsed = JSON.parse(raw) as T;
            value = parsed;
        }
    } catch {
        value = defaultValue;
    }

    const setValue = useCallback(
        (fnOrValue: T | ((prev: T) => T)) => {
            try {
                const prev = readValue(key, defaultValue);
                const next =
                    fnOrValue instanceof Function ? fnOrValue(prev) : fnOrValue;

                localStorage.setItem(key, JSON.stringify(next));
                window.dispatchEvent(new StorageEvent('storage', { key }));
            } catch {
                // localStorage full or unavailable
            }
        },
        [key, defaultValue],
    );

    return [value, setValue] as const;
}

export function removeFromStorage(key: string) {
    try {
        localStorage.removeItem(key);
        window.dispatchEvent(new StorageEvent('storage', { key }));
    } catch {
        // unavailable
    }
}
