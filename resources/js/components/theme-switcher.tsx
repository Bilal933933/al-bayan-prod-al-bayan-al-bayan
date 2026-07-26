import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';

export function ThemeSwitcher() {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">تبديل الوضع</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => updateAppearance('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>فاتح</span>
                    {appearance === 'light' && (
                        <span className="mr-auto ml-2 h-4 w-4 rounded-full bg-primary" />
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateAppearance('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>داكن</span>
                    {appearance === 'dark' && (
                        <span className="mr-auto ml-2 h-4 w-4 rounded-full bg-primary" />
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateAppearance('system')}>
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>النظام</span>
                    {appearance === 'system' && (
                        <span className="mr-auto ml-2 h-4 w-4 rounded-full bg-primary" />
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
