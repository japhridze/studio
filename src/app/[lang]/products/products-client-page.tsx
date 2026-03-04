
'use client';

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query } from 'firebase/firestore';
import type { FirestoreProduct } from '@/lib/types';
import ProductCard from "@/components/product-card";
import type { getDictionary } from "@/lib/dictionaries";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { categories } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ProductsClientPage({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
    const firestore = useFirestore();

    const productsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'products'));
    }, [firestore]);

    const { data: products, isLoading } = useCollection<FirestoreProduct>(productsQuery);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header lang={lang} dictionary={dictionary} />
            <main className="flex-1 py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className="w-full md:w-64 space-y-8 bg-white p-6 rounded-xl shadow-sm h-fit sticky top-24">
                            <div>
                                <h3 className="font-bold text-lg mb-4">{dictionary.homepage.shopByCategory}</h3>
                                <div className="space-y-3">
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="flex items-center space-x-2">
                                            <Checkbox id={`cat-${cat.id}`} />
                                            <Label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer hover:text-primary transition-colors">
                                                {(dictionary.categories as any)[cat.slug] || cat.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-bold text-lg mb-4">{dictionary.cart.price || 'Price'}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="price-1" />
                                        <Label htmlFor="price-1" className="text-sm">0 - 100 ₾</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="price-2" />
                                        <Label htmlFor="price-2" className="text-sm">100 - 500 ₾</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="price-3" />
                                        <Label htmlFor="price-3" className="text-sm">500+ ₾</Label>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-2xl md:text-3xl font-headline font-bold text-slate-900">
                                    {dictionary.footer.shop}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {products?.length || 0} {dictionary.footer.shop.toLowerCase()}
                                </p>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="flex flex-col space-y-3">
                                            <Skeleton className="h-[280px] w-full rounded-xl" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products?.map((product) => (
                                        <ProductCard 
                                            key={product.id} 
                                            product={product} 
                                            dictionary={{...dictionary.productCard, ...dictionary.productDetails}} 
                                            lang={lang} 
                                        />
                                    ))}
                                </div>
                            )}

                            {!isLoading && (!products || products.length === 0) && (
                                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                                    <p className="text-muted-foreground">{dictionary.cart.emptyTitle || 'No products found.'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer lang={lang} dictionary={dictionary.footer} />
        </div>
    );
}
