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
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

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
        toast({ title: "Error", description: "Firebase not initialized.", variant: "destructive" });
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      await setDoc(doc(firestore, "users", user.uid), {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        role: "customer",
      });

      toast({
        title: "Account Created",
        description: "Your account has been created successfully.",
      });
      router.push("/account");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function handleGoogleSignUp() {
    if (!auth || !firestore) {
        toast({ title: "Error", description: "Firebase not initialized.", variant: "destructive" });
        return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            name: user.displayName,
            email: user.email,
            role: "customer",
        });
      }

      toast({
        title: "Signed In",
        description: `Welcome, ${user.displayName}!`,
      });
      router.push("/account");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
            <div className="container mx-auto flex h-16 items-center px-4">
                <Logo />
            </div>
        </header>
        <main className="flex-1 flex items-center justify-center py-12">
            <Card className="mx-auto max-w-sm w-full">
                <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
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
                                <FormLabel>First name</FormLabel>
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
                                <FormLabel>Last name</FormLabel>
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
                            <FormLabel>Email</FormLabel>
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Creating account...' : 'Create an account'}
                        </Button>
                        <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignUp}>
                            Sign up with Google
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline">
                    Login
                    </Link>
                </div>
                </CardContent>
            </Card>
        </main>
        <Footer />
    </div>
  );
}
