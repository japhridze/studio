
import { getDictionary } from "@/lib/dictionaries";
import NewProductClientPage from "./new-product-client-page";

export default async function NewProductPage({ params }: { params: Promise<{ lang: 'en' | 'ka' }>}) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    return <NewProductClientPage lang={lang} dictionary={dictionary} />;
}
