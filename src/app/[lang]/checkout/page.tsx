
import { getDictionary } from "@/lib/dictionaries";
import CheckoutClientPage from "./checkout-client-page";

export default async function CheckoutPage({ params }: { params: Promise<{ lang: 'en' | 'ka' }>}) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    return <CheckoutClientPage lang={lang} dictionary={dictionary} />;
}
