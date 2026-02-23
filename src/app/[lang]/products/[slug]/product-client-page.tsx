'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, CheckCircle, Package } from 'lucide-react';
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
        <main className="flex-1 py-12 md:py-20">
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
        <Footer lang={lang} dictionary={dictionary.footer} />
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
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} dictionary={dictionary} />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-square relative w-full overflow-hidden rounded-lg shadow-lg">
                {product.imageUrl && product.imageUrl.trim() ? (
                <Image
                    src={product.imageUrl.trim()}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Package className="w-24 h-24 text-muted-foreground" />
                    </div>
                )}
            </div>
            
            <div>
              {productCategory && (
                <Link href={`/${lang}/products`} className="text-sm text-primary font-medium hover:underline">{(dictionary.categories as any)[productCategory.slug] || productCategory.name}</Link>
              )}
              <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground mt-2">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mt-4">${(product.price || 0).toFixed(2)}</p>
              
              <Card className="mt-6 bg-card">
                <CardContent className="p-6">
                  <p className="text-muted-foreground">{product.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>
                      {product.stock > 0 
                        ? dictionary.productDetails.inStock.replace('{count}', String(product.stock)) 
                        : dictionary.productDetails.outOfStock
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))}><span className="text-xl">-</span></Button>
                  <Input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center" 
                  />
                  <Button variant="outline" size="icon" onClick={() => setQuantity(q => q+1)}><span className="text-xl">+</span></Button>
                </div>
                <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 bg-accent hover:bg-accent/90">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {dictionary.productDetails.addToCart}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer lang={lang} dictionary={dictionary.footer} />
    </div>
  );
}
