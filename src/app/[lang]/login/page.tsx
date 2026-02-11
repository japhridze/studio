import { getDictionary } from "@/lib/dictionaries";
import LoginClientPage from "./login-client-page";

export default async function LoginPage({ params: { lang } }: { params: { lang: 'en' | 'ka' }}) {
    const dictionary = await getDictionary(lang);
    return <LoginClientPage lang={lang} dictionary={dictionary} />;
}
