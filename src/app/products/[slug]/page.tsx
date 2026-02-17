import { redirect } from 'next/navigation';

export default function DeprecatedProductPage({ params }: { params: { slug: string } }) {
  redirect(`/en/products/${params.slug}`);
}
