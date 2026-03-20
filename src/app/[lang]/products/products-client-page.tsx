
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
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Filter } from "lucide-react";

export default function ProductsClientPage({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
    const firestore = useFirestore();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const categoryFromUrl = searchParams.get('category');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categoryFromUrl);

    const productsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'products'));
    }, [firestore]);

    const { data: allProducts, isLoading } = useCollection<FirestoreProduct>(productsQuery);

    useEffect(() => {
        setSelectedCategoryId(searchParams.get('category'));
    }, [searchParams]);

    const handleCategoryChange = (categoryId: string) => {
        const newCategoryId = selectedCategoryId === categoryId ? null : categoryId;
        setSelectedCategoryId(newCategoryId);
        
        const params = new URLSearchParams(searchParams.toString());
        if (newCategoryId) {
            params.set('category', newCategoryId);
        } else {
            params.delete('category');
        }
        router.push(`/${lang}/products?${params.toString()}`, { scroll: false });
    };

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
                        <aside className="w-full md:w-72 space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-24">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-primary" />
                                    {dictionary.homepage.shopByCategory}
                                </h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div 
                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${!selectedCategoryId ? 'bg-primary/5 text-primary border border-primary/20' : 'hover:bg-slate-50'}`}
                                    onClick={() => {
                                        setSelectedCategoryId(null);
                                        router.push(`/${lang}/products`, { scroll: false });
                                    }}
                                >
                                    <span className="text-sm font-semibold">{lang === 'ka' ? 'ყველა პროდუქტი' : 'All Products'}</span>
                                    <div className={`h-2 w-2 rounded-full ${!selectedCategoryId ? 'bg-primary' : 'bg-transparent'}`} />
                                </div>
                                
                                {categories.map((cat) => (
                                    <div 
                                        key={cat.id} 
                                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedCategoryId === cat.id ? 'bg-primary/5 text-primary border border-primary/20' : 'hover:bg-slate-50'}`}
                                        onClick={() => handleCategoryChange(cat.id)}
                                    >
                                        <span className="text-sm font-semibold">{(dictionary.categories as any)[cat.slug] || cat.name}</span>
                                        <div className={`h-2 w-2 rounded-full ${selectedCategoryId === cat.id ? 'bg-primary' : 'bg-transparent'}`} />
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg">{dictionary.cart.price || 'Price'}</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'p1', label: '0 - 100 ₾' },
                                        { id: 'p2', label: '100 - 500 ₾' },
                                        { id: 'p3', label: '500+ ₾' }
                                    ].map(range => (
                                        <div key={range.id} className="flex items-center space-x-3 group opacity-50 cursor-not-allowed">
                                            <Checkbox id={range.id} disabled className="rounded-full h-5 w-5" />
                                            <Label htmlFor={range.id} className="text-sm font-medium">{range.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {selectedCategoryId 
                                            ? ((dictionary.categories as any)[categories.find(c => c.id === selectedCategoryId)?.slug || ''] || categories.find(c => c.id === selectedCategoryId)?.name)
                                            : dictionary.footer.shop
                                        }
                                    </h1>
                                    <p className="text-sm text-slate-500 font-medium">
                                        {filteredProducts.length} {dictionary.footer.shop.toLowerCase()}
                                    </p>
                                </div>
                                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                                    <Button variant="ghost" size="icon" className="bg-white shadow-sm h-8 w-8"><LayoutGrid className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><List className="h-4 w-4" /></Button>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="flex flex-col space-y-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                            <Skeleton className="h-64 w-full rounded-xl" />
                                            <div className="space-y-3">
                                                <Skeleton className="h-4 w-1/3" />
                                                <Skeleton className="h-6 w-3/4" />
                                                <Skeleton className="h-10 w-full rounded-lg" />
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
                                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <Package className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-500 font-semibold">{dictionary.cart.emptyTitle || 'No products found.'}</p>
                                    <Button variant="link" onClick={() => setSelectedCategoryId(null)} className="text-primary">
                                        {lang === 'ka' ? 'ყველა პროდუქტის ნახვა' : 'View all products'}
                                    </Button>
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
