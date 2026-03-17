
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { useUser, useFirestore } from "@/firebase";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { getDictionary } from "@/lib/dictionaries";
import { createBankOrder } from "./actions";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(5, "Shipping address is required"),
  city: z.string().min(1, "City is required"),
  phone: z.string().min(9, "Valid phone number is required"),
  paymentMethod: z.enum(["bog"]),
});

export default function CheckoutClientPage({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
  const { user, isUserLoading } = useUser();
  const { cartItems, cartTotal, clearCart } = useCart();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "Batumi",
      phone: "",
      paymentMethod: "bog",
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({
          title: dictionary.checkout.loginRequired,
          variant: "destructive"
      });
      router.push(`/${lang}/login?redirect=checkout`);
    }
  }, [user, isUserLoading, router, lang, dictionary, toast]);

  if (isUserLoading) {
      return <div className="min-h-screen flex items-center justify-center"><Skeleton className="h-20 w-64" /></div>;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore || cartItems.length === 0) return;
    
    setIsSubmitting(true);
    try {
        // 1. Create Order in Firestore (Pending status)
        const orderData = {
            userId: user.uid,
            userName: `${values.firstName} ${values.lastName}`,
            orderDate: new Date().toISOString(),
            totalAmount: cartTotal,
            status: "pending",
            shippingAddress: `${values.address}, ${values.city}`,
            billingAddress: `${values.address}, ${values.city}`,
            shippingMethod: "Standard",
            paymentMethod: "Bank of Georgia",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const orderRef = await addDoc(collection(firestore, "orders"), orderData);
        
        // 2. Add Order Items
        const itemsPromises = cartItems.map(item => {
            return addDoc(collection(firestore, "orders", orderRef.id, "items"), {
                orderId: orderRef.id,
                productId: item.id,
                quantity: item.quantity,
                pricePerUnit: item.price,
                subtotal: item.price * item.quantity,
            });
        });

        await Promise.all(itemsPromises);
        
        // 3. Initiate Bank Payment Redirect
        const paymentResult = await createBankOrder(cartTotal, orderRef.id, lang);
        
        if (paymentResult.success && paymentResult.redirectUrl) {
            // In a real scenario, we redirect to the bank here
            window.location.href = paymentResult.redirectUrl;
        } else {
            // Fallback if payment initiation fails but order was created
            setOrderId(orderRef.id);
            clearCart();
            toast({
                title: dictionary.checkout.successTitle,
                description: dictionary.checkout.successDescription.replace("{id}", orderRef.id),
            });
        }

    } catch (error: any) {
        console.error("Checkout failed:", error);
        toast({
            variant: "destructive",
            title: "Checkout Error",
            description: error.message,
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (orderId) {
      return (
        <div className="flex flex-col min-h-screen">
            <Header lang={lang} dictionary={dictionary} />
            <main className="flex-1 flex items-center justify-center py-20 bg-slate-50">
                <Card className="max-w-md w-full text-center p-8 border-none shadow-lg rounded-2xl">
                    <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-4">{dictionary.checkout.successTitle}</CardTitle>
                    <p className="text-slate-600 mb-8">{dictionary.checkout.successDescription.replace("{id}", orderId)}</p>
                    <div className="space-y-4">
                        <Button asChild className="w-full h-12 bg-primary hover:bg-primary/90">
                            <Link href={`/${lang}/account`}>{dictionary.header.myAccount}</Link>
                        </Button>
                        <Button variant="ghost" asChild className="w-full">
                            <Link href={`/${lang}`}>{dictionary.checkout.backToStore}</Link>
                        </Button>
                    </div>
                </Card>
            </main>
            <Footer lang={lang} dictionary={dictionary.footer} />
        </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header lang={lang} dictionary={dictionary} />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-8">{dictionary.checkout.title}</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle>{dictionary.checkout.shippingInfo}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{dictionary.checkout.firstName}</FormLabel>
                              <FormControl><Input placeholder="John" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{dictionary.checkout.lastName}</FormLabel>
                              <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{dictionary.checkout.address}</FormLabel>
                            <FormControl><Input placeholder="Street name and number" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{dictionary.checkout.city}</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{dictionary.checkout.phone}</FormLabel>
                              <FormControl><Input placeholder="+995 555 000 000" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <FormLabel className="text-lg font-bold">{dictionary.checkout.paymentMethod}</FormLabel>
                        <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid gap-4"
                                        >
                                            <div className="flex items-center space-x-3 space-y-0 bg-slate-50 p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-primary/50 transition-colors">
                                                <RadioGroupItem value="bog" id="bog" />
                                                <Label htmlFor="bog" className="flex-1 flex items-center justify-between cursor-pointer">
                                                    <span className="font-semibold">{dictionary.checkout.bogPayment}</span>
                                                    <CreditCard className="h-5 w-5 text-slate-400" />
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-bold text-lg" disabled={isSubmitting || cartItems.length === 0}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                {dictionary.checkout.processing}
                            </>
                        ) : (
                            dictionary.checkout.placeOrder
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white sticky top-24">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle>{dictionary.checkout.orderSummary}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-slate-600 line-clamp-1 flex-1 mr-4">{item.name} x {item.quantity}</span>
                            <span className="font-semibold">₾{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{dictionary.cart.subtotal}</span>
                      <span>₾{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{dictionary.cart.shipping}</span>
                      <span className="text-emerald-600 font-medium">{dictionary.cart.free}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl pt-2">
                      <span>{dictionary.cart.total}</span>
                      <span className="text-primary">₾{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer lang={lang} dictionary={dictionary.footer}/>
    </div>
  );
}
