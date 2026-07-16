import { Mail, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AttemptUserCardProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export default function AttemptUserCard({ user }: AttemptUserCardProps) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold">{user.name}</p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
