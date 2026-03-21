
'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getDictionary } from '@/lib/dictionaries';
import { Home } from 'lucide-react';

type LogoProps = {
  className?: string;
  isAdmin?: boolean;
  lang?: 'en' | 'ka';
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
};

export default function Logo({ className, isAdmin = false, lang = 'en', dictionary }: LogoProps) {
  const href = isAdmin ? `/${lang}/admin` : `/${lang}`;
  
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 transition-all hover:opacity-90 group",
        className
      )}
    >
      <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 border-slate-100 shadow-sm bg-white shrink-0 group-hover:border-primary/20">
        <Home className="w-5 h-5 md:w-6 md:h-6 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className={cn(
          "text-sm md:text-base font-bold font-headline leading-tight tracking-tight uppercase",
          isAdmin ? 'text-sidebar-foreground' : 'text-slate-900'
        )}>
          {dictionary?.companyName || 'Comfort House'}
        </span>
        <span className="text-[10px] md:text-[11px] font-bold font-headline leading-none text-primary uppercase">
          კომფორტ ჰაუსი
        </span>
      </div>
    </Link>
  );
}
