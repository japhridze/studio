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
  const { cartCount } = useCart();
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserType>(userDocRef);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

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
        href: `/${lang}/products`,
        subcategories: c.subcategories?.map(sc => ({
            name: (dict.subcategories as any)[sc.slug] || sc.name,
            href: `/${lang}/products` // for now, point to the same page
        }))
    })),
    { name: dict.header.contact, href: '#' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
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
            <Logo lang={lang} dictionary={dict} />
        </div>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium mx-auto">
            {hasMounted ? navLinks.map((link) => (
                (link.subcategories && link.subcategories.length > 0) ? (
                <DropdownMenu key={link.name}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="transition-colors hover:text-primary data-[state=open]:bg-accent data-[state=open]:text-accent-foreground h-auto px-3 py-2">
                            {link.name}
                            <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {link.subcategories.map(subLink => (
                            <DropdownMenuItem key={subLink.name} asChild>
                                <Link href={subLink.href}>{subLink.name}</Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-primary px-3 py-2"
                >
                {link.name}
                </Link>
            )
            )) : navLinks.map(link => (
                <Link
                    key={link.name}
                    href={link.href}
                    className="transition-colors hover:text-primary px-3 py-2"
                >
                    {link.name}
                </Link>
            ))}
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          <LanguageSwitcher locale={lang} dictionary={dict.languageSwitcher}/>
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={dict.header.searchPlaceholder}
              className="pl-8 sm:w-[200px] lg:w-[300px]"
            />
          </div>
          
          {hasMounted ? (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userProfile?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                        <Link href={`/${lang}/admin`}>
                            <Wrench className="mr-2 h-4 w-4" />
                            {dict.header.adminDashboard || "Admin Dashboard"}
                        </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href={`/${lang}/account`}>{dict.header.myAccount}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {dict.header.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" size="icon">
                <Link href={`/${lang}/login`}>
                  <User className="h-5 w-5" />
                  <span className="sr-only">{dict.header.login}</span>
                </Link>
              </Button>
            )
          ) : (
             <div className="h-10 w-10 flex items-center justify-center">
                <Skeleton className="h-8 w-8 rounded-full" />
             </div>
          )}

          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href={`/${lang}/cart`}>
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">{dict.header.shoppingCart}</span>
              {cartCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{cartCount}</Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
