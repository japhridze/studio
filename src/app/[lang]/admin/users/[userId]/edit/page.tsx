
import { getDictionary } from "@/lib/dictionaries";
import EditUserClientPage from "./edit-user-client-page";

export default async function EditUserPage({ params }: { params: Promise<{ lang: 'en' | 'ka', userId: string }>}) {
    const { lang, userId } = await params;
    const dictionary = await getDictionary(lang);
    return <EditUserClientPage dictionary={dictionary} lang={lang} userId={userId} />;
}
