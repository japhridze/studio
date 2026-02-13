'use client';
import Link from "next/link";
import { useEffect } from "react";
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
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { getDictionary } from "@/lib/dictionaries";
import type { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";


const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SUPER_ADMIN_UID = "RUl2KGivfaQpj7Fx6dQfQIZeOg12";

export default function SignupClientPage({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const { user, isUserLoading } = useUser();
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userDocRef);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) {
      return;
    }

    if (userProfile && userProfile.role === 'admin') {
      toast({
        title: "Already logged in as Admin",
        description: "Redirecting to the admin dashboard.",
      });
      router.replace(`/${lang}/admin`);
    } else if (user) {
      toast({
        title: "Already logged in",
        description: "Redirecting to your account page.",
      });
      router.replace(`/${lang}/account`);
    }
  }, [user, userProfile, isUserLoading, isProfileLoading, router, lang, toast]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth || !firestore) {
        toast({ title: dictionary.signup.errorTitle, description: dictionary.signup.firebaseNotInitialized, variant: "destructive" });
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const role = user.uid === SUPER_ADMIN_UID ? 'admin' : 'customer';
      await setDoc(doc(firestore, "users", user.uid), {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        role: role,
      });

      toast({
        title: dictionary.signup.accountCreatedTitle,
        description: dictionary.signup.accountCreatedDescription,
      });
      router.push(`/${lang}/account`);
    } catch (error: any) {
      console.error(error);
      toast({
        title: dictionary.signup.errorTitle,
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function handleGoogleSignUp() {
    if (!auth || !firestore) {
        toast({ title: dictionary.signup.errorTitle, description: dictionary.signup.firebaseNotInitialized, variant: "destructive" });
        return;
    }
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
        title: dictionary.signup.errorTitle,
        description: error.message,
        variant: "destructive",
      });
    }
  }

  if (isUserLoading || isProfileLoading) {
    return (
       <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
               <div className="container mx-auto flex h-16 items-center px-4">
                   <Logo lang={lang} dictionary={dictionary}/>
               </div>
           </header>
           <main className="flex-1 flex items-center justify-center py-12">
               <Card className="mx-auto max-w-sm w-full">
                   <CardHeader>
                       <Skeleton className="h-7 w-1/4" />
                       <Skeleton className="h-4 w-3/4 mt-2" />
                   </CardHeader>
                   <CardContent className="grid gap-4">
                       <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                               <Skeleton className="h-4 w-1/3" />
                               <Skeleton className="h-10 w-full" />
                           </div>
                            <div className="space-y-2">
                               <Skeleton className="h-4 w-1/3" />
                               <Skeleton className="h-10 w-full" />
                           </div>
                       </div>
                       <div className="space-y-2">
                           <Skeleton className="h-4 w-1/4" />
                           <Skeleton className="h-10 w-full" />
                       </div>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-1/4" />
                           <Skeleton className="h-10 w-full" />
                       </div>
                       <Skeleton className="h-10 w-full" />
                       <Skeleton className="h-10 w-full" />
                   </CardContent>
               </Card>
           </main>
           <Footer lang={lang} dictionary={dictionary.footer}/>
       </div>
   )
 }


  return (
    <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
            <div className="container mx-auto flex h-16 items-center px-4">
                <Logo lang={lang} dictionary={dictionary}/>
            </div>
        </header>
        <main className="flex-1 flex items-center justify-center py-12">
            <Card className="mx-auto max-w-sm w-full">
                <CardHeader>
                <CardTitle className="text-xl">{dictionary.signup.title}</CardTitle>
                <CardDescription>
                    {dictionary.signup.description}
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{dictionary.signup.firstNameLabel}</FormLabel>
                                <FormControl>
                                    <Input placeholder="Max" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{dictionary.signup.lastNameLabel}</FormLabel>
                                <FormControl>
                                    <Input placeholder="Robinson" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{dictionary.signup.emailLabel}</FormLabel>
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
                            <FormLabel>{dictionary.signup.passwordLabel}</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? dictionary.signup.submitting : dictionary.signup.submit}
                        </Button>
                        <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignUp}>
                            {dictionary.signup.google}
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    {dictionary.signup.hasAccount}{" "}
                    <Link href={`/${lang}/login`} className="underline">
                    {dictionary.signup.login}
                    </Link>
                </div>
                </CardContent>
            </Card>
        </main>
        <Footer lang={lang} dictionary={dictionary.footer}/>
    </div>
  );
}
