
'use client';
import Link from 'next/link';
import Image from 'next/image';
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
  const logoUrl = "https://scontent.ftbs4-2.fna.fbcdn.net/v/t39.30808-6/558683570_122110180238999376_2579761153003142071_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=s2XrcrANcUoQ7kNvwHwmG4L&_nc_oc=AdpWSbqhnytnbJJ8GYpPf2Hx0BWMkfsrtEhDToRxgQR1cnBM7TXT8UDo4_sVSDumVI0&_nc_zt=23&_nc_ht=scontent.ftbs4-2.fna&_nc_gid=nFkFYfJcwVuwvLlInXP4vg&_nc_ss=7a30f&oh=00_Afy3nyZBg6FDr6K4oIP8Nmw_P72FHFEk7o7tujIrJNtfAg&oe=69C4D670";
  
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 transition-all hover:opacity-95 group",
        className
      )}
    >
      <div className="relative w-32 h-14 md:w-40 md:h-16 flex items-center justify-center rounded-md border border-slate-100 shadow-sm bg-white shrink-0 group-hover:border-primary/30 transition-colors overflow-hidden">
        <Image 
          src={logoUrl}
          alt="Comfort House Logo"
          fill
          className="object-contain p-1"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className={cn(
          "text-base md:text-lg font-bold font-headline leading-tight tracking-tight uppercase",
          isAdmin ? 'text-sidebar-foreground' : 'text-slate-900'
        )}>
          {dictionary?.companyName || 'Comfort House'}
        </span>
        <span className="text-[11px] md:text-xs font-bold font-headline leading-none text-primary uppercase">
          კომფორტ ჰაუსი
        </span>
      </div>
    </Link>
  );
}
