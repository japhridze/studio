import { getDictionary } from "@/lib/dictionaries";
import ProductClientPage from "./product-client-page";
import { notFound } from "next/navigation";
import { products } from "@/lib/data";

export default async function ProductPage({ params }: { params: { slug: string, lang: 'en' | 'ka' } }) {
    const dictionary = await getDictionary(params.lang);
    const product = products.find(p => p.slug === params.slug);

    if (!product) {
        notFound();
    }
    
    return <ProductClientPage lang={params.lang} dictionary={dictionary} product={product} />;
}
