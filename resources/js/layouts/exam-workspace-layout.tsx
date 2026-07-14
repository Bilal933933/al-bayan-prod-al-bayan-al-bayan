export default function ExamWorkspaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-50/80">
            {children}
        </div>
    );
}
