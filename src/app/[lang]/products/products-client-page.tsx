
'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
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
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Get active category from URL or state
    const categoryFromUrl = searchParams.get('category');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categoryFromUrl);

    const productsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'products'));
    }, [firestore]);

    const { data: allProducts, isLoading } = useCollection<FirestoreProduct>(productsQuery);

    // Sync state with URL changes (e.g. when clicking header links)
    useEffect(() => {
        setSelectedCategoryId(searchParams.get('category'));
    }, [searchParams]);

    const handleCategoryChange = (categoryId: string) => {
        const newCategoryId = selectedCategoryId === categoryId ? null : categoryId;
        setSelectedCategoryId(newCategoryId);
        
        // Update URL query param
        const params = new URLSearchParams(searchParams.toString());
        if (newCategoryId) {
            params.set('category', newCategoryId);
        } else {
            params.delete('category');
        }
        router.push(`/${lang}/products?${params.toString()}`, { scroll: false });
    };

    // Filter products based on selected category
    const filteredProducts = allProducts?.filter(product => {
        if (!selectedCategoryId) return true;
        return product.categoryId === selectedCategoryId;
    }) || [];

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
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="cat-all" 
                                            checked={!selectedCategoryId}
                                            onCheckedChange={() => {
                                                setSelectedCategoryId(null);
                                                router.push(`/${lang}/products`, { scroll: false });
                                            }}
                                        />
                                        <Label htmlFor="cat-all" className="text-sm cursor-pointer hover:text-primary transition-colors">
                                            {lang === 'ka' ? 'ყველა' : 'All'}
                                        </Label>
                                    </div>
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`cat-${cat.id}`} 
                                                checked={selectedCategoryId === cat.id}
                                                onCheckedChange={() => handleCategoryChange(cat.id)}
                                            />
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
                                    <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                                        <Checkbox id="price-1" disabled />
                                        <Label htmlFor="price-1" className="text-sm">0 - 100 ₾</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                                        <Checkbox id="price-2" disabled />
                                        <Label htmlFor="price-2" className="text-sm">100 - 500 ₾</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                                        <Checkbox id="price-3" disabled />
                                        <Label htmlFor="price-3" className="text-sm">500+ ₾</Label>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-2xl md:text-3xl font-headline font-bold text-slate-900">
                                    {selectedCategoryId 
                                        ? ((dictionary.categories as any)[categories.find(c => c.id === selectedCategoryId)?.slug || ''] || categories.find(c => c.id === selectedCategoryId)?.name)
                                        : dictionary.footer.shop
                                    }
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {filteredProducts.length} {dictionary.footer.shop.toLowerCase()}
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
                                    {filteredProducts.map((product) => (
                                        <ProductCard 
                                            key={product.id} 
                                            product={product} 
                                            dictionary={{...dictionary.productCard, ...dictionary.productDetails}} 
                                            lang={lang} 
                                        />
                                    ))}
                                </div>
                            )}

                            {!isLoading && filteredProducts.length === 0 && (
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
