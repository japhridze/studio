
import { getDictionary } from "@/lib/dictionaries";
import AccountClientPage from "./account-client-page";

export default async function AccountPage({ params }: { params: Promise<{ lang: 'en' | 'ka' }>}) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    return <AccountClientPage lang={lang} dictionary={dictionary} />;
}
