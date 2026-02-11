import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Logo from './logo';
import type { getDictionary } from '@/lib/dictionaries';

export default function Footer({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>>['footer'] }) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo lang={lang} />
            <p className="text-muted-foreground text-sm">{dictionary.slogan}</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{dictionary.shop}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Power Tools</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Hand Tools</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Painting</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Building Materials</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{dictionary.support}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">{dictionary.contactUs}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">{dictionary.faq}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">{dictionary.shippingReturns}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">{dictionary.trackOrder}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{dictionary.company}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">{dictionary.aboutUs}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">{dictionary.careers}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">{dictionary.privacyPolicy}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">{dictionary.termsOfService}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>{dictionary.copyright.replace('{year}', currentYear.toString())}</p>
        </div>
      </div>
    </footer>
  );
}
