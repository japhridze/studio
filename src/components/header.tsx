'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/logo';
import { useCart } from '@/context/cart-context';
import { categories } from '@/lib/data';

export default function Header() {
  const { cartCount } = useCart();
  const navLinks = [
    { name: 'Home', href: '/' },
    ...categories.slice(0, 4).map(c => ({ name: c.name, href: `/category/${c.slug}`})),
    { name: 'Contact', href: '#' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden mr-4">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
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
            <Logo />
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
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[200px] lg:w-[300px]"
            />
          </div>
          <Button asChild variant="ghost" size="icon">
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
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
