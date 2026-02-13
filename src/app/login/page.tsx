import { redirect } from 'next/navigation';

export default function DeprecatedLoginPage() {
  redirect('/en/login');
}
