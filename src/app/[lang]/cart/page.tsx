import { getDictionary } from "@/lib/dictionaries";
import CartClientPage from "./cart-client-page";

export default async function CartPage({ params: { lang } }: { params: { lang: 'en' | 'ka' }}) {
    const dictionary = await getDictionary(lang);
    return <CartClientPage lang={lang} dictionary={dictionary} />;
}
