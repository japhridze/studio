'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";
import Footer from "@/components/footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { getDictionary } from "@/lib/dictionaries";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const SUPER_ADMIN_UID = "RUl2KGivfaQpj7Fx6dQfQIZeOg12";

export default function LoginClientPage({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth || !firestore) return;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Ensure super admin role is set
      if (user.uid === SUPER_ADMIN_UID) {
        const userDocRef = doc(firestore, "users", user.uid);
        await setDoc(userDocRef, { role: 'admin' }, { merge: true });
      }
      
      toast({
        title: dictionary.login.loggedInTitle,
        description: dictionary.login.loggedInDescription,
      });
      router.push(`/${lang}/account`);
    } catch (error: any) {
      console.error(error);
      toast({
        title: dictionary.login.loginErrorTitle,
        description: dictionary.login.loginErrorDescription,
        variant: "destructive",
      });
    }
  }

  async function handleGoogleLogin() {
    if (!auth || !firestore) return;
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      const isSuperAdmin = user.uid === SUPER_ADMIN_UID;
      const role = isSuperAdmin ? 'admin' : 'customer';

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            name: user.displayName,
            email: user.email,
            role: role,
        });
      } else {
        const userData = userDoc.data();
        if (isSuperAdmin && userData.role !== 'admin') {
            await setDoc(userDocRef, { role: 'admin' }, { merge: true });
        }
      }

      toast({
        title: dictionary.login.googleSignInTitle,
        description: dictionary.login.googleSignInDescription.replace('{name}', user.displayName || 'user'),
      });
      router.push(`/${lang}/account`);
    } catch (error: any) {
      console.error(error);
      toast({
        title: dictionary.login.errorTitle,
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
            <div className="container mx-auto flex h-16 items-center px-4">
                <Logo lang={lang} dictionary={dictionary} />
            </div>
        </header>
        <main className="flex-1 flex items-center justify-center py-12">
            <Card className="mx-auto max-w-sm w-full">
                <CardHeader>
                <CardTitle className="text-2xl">{dictionary.login.title}</CardTitle>
                <CardDescription>
                    {dictionary.login.description}
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{dictionary.login.emailLabel}</FormLabel>
                                <FormControl>
                                    <Input
                                    type="email"
                                    placeholder="m@example.com"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <div className="flex items-center">
                                    <FormLabel>{dictionary.login.passwordLabel}</FormLabel>
                                    <Link href="#" className="ml-auto inline-block text-sm underline">
                                    {dictionary.login.forgotPassword}
                                    </Link>
                                </div>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? dictionary.login.submitting : dictionary.login.submit}
                        </Button>
                        <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin}>
                            {dictionary.login.google}
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    {dictionary.login.noAccount}{" "}
                    <Link href={`/${lang}/signup`} className="underline">
                    {dictionary.login.signUp}
                    </Link>
                </div>
                </CardContent>
            </Card>
        </main>
        <Footer lang={lang} dictionary={dictionary.footer}/>
    </div>
  );
}
