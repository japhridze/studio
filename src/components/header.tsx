
'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, LogOut, ChevronDown, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/logo';
import { useCart } from '@/context/cart-context';
import { categories } from '@/lib/data';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import type { User as UserType } from '@/lib/types';
import type { getDictionary } from '@/lib/dictionaries';
import LanguageSwitcher from './language-switcher';
import { Skeleton } from './ui/skeleton';

const defaultDictionary = {
    header: {
      home: "Home",
      contact: "Contact",
      searchPlaceholder: "Search products...",
      myAccount: "My Account",
      logout: "Logout",
      login: "Login",
      shoppingCart: "Shopping Cart",
      toggleNav: "Toggle navigation menu",
      adminDashboard: "Admin Dashboard"
    },
    categories: {
      "power-tools": "Power Tools",
      "hand-tools": "Hand Tools",
      "painting": "Painting",
      "building-materials": "Building Materials",
      "lighting": "Lighting",
      "safety-equipment": "Safety Equipment"
    },
    subcategories: {
        "drills": "Drills",
        "saws": "Saws",
        "sanders": "Sanders",
        "hammers": "Hammers",
        "wrenches": "Wrenches",
        "screwdrivers": "Screwdrivers"
    },
    languageSwitcher: {
        select: 'Language',
        en: 'English',
        ka: 'Georgian'
    }
};


export default function Header({ lang = 'en', dictionary }: { lang?: 'en' | 'ka', dictionary?: Awaited<ReturnType<typeof getDictionary>> }) {
  const dict = dictionary || defaultDictionary;
  const { cartCount, hasMounted } = useCart();
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserType>(userDocRef);
  
  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push(`/${lang}`);
    }
  };

  const navLinks = [
    { name: dict.header.home, href: `/${lang}` },
    ...categories.slice(0, 4).map(c => ({ 
        name: (dict.categories as any)[c.slug] || c.name, 
        href: `/${lang}/products?category=${c.id}`,
        subcategories: c.subcategories?.map(sc => ({
            name: (dict.subcategories as any)[sc.slug] || sc.name,
            href: `/${lang}/products?category=${c.id}` 
        }))
    })),
    { name: dict.header.contact, href: '#' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-20 items-center px-4">
        <div className="flex items-center">
            {hasMounted ? (
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden mr-4">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">{dict.header.toggleNav}</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid text-lg font-medium mt-8">
                            <Accordion type="single" collapsible className="w-full">
                                {navLinks.map((link) => (
                                    (link.subcategories && link.subcategories.length > 0) ? (
                                        <AccordionItem value={link.name} key={link.name} className="border-b">
                                            <div className="flex w-full items-center justify-between">
                                                <Link
                                                    href={link.href}
                                                    className="flex-1 py-4 text-muted-foreground hover:text-foreground font-normal text-base"
                                                >
                                                    {link.name}
                                                </Link>
                                                <AccordionTrigger className="py-4 pl-4 pr-2 hover:no-underline" />
                                            </div>
                                            <AccordionContent className="pl-8 pb-2">
                                                <ul className="flex flex-col gap-2">
                                                    {link.subcategories.map(subLink => (
                                                        <li key={subLink.name}>
                                                            <Link href={subLink.href} className="block py-2 text-muted-foreground hover:text-foreground text-sm">
                                                                {subLink.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ) : (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="flex items-center py-4 text-muted-foreground hover:text-foreground border-b font-normal text-base"
                                        >
                                            {link.name}
                                        </Link>
                                    )
                                ))}
                            </Accordion>
                        </nav>
                    </SheetContent>
                </Sheet>
            ) : (
                <Button variant="ghost" size="icon" className="lg:hidden mr-4" disabled>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">{dict.header.toggleNav}</span>
                </Button>
            )}
            <Logo lang={lang} dictionary={dict} className="text-2xl" />
        </div>

        <nav className="hidden lg:flex items-center gap-2 text-sm font-bold mx-8">
            {hasMounted ? navLinks.map((link) => (
                (link.subcategories && link.subcategories.length > 0) ? (
                <DropdownMenu key={link.name}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="transition-all hover:text-primary hover:bg-slate-50 h-10 px-4 rounded-xl">
                            {link.name}
                            <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="rounded-xl border-slate-100 shadow-xl">
                        {link.subcategories.map(subLink => (
                            <DropdownMenuItem key={subLink.name} asChild className="rounded-lg">
                                <Link href={subLink.href}>{subLink.name}</Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link
                key={link.name}
                href={link.href}
                className="transition-all hover:text-primary px-4 py-2 hover:bg-slate-50 rounded-xl"
                >
                {link.name}
                </Link>
            )
            )) : null}
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          <div className="relative hidden xl:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder={dict.header.searchPlaceholder}
              className="pl-10 sm:w-[200px] lg:w-[350px] bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-primary/20 h-11"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {hasMounted ? (
                <LanguageSwitcher locale={lang as 'en' | 'ka'} dictionary={dict.languageSwitcher}/>
            ) : (
                <Skeleton className="h-10 w-[100px] rounded-xl" />
            )}
            
            {hasMounted ? (
                user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="overflow-hidden rounded-xl h-11 w-11 hover:bg-slate-50"
                    >
                        <Avatar className="h-9 w-9 border-2 border-slate-100">
                        <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-slate-100">
                    <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userProfile?.role === 'admin' && (
                        <DropdownMenuItem asChild className="rounded-lg">
                            <Link href={`/${lang}/admin`}>
                                <Wrench className="mr-2 h-4 w-4" />
                                {dict.header.adminDashboard || "Admin Dashboard"}
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild className="rounded-lg">
                        <Link href={`/${lang}/account`}>{dict.header.myAccount}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        {dict.header.logout}
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                ) : (
                <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-xl hover:bg-slate-50">
                    <Link href={`/${lang}/login`}>
                    <User className="h-5 w-5 text-slate-600" />
                    <span className="sr-only">{dict.header.login}</span>
                    </Link>
                </Button>
                )
            ) : (
                <Skeleton className="h-11 w-11 rounded-xl" />
            )}

            <Button asChild variant="ghost" size="icon" className="relative h-11 w-11 rounded-xl hover:bg-slate-50">
                <Link href={`/${lang}/cart`}>
                <ShoppingCart className="h-5 w-5 text-slate-600" />
                <span className="sr-only">{dict.header.shoppingCart}</span>
                {hasMounted && cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-1 bg-accent text-white font-bold border-2 border-white">{cartCount}</Badge>
                )}
                </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
