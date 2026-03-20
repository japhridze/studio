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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Filter, ChevronRight, Package } from "lucide-react";

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

    const handleCategoryChange = (categoryId: string | null) => {
        setSelectedCategoryId(categoryId);
        
        const params = new URLSearchParams(searchParams.toString());
        if (categoryId) {
            params.set('category', categoryId);
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
                        {/* Vertical Sidebar */}
                        <aside className="w-full md:w-80 space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-200 h-fit sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-primary" />
                                    {dictionary.homepage.shopByCategory}
                                </h3>
                            </div>
                            
                            <nav className="space-y-1">
                                <button 
                                    onClick={() => handleCategoryChange(null)}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all group ${!selectedCategoryId ? 'bg-white shadow-sm border border-slate-200 text-primary' : 'hover:bg-slate-200/50 text-slate-600'}`}
                                >
                                    <span className="text-sm font-bold tracking-tight">{lang === 'ka' ? 'ყველა პროდუქტი' : 'All Products'}</span>
                                    <ChevronRight className={`h-4 w-4 transition-transform ${!selectedCategoryId ? 'text-primary' : 'text-slate-300 group-hover:translate-x-1'}`} />
                                </button>
                                
                                {categories.map((cat) => (
                                    <button 
                                        key={cat.id} 
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all group ${selectedCategoryId === cat.id ? 'bg-white shadow-sm border border-slate-200 text-primary' : 'hover:bg-slate-200/50 text-slate-600'}`}
                                    >
                                        <span className="text-sm font-bold tracking-tight">{(dictionary.categories as any)[cat.slug] || cat.name}</span>
                                        <ChevronRight className={`h-4 w-4 transition-transform ${selectedCategoryId === cat.id ? 'text-primary' : 'text-slate-300 group-hover:translate-x-1'}`} />
                                    </button>
                                ))}
                            </nav>

                            <Separator className="bg-slate-200" />
                            
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Comfort House</p>
                                <p className="text-[10px] text-slate-500 font-medium">{dictionary.footer.slogan}</p>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                                        {selectedCategoryId 
                                            ? ((dictionary.categories as any)[categories.find(c => c.id === selectedCategoryId)?.slug || ''] || categories.find(c => c.id === selectedCategoryId)?.name)
                                            : (lang === 'ka' ? 'ყველა პროდუქტი' : 'All Products')
                                        }
                                    </h1>
                                    <p className="text-xs text-slate-500 font-bold mt-1">
                                        {filteredProducts.length} {dictionary.footer.shop.toLowerCase()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                                        <Button variant="ghost" size="icon" className="bg-white shadow-sm h-9 w-9 rounded-lg"><LayoutGrid className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg opacity-40"><List className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="flex flex-col space-y-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
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
                                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
                                    <Package className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold text-lg">{dictionary.cart.emptyTitle || 'No products found.'}</p>
                                    <p className="text-slate-400 text-sm mb-6">სცადეთ სხვა კატეგორია</p>
                                    <Button onClick={() => handleCategoryChange(null)} className="rounded-xl px-8">
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