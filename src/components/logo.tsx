import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  isAdmin?: boolean;
};

export default function Logo({ className, isAdmin = false }: LogoProps) {
  return (
    <Link
      href={isAdmin ? "/admin" : "/"}
      className={cn(
        "flex items-center gap-2 text-xl font-bold font-headline",
        isAdmin ? 'text-sidebar-foreground' : 'text-primary',
        className
      )}
    >
      <Building2 className="h-6 w-6" />
      <span>Gorgia Online</span>
    </Link>
  );
}
