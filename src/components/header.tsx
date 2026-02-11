'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/logo';
import { useCart } from '@/context/cart-context';
import { categories } from '@/lib/data';
import { useAuth, useUser } from '@/firebase';
import type { getDictionary } from '@/lib/dictionaries';
import LanguageSwitcher from './language-switcher';


export default function Header({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
  const { cartCount } = useCart();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push(`/${lang}`);
    }
  };

  const navLinks = [
    { name: dictionary.header.home, href: `/${lang}` },
    ...categories.slice(0, 4).map(c => ({ name: c.name, href: `/${lang}/category/${c.slug}`})),
    { name: dictionary.header.contact, href: '#' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden mr-4">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">{dictionary.header.toggleNav}</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium mt-8">
                        {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {link.name}
                        </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <Logo lang={lang} />
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          <LanguageSwitcher locale={lang} dictionary={dictionary.languageSwitcher}/>
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={dictionary.header.searchPlaceholder}
              className="pl-8 sm:w-[200px] lg:w-[300px]"
            />
          </div>
          
          {user ? (
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
                <DropdownMenuItem asChild>
                  <Link href={`/${lang}/account`}>{dictionary.header.myAccount}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {dictionary.header.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="icon">
              <Link href={`/${lang}/login`}>
                <User className="h-5 w-5" />
                <span className="sr-only">{dictionary.header.login}</span>
              </Link>
            </Button>
          )}

          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href={`/${lang}/cart`}>
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">{dictionary.header.shoppingCart}</span>
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
