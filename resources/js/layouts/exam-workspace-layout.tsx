export default function ExamWorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <a
                href="#main-content"
                className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:right-4"
            >
                انتقل للمحتوى الرئيسي
            </a>
            <div
                id="main-content"
                tabIndex={-1}
                className="flex flex-1 flex-col"
            >
                {children}
            </div>
        </div>
    );
}
