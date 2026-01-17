'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Users,
    UserPlus,
    Layers,
    Grid3X3,
    Target,
    Wallet,
    LayoutDashboard,
    TrendingUp,
    History,
    ChevronDown,
    Menu,
    X,
} from 'lucide-react';

interface NavItem {
    label: string;
    icon: React.ReactNode;
    href?: string;
    children?: { label: string; icon: React.ReactNode; href: string }[];
}

const navItems: NavItem[] = [
    {
        label: 'Clientes',
        icon: <Users className="h-5 w-5" />,
        children: [
            { label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, href: '/dashboard' },
            { label: 'Projeção', icon: <TrendingUp className="h-4 w-4" />, href: '/projection' },
            { label: 'Histórico', icon: <History className="h-4 w-4" />, href: '/history' },
        ],
    },
    {
        label: 'Prospects',
        icon: <UserPlus className="h-5 w-5" />,
        children: [],
    },
    {
        label: 'Consolidação',
        icon: <Layers className="h-5 w-5" />,
        children: [],
    },
    {
        label: 'CRM',
        icon: <Grid3X3 className="h-5 w-5" />,
        children: [],
    },
    {
        label: 'Captação',
        icon: <Target className="h-5 w-5" />,
        children: [],
    },
    {
        label: 'Financeiro',
        icon: <Wallet className="h-5 w-5" />,
        children: [],
    },
];

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const [openItems, setOpenItems] = useState<string[]>(['Clientes']);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleItem = (label: string) => {
        setOpenItems((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label]
        );
    };

    const isActive = (href: string) => pathname === href;
    const hasActiveChild = (item: NavItem) =>
        item.children?.some((child) => pathname === child.href);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar text-sidebar-foreground lg:hidden"
                aria-label="Toggle menu"
            >
                {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed lg:sticky top-0 left-0 z-40 h-screen w-[260px] flex flex-col',
                    'bg-sidebar text-sidebar-foreground',
                    'rounded-r-[2rem] lg:rounded-r-[2rem]',
                    'transition-transform duration-300 ease-in-out',
                    'lg:translate-x-0',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full',
                    className
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-center py-8 px-6">
                    <div className="border border-primary/50 rounded-full px-6 py-2 bg-sidebar hover:border-primary transition-colors">
                        <Image
                            src="/logo-anka.png"
                            alt="Anka"
                            width={100}
                            height={32}
                            className="h-8 w-auto"
                            priority
                        />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <div key={item.label}>
                            {item.children && item.children.length > 0 ? (
                                <Collapsible
                                    open={openItems.includes(item.label)}
                                    onOpenChange={() => toggleItem(item.label)}
                                >
                                    <CollapsibleTrigger
                                        className={cn(
                                            'flex items-center w-full gap-3 px-4 py-3 rounded-lg',
                                            'text-sidebar-foreground/80 hover:text-sidebar-foreground',
                                            'hover:bg-sidebar-accent/50 transition-colors',
                                            'text-sm font-medium',
                                            hasActiveChild(item) && 'text-sidebar-foreground'
                                        )}
                                    >
                                        {item.icon}
                                        <span className="flex-1 text-left">{item.label}</span>
                                        <ChevronDown
                                            className={cn(
                                                'h-4 w-4 transition-transform duration-200',
                                                openItems.includes(item.label) && 'rotate-180'
                                            )}
                                        />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pl-4 space-y-1 pt-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={cn(
                                                    'flex items-center gap-3 px-4 py-2.5 rounded-lg',
                                                    'text-sidebar-foreground/60 hover:text-sidebar-foreground',
                                                    'hover:bg-sidebar-accent/30 transition-colors',
                                                    'text-sm',
                                                    isActive(child.href) &&
                                                    'text-sidebar-foreground bg-sidebar-accent/40'
                                                )}
                                            >
                                                {child.icon}
                                                <span>{child.label}</span>
                                            </Link>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            ) : (
                                <button
                                    className={cn(
                                        'flex items-center w-full gap-3 px-4 py-3 rounded-lg',
                                        'text-sidebar-foreground/80 hover:text-sidebar-foreground',
                                        'hover:bg-sidebar-accent/50 transition-colors',
                                        'text-sm font-medium'
                                    )}
                                >
                                    {item.icon}
                                    <span className="flex-1 text-left">{item.label}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Footer spacer */}
                <div className="p-4" />
            </aside>
        </>
    );
}
