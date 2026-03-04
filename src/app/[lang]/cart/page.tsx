
import { getDictionary } from "@/lib/dictionaries";
import CartClientPage from "./cart-client-page";

export default async function CartPage({ params }: { params: Promise<{ lang: 'en' | 'ka' }>}) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    return <CartClientPage lang={lang} dictionary={dictionary} />;
}
