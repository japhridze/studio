import { getDictionary } from "@/lib/dictionaries";
import ProductsClientPage from "./products-client-page";

export default async function ProductsPage({ params: { lang } }: { params: { lang: 'en' | 'ka' }}) {
    const dictionary = await getDictionary(lang);
    return <ProductsClientPage lang={lang} dictionary={dictionary} />;
}
