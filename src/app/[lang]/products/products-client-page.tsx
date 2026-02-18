'use client';

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query } from 'firebase/firestore';
import type { FirestoreProduct } from '@/lib/types';
import ProductCard from "@/components/product-card";
import type { getDictionary } from "@/lib/dictionaries";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ProductsClientPage({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
    const firestore = useFirestore();

    const productsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'products'));
    }, [firestore]);

    const { data: products, isLoading } = useCollection<FirestoreProduct>(productsQuery);

    return (
        <div className="flex flex-col min-h-screen">
            <Header lang={lang} dictionary={dictionary} />
            <main className="flex-1 py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                            All Products
                        </h1>
                        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                            Browse our full catalog of high-quality products.
                        </p>
                    </div>
                    {isLoading ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex flex-col space-y-3">
                                    <Skeleton className="h-[250px] w-full rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {products?.map((product) => (
                                <ProductCard key={product.id} product={product} dictionary={{...dictionary.productCard, ...dictionary.productDetails}} lang={lang} />
                            ))}
                        </div>
                    )}
                    {!isLoading && (!products || products.length === 0) && (
                         <p className="text-center text-muted-foreground mt-10">No products found.</p>
                    )}
                </div>
            </main>
            <Footer lang={lang} dictionary={dictionary.footer} />
        </div>
    );
}
