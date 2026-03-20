'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, LogOut, ChevronDown, Wrench, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { cn } from '@/lib/utils';

export default function Header({ lang = 'en', dictionary }: { lang?: 'en' | 'ka', dictionary?: Awaited<ReturnType<typeof getDictionary>> }) {
  const dict = dictionary || ({} as any);
  const { cartCount, hasMounted } = useCart();
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

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
    ...categories.map(c => ({ 
        name: (dict.categories as any)[c.slug] || c.name, 
        href: `/${lang}/products?category=${c.id}`
    }))
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 hidden md:block">
          <div className="container mx-auto px-4 flex justify-end gap-6 font-medium">
             <Link href="#" className="hover:text-primary transition-colors">{dict.header?.contact || "Contact"}</Link>
             <Link href="#" className="hover:text-primary transition-colors">FAQ</Link>
             <Link href="#" className="hover:text-primary transition-colors">Shipping</Link>
          </div>
      </div>

      <div className="container mx-auto flex h-20 items-center px-4 gap-4">
        <div className="flex items-center gap-4">
            {hasMounted ? (
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid text-lg font-medium mt-8">
                            <Accordion type="single" collapsible className="w-full">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/${lang}/products?category=${cat.id}`}
                                        className="flex items-center py-4 text-muted-foreground hover:text-foreground border-b font-normal text-base"
                                    >
                                        {(dict.categories as any)[cat.slug] || cat.name}
                                    </Link>
                                ))}
                            </Accordion>
                        </nav>
                    </SheetContent>
                </Sheet>
            ) : (
                <Button variant="ghost" size="icon" className="lg:hidden" disabled>
                    <Menu className="h-6 w-6" />
                </Button>
            )}
            <Logo lang={lang} dictionary={dict} className="text-2xl mr-2" />
        </div>

        {/* Catalog Dropdown - Gorgia Style */}
        <div 
            className="hidden lg:block relative"
            onMouseEnter={() => setIsCatalogOpen(true)}
            onMouseLeave={() => setIsCatalogOpen(false)}
        >
            <Button 
                className={cn(
                    "bg-[#0091d5] hover:bg-[#007fb8] text-white font-bold h-11 px-6 rounded-md flex items-center gap-2 transition-all",
                    isCatalogOpen && "rounded-b-none"
                )}
            >
                <Menu className="h-5 w-5" />
                {dict.header?.catalog || "Catalog"}
                <ChevronDown className={cn("h-4 w-4 transition-transform", isCatalogOpen && "rotate-180")} />
            </Button>

            {isCatalogOpen && (
                <div className="absolute top-11 left-0 w-64 bg-white shadow-2xl border border-slate-100 z-[100] rounded-b-xl overflow-hidden py-0">
                    <div className="flex flex-col">
                        {categories.map((cat) => (
                            <Link 
                                key={cat.id}
                                href={`/${lang}/products?category=${cat.id}`}
                                className={cn(
                                    "flex items-center justify-between p-3.5 text-[13px] font-bold border-b border-slate-50 transition-all group",
                                    "text-slate-700 hover:bg-slate-50 hover:text-[#0091d5]"
                                )}
                            >
                                <span>{(dict.categories as any)[cat.slug] || cat.name}</span>
                                <ChevronRight className={cn(
                                    "h-4 w-4 transition-transform group-hover:translate-x-1",
                                    "text-slate-300"
                                )} />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="flex-1 max-w-xl mx-auto relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder={dict.header?.searchPlaceholder}
              className="pl-10 w-full bg-slate-50 border-slate-100 rounded-md focus-visible:ring-[#0091d5]/20 h-11 text-sm"
            />
        </div>

        <div className="flex items-center gap-2 ml-auto font-bold text-xs uppercase tracking-tight text-slate-600">
          <nav className="hidden xl:flex items-center gap-1 mr-4">
              {navLinks.map((link) => (
                  <Link
                      key={link.name}
                      href={link.href}
                      className="px-3 py-2 hover:text-[#0091d5] transition-colors"
                  >
                      {link.name}
                  </Link>
              ))}
          </nav>

          <div className="flex items-center gap-1">
            {hasMounted ? (
                <LanguageSwitcher locale={lang as 'en' | 'ka'} dictionary={dict.languageSwitcher}/>
            ) : (
                <Skeleton className="h-10 w-[100px] rounded-md" />
            )}
            
            {hasMounted ? (
                user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-md hover:bg-slate-50"
                    >
                        <Avatar className="h-8 w-8 border border-slate-100">
                            <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback className="bg-slate-100 text-[#0091d5] font-bold">{user.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-md shadow-xl border-slate-100 w-48">
                        <DropdownMenuLabel className="font-bold">{user.displayName || user.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {userProfile?.role === 'admin' && (
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/${lang}/admin`}>
                                    <Wrench className="mr-2 h-4 w-4" />
                                    {dict.header?.adminDashboard}
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/${lang}/account`}>{dict.header?.myAccount}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:bg-red-50 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            {dict.header?.logout}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                ) : (
                <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-md hover:bg-slate-50">
                    <Link href={`/${lang}/login`}>
                        <User className="h-5 w-5 text-slate-600" />
                    </Link>
                </Button>
                )
            ) : (
                <Skeleton className="h-11 w-11 rounded-md" />
            )}

            <Button asChild variant="ghost" size="icon" className="relative h-11 w-11 rounded-md hover:bg-slate-50">
                <Link href={`/${lang}/cart`}>
                    <ShoppingCart className="h-5 w-5 text-slate-600" />
                    {hasMounted && cartCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-1 bg-red-600 text-white font-bold border-2 border-white">{cartCount}</Badge>
                    )}
                </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
