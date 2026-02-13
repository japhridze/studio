'use client';
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { orders } from "@/lib/data";
import { useUser, useFirestore, useDoc } from "@/firebase";
import type { UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import type { getDictionary } from "@/lib/dictionaries";

export default function AccountClientPage({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();

    const userProfileRef = useMemo(() => {
        if (!user || !firestore) return null;
        return doc(firestore, "users", user.uid);
    }, [user, firestore]);

    const { data: userProfile, isLoading: profileLoading } = useDoc<UserProfile>(userProfileRef);

    useEffect(() => {
        if (!user && !isUserLoading) {
            router.push(`/${lang}/login`);
        }
    }, [user, isUserLoading, router, lang]);

    // Mock filtering, as orders are not in Firestore yet
    const userOrders = user ? orders.filter(o => o.userId === '2') : []; // Replace '2' with user.uid when orders are in firestore

    if (isUserLoading || profileLoading || !user || !dictionary) {
        return (
             <div className="flex flex-col min-h-screen">
                <header className="h-16 border-b"></header>
                <main className="flex-1 py-12 md:py-20">
                    <div className="container mx-auto px-4">
                        <Skeleton className="h-10 w-1/3 mb-8" />
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <Card>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-1/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="md:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-1/3" />
                                         <Skeleton className="h-4 w-1/2" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <Skeleton className="h-12 w-full" />
                                            <Skeleton className="h-12 w-full" />
                                            <Skeleton className="h-12 w-full" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="h-16 border-t"></footer>
            </div>
        )
    }

  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} dictionary={dictionary} />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground mb-8">{dictionary.account.title}</h1>
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>{dictionary.account.profileTitle}</CardTitle>
                            <CardDescription>{dictionary.account.profileDescription}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>{dictionary.account.name}:</strong> {userProfile?.name}</p>
                            <p><strong>{dictionary.account.email}:</strong> {userProfile?.email}</p>
                            <p><strong>{dictionary.account.role}:</strong> <Badge variant={userProfile?.role === 'admin' ? 'destructive' : 'secondary'}>{userProfile?.role}</Badge></p>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{dictionary.account.orderHistoryTitle}</CardTitle>
                            <CardDescription>{dictionary.account.orderHistoryDescription}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>{dictionary.account.orderId}</TableHead>
                                    <TableHead>{dictionary.account.date}</TableHead>
                                    <TableHead>{dictionary.account.status}</TableHead>
                                    <TableHead className="text-right">{dictionary.account.total}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {userOrders.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.id}</TableCell>
                                            <TableCell>{order.date}</TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className={order.status === 'Delivered' ? 'bg-green-500' : ''}>{order.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             {userOrders.length === 0 && <p className="text-center text-muted-foreground py-8">{dictionary.account.noOrders}</p>}
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
