
import Link from 'next/link';
import { Facebook, Twitter, Instagram, MapPin } from 'lucide-react';
import Logo from './logo';
import type { getDictionary } from '@/lib/dictionaries';

const defaultDictionary = {
  slogan: "Your one-stop shop for home and hardware.",
  address: "JJJM+25R, Sulkhan-Saba Orbeliani St, Batumi",
  shop: "Shop",
  support: "Support",
  company: "Company",
  contactUs: "Contact Us",
  faq: "FAQ",
  shippingReturns: "Shipping & Returns",
  trackOrder: "Track Order",
  aboutUs: "About Us",
  careers: "Careers",
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  copyright: "© {year} Comfort House. All Rights Reserved."
};

export default function Footer({ lang = 'en', dictionary }: { lang?: 'en' | 'ka', dictionary?: Awaited<ReturnType<typeof getDictionary>>['footer'] }) {
  const currentYear = new Date().getFullYear();
  const dict = dictionary || (defaultDictionary as any);

  // Google Maps search URL based on the address
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dict.address || defaultDictionary.address)}`;

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo lang={lang} />
            <p className="text-muted-foreground text-sm">{dict.slogan}</p>
            {dict.address && (
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-xs flex items-center gap-2 hover:text-primary transition-colors w-fit"
              >
                <MapPin size={14} className="text-primary shrink-0" />
                <span>{dict.address}</span>
              </a>
            )}
            <div className="flex space-x-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{dict.shop}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Power Tools</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Hand Tools</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Painting</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Building Materials</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{dict.support}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">{dict.contactUs}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">{dict.faq}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">{dict.shippingReturns}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">{dict.trackOrder}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{dict.company}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">{dict.aboutUs}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">{dict.careers}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">{dict.privacyPolicy}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">{dict.termsOfService}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>{dict.copyright.replace('{year}', currentYear.toString())}</p>
        </div>
      </div>
    </footer>
  );
}
