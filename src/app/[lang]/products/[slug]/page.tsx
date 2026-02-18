import { getDictionary } from "@/lib/dictionaries";
import ProductClientPage from "./product-client-page";

export default async function ProductPage({ params }: { params: { slug: string, lang: 'en' | 'ka' } }) {
    const dictionary = await getDictionary(params.lang);
    
    return <ProductClientPage lang={params.lang} dictionary={dictionary} slug={params.slug} />;
}
