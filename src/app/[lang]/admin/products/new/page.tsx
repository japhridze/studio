import { getDictionary } from "@/lib/dictionaries";
import NewProductClientPage from "./new-product-client-page";

export default async function NewProductPage({ params: { lang } }: { params: { lang: 'en' | 'ka' }}) {
    const dictionary = await getDictionary(lang);
    return <NewProductClientPage lang={lang} dictionary={dictionary} />;
}
