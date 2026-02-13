import { redirect } from 'next/navigation';

export default function DeprecatedCartPage() {
  redirect('/en/cart');
}
