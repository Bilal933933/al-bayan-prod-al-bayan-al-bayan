import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    History,
    Library,
    Medal,
    Menu,
    Play,
    Search,
    Trophy,
    XIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { GlobalSearch } from '@/components/student/global-search';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard, leaderboard } from '@/routes/student';
import attempts from '@/routes/student/attempts';
import competitions from '@/routes/student/competitions';
import results from '@/routes/student/results';
import topics from '@/routes/student/topics';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
    {
        title: 'المسابقات المتاحة',
        href: competitions.index().url,
        icon: Trophy,
    },
    {
        title: 'التدريب الحر',
        href: topics.index().url,
        icon: BookOpen,
    },
    {
        title: 'محاولاتي',
        href: attempts.index().url,
        icon: History,
    },
    {
        title: 'نتائجي',
        href: results.index().url,
        icon: BarChart3,
    },
    {
        title: 'المتصدرين',
        href: leaderboard(),
        icon: Medal,
    },
    {
        title: 'مركز المعرفة',
        href: '/guide/journey',
        icon: Library,
    },
];

const activeItemStyles = 'text-foreground dark:bg-muted dark:text-foreground';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();

    const [isVisible, setIsVisible] = useState(true);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastScrollY.current;

            if (scrollingDown && currentScrollY > 80) {
                setIsVisible(false);
            } else if (!scrollingDown) {
                setIsVisible(true);
            }

            setScrolled(currentScrollY > 8);
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header
                className={cn(
                    'fixed inset-x-0 top-0 z-50 transition-transform duration-300',
                    isVisible ? 'translate-y-0' : '-translate-y-full',
                    scrolled && 'shadow-sm',
                )}
            >
                <div className="border-b border-sidebar-border/80 bg-background/95 backdrop-blur-xs transition-shadow">
                    <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                        {/* Mobile Menu */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="me-2 h-[34px] w-[34px]"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="flex h-full w-64 flex-col items-stretch justify-between bg-background [&>button:last-child]:hidden"
                                >
                                    <SheetTitle className="sr-only">
                                        Navigation menu
                                    </SheetTitle>
                                    <div className="flex items-center justify-between px-4 pt-4">
                                        <AppLogoIcon className="h-6 w-6 fill-current text-foreground" />
                                        <SheetClose className="rounded-xs opacity-70 transition-opacity hover:opacity-100">
                                            <XIcon className="size-4" />
                                            <span className="sr-only">
                                                إغلاق
                                            </span>
                                        </SheetClose>
                                    </div>
                                    <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                        <div className="flex h-full flex-col justify-between text-sm">
                                            <div className="flex flex-col space-y-4">
                                                {mainNavItems.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className={cn(
                                                            'flex items-center gap-2 rounded-lg p-2 font-medium transition-colors',
                                                            whenCurrentUrl(
                                                                item.href,
                                                                'bg-accent/20 text-accent-foreground',
                                                            ),
                                                        )}
                                                    >
                                                        {item.icon && (
                                                            <item.icon className="h-5 w-5" />
                                                        )}
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <Link
                            href={dashboard()}
                            prefetch
                            className="flex items-center gap-2"
                        >
                            <AppLogo />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="ms-6 hidden h-full items-center gap-6 lg:flex">
                            <NavigationMenu className="flex h-full items-stretch">
                                <NavigationMenuList className="flex h-full items-stretch gap-2">
                                    {mainNavItems.map((item, index) => (
                                        <NavigationMenuItem
                                            key={index}
                                            className="relative flex h-full items-center"
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    whenCurrentUrl(
                                                        item.href,
                                                        activeItemStyles,
                                                    ),
                                                    'h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                {item.icon && (
                                                    <item.icon className="me-2 h-4 w-4" />
                                                )}
                                                {item.title}
                                            </Link>
                                            <div
                                                className={cn(
                                                    'absolute start-0 bottom-0 h-0.5 translate-y-px bg-accent transition-all duration-200',
                                                    isCurrentUrl(item.href)
                                                        ? 'w-full opacity-100'
                                                        : 'w-0 opacity-0',
                                                )}
                                            />
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <div className="ms-auto flex items-center gap-2">
                            <div className="relative flex items-center space-x-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="group h-9 w-9 cursor-pointer"
                                    onClick={() => setSearchOpen(true)}
                                    title="بحث (Ctrl+K)"
                                    aria-label="بحث"
                                >
                                    <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                                </Button>
                                <ThemeSwitcher />
                            </div>
                            <span className="mx-1 h-5 w-px bg-border" />
                            {page.component !== 'student/attempts/create' && (
                                <Link href={attempts.create().url}>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="gap-1.5"
                                    >
                                        <Play className="h-4 w-4" />
                                        بدء محاولة
                                    </Button>
                                </Link>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="size-10 rounded-full p-1"
                                    >
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage
                                                src={auth.user?.avatar}
                                                alt={auth.user?.name}
                                            />
                                            <AvatarFallback className="rounded-lg bg-muted text-foreground">
                                                {getInitials(
                                                    auth.user?.name ?? '',
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="end"
                                >
                                    {auth.user && (
                                        <UserMenuContent user={auth.user} />
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                {breadcrumbs.length > 1 && (
                    <div className="flex w-full border-t border-sidebar-border/40 bg-muted/20">
                        <div className="mx-auto flex h-10 w-full items-center justify-start px-4 text-muted-foreground md:max-w-7xl">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                    </div>
                )}
            </header>

            <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
        </>
    );
}
