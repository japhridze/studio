import { getDictionary } from "@/lib/dictionaries";
import AccountClientPage from "./account-client-page";

export default async function AccountPage({ params: { lang } }: { params: { lang: 'en' | 'ka' }}) {
    const dictionary = await getDictionary(lang);
    return <AccountClientPage lang={lang} dictionary={dictionary} />;
}
