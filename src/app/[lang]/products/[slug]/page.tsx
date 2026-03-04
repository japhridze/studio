
import { getDictionary } from "@/lib/dictionaries";
import ProductClientPage from "./product-client-page";

export default async function ProductPage({ params }: { params: Promise<{ slug: string, lang: 'en' | 'ka' }> }) {
    const { lang, slug } = await params;
    const dictionary = await getDictionary(lang);
    
    return <ProductClientPage lang={lang} dictionary={dictionary} slug={slug} />;
}
