import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error('ErrorBoundary caught:', error, info.componentStack);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-background p-8" dir="rtl">
                    <div className="max-w-md text-center">
                        <h1 className="mb-2 text-2xl font-bold text-foreground">حدث خطأ غير متوقع</h1>
                        <p className="mb-6 text-muted-foreground">
                            حاول تحديث الصفحة أو العودة لاحقاً.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            تحديث الصفحة
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
