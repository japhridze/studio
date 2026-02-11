import { redirect } from 'next/navigation'

export default function AdminPage({ params: { lang } }: { params: { lang: string } }) {
  redirect(`/${lang}/admin/products`)
}
