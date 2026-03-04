
import { getDictionary } from "@/lib/dictionaries";
import ProductsClientPage from "./products-client-page";

export default async function ProductsPage({ params }: { params: Promise<{ lang: 'en' | 'ka' }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    return <ProductsClientPage lang={lang} dictionary={dictionary} />;
}
