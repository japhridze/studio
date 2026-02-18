'use client';

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, limit, query } from 'firebase/firestore';
import type { FirestoreProduct } from '@/lib/types';
import ProductCard from "@/components/product-card";
import type { getDictionary } from "@/lib/dictionaries";
import { Skeleton } from "./ui/skeleton";

export default function FeaturedProducts({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
    const firestore = useFirestore();

    const productsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'products'), limit(8));
    }, [firestore]);

    const { data: products, isLoading } = useCollection<FirestoreProduct>(productsQuery);

    if (isLoading) {
        return (
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
        );
    }
    
    if (!products || products.length === 0) {
        return <p className="text-center text-muted-foreground">No featured products found.</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} dictionary={{...dictionary.productCard, ...dictionary.productDetails}} lang={lang} />
            ))}
        </div>
    );
}
