import { getDictionary } from "@/lib/dictionaries";
import SignupClientPage from "./signup-client-page";

export default async function SignupPage({ params: { lang } }: { params: { lang: 'en' | 'ka' }}) {
    const dictionary = await getDictionary(lang);
    return <SignupClientPage lang={lang} dictionary={dictionary} />;
}
