import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDictionary } from '@/lib/dictionaries';

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
        "flex items-center gap-2 text-xl font-bold font-headline",
        isAdmin ? 'text-sidebar-foreground' : 'text-primary',
        className
      )}
    >
      <Building2 className="h-6 w-6" />
      <span>{dictionary?.companyName || 'Comfort House'}</span>
    </Link>
  );
}
