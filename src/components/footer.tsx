import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Logo from './logo';

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm">Your one-stop shop for home and hardware.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Power Tools</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Hand Tools</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Painting</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Building Materials</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">FAQ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gorgia Online. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
