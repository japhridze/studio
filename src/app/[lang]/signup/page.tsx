
import { getDictionary } from "@/lib/dictionaries";
import SignupClientPage from "./signup-client-page";

export default async function SignupPage({ params }: { params: Promise<{ lang: 'en' | 'ka' }>}) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    return <SignupClientPage lang={lang} dictionary={dictionary} />;
}
