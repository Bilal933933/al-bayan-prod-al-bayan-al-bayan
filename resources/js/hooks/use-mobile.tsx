import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

function getMql(): MediaQueryList | undefined {
    if (typeof window === 'undefined') {
        return undefined;
    }

    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}

function mediaQueryListener(callback: (event: MediaQueryListEvent) => void) {
    const mql = getMql();

    if (!mql) {
        return () => {};
    }

    mql.addEventListener('change', callback);

    return () => {
        mql.removeEventListener('change', callback);
    };
}

function isSmallerThanBreakpoint(): boolean {
    return getMql()?.matches ?? false;
}

function getServerSnapshot(): boolean {
    return false;
}

export function useIsMobile(): boolean {
    return useSyncExternalStore(
        mediaQueryListener,
        isSmallerThanBreakpoint,
        getServerSnapshot,
    );
}
