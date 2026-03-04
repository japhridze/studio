
import { getDictionary } from "@/lib/dictionaries";
import LoginClientPage from "./login-client-page";

export default async function LoginPage({ params }: { params: Promise<{ lang: 'en' | 'ka' }>}) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    return <LoginClientPage lang={lang} dictionary={dictionary} />;
}
