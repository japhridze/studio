
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, CheckCircle, Package, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCart } from '@/context/cart-context';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import type { getDictionary } from '@/lib/dictionaries';
import type { FirestoreProduct } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ProductClientPage({ lang, dictionary, slug }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>>, slug: string }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const firestore = useFirestore();

  const productQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, "products"), where("slug", "==", slug), limit(1));
  }, [firestore, slug]);

  const { data: products, isLoading } = useCollection<FirestoreProduct>(productQuery);
  const product = products?.[0];
  
  const handleAddToCart = () => {
    if (!product) return;
    const messages = {
      title: dictionary.productDetails.addedToCartTitle,
      description: dictionary.productDetails.addedToCartDescription.replace('{quantity}', String(quantity)).replace('{productName}', product.name)
    };
    addToCart(product, quantity, messages);
  };
  
  if (isLoading || !dictionary) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header lang={lang} dictionary={dictionary} />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 flex-1" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer lang={lang} dictionary={dictionary?.footer} />
      </div>
    )
  }

  if (!product) {
     return (
         <div className="flex flex-col min-h-screen">
            <Header lang={lang} dictionary={dictionary} />
            <main className="flex-1 py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold">404 - Product Not Found</h1>
                    <p className="text-muted-foreground mt-4">The product you are looking for does not exist.</p>
                    <Button asChild className="mt-8">
                        <Link href={`/${lang}`}>Go to Homepage</Link>
                    </Button>
                </div>
            </main>
            <Footer lang={lang} dictionary={dictionary.footer} />
        </div>
     )
  }
  
  const productCategory = categories.find(c => c.id === product.categoryId);
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header lang={lang} dictionary={dictionary} />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <Link href={`/${lang}`} className="hover:text-primary flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              {dictionary.header.home}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${lang}/products`} className="hover:text-primary">
              {dictionary.footer.shop}
            </Link>
            {productCategory && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/${lang}/products`} className="hover:text-primary">
                  {(dictionary.categories as any)[productCategory.slug] || productCategory.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Left: Product Image */}
            <div className="space-y-4">
                <Card className="overflow-hidden bg-white border-none shadow-sm rounded-xl">
                    <div className="aspect-square relative w-full flex items-center justify-center p-4">
                        {product.imageUrl && product.imageUrl.trim() ? (
                        <Image
                            src={product.imageUrl.trim()}
                            alt={product.name}
                            fill
                            className="object-contain p-4"
                        />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-lg">
                                <Package className="w-24 h-24 text-slate-300" />
                            </div>
                        )}
                    </div>
                </Card>
            </div>
            
            {/* Right: Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                {productCategory && (
                   <Badge variant="secondary" className="mb-2">
                     {(dictionary.categories as any)[productCategory.slug] || productCategory.name}
                   </Badge>
                )}
                <h1 className="text-2xl md:text-4xl font-headline font-bold text-slate-900 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{dictionary.admin.sku || 'SKU'}: <strong>{product.sku || 'N/A'}</strong></span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">${(product.price || 0).toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium">
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                      <CheckCircle className="w-4 h-4" />
                      <span>{dictionary.productDetails.inStock.replace('{count}', String(product.stock))}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                      <Package className="w-4 h-4" />
                      <span>{dictionary.productDetails.outOfStock}</span>
                    </div>
                  )}
                </div>

                <Card className="bg-white border-none shadow-sm rounded-xl">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-slate-900">{dictionary.admin.description || 'Description'}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {product.description}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                  <div className="flex items-center border rounded-lg bg-white h-12">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-none h-full hover:bg-slate-50"
                      onClick={() => setQuantity(q => Math.max(1, q-1))}
                    >
                      <span className="text-xl">-</span>
                    </Button>
                    <Input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 border-none text-center focus-visible:ring-0 text-lg font-medium h-full" 
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-none h-full hover:bg-slate-50"
                      onClick={() => setQuantity(q => q+1)}
                    >
                      <span className="text-xl">+</span>
                    </Button>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleAddToCart} 
                    disabled={product.stock === 0} 
                    className="flex-1 h-12 bg-accent hover:bg-accent/90 text-white font-bold text-lg shadow-md transition-all hover:scale-[1.02]"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {dictionary.productDetails.addToCart}
                  </Button>
                </div>
              </div>

              {/* Badges / Extras */}
              <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 text-center">
                   <Package className="w-8 h-8 text-primary mb-2" />
                   <span className="text-xs font-semibold text-slate-700">{dictionary.footer.shippingReturns}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 text-center">
                   <CheckCircle className="w-8 h-8 text-primary mb-2" />
                   <span className="text-xs font-semibold text-slate-700">100% {dictionary.admin.productCreatedSuccess || 'Quality'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer lang={lang} dictionary={dictionary.footer} />
    </div>
  );
}
