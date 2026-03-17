
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trash2, ShoppingCart, Package } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { getDictionary } from '@/lib/dictionaries';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartClientPage({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  const handleRemoveFromCart = (itemId: string) => {
    const messages = {
      title: dictionary.cart.removedFromCartTitle,
      description: dictionary.cart.removedFromCartDescription,
    };
    removeFromCart(itemId, messages);
  };
  
  if (!dictionary) {
    return (
      <div className="flex flex-col min-h-screen">
         <header className="h-16 border-b"></header>
         <main className="flex-1 py-12 md:py-20">
             <div className="container mx-auto px-4">
                 <Skeleton className="h-10 w-1/3 mb-8" />
                 <Card>
                     <CardContent className="p-6">
                         <div className="space-y-4">
                             <Skeleton className="h-24 w-full" />
                             <Skeleton className="h-24 w-full" />
                         </div>
                     </CardContent>
                 </Card>
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
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground mb-8">{dictionary.cart.title}</h1>
          
          {cartItems.length === 0 ? (
            <Card className="text-center py-20">
              <CardContent>
                <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-2xl font-semibold">{dictionary.cart.emptyTitle}</h2>
                <p className="mt-2 text-muted-foreground">{dictionary.cart.emptySubtitle}</p>
                <Button asChild className="mt-6">
                  <Link href={`/${lang}`}>{dictionary.cart.startShopping}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">{dictionary.cart.product}</TableHead>
                          <TableHead>{dictionary.cart.details}</TableHead>
                          <TableHead className="text-center">{dictionary.cart.quantity}</TableHead>
                          <TableHead className="text-right">{dictionary.cart.price}</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map(item => {
                          let displayImageUrl = '';
                          let displayImageHint = '';
                          const trimmedUrl = (item.image || '').trim();

                          if (trimmedUrl.startsWith('https://')) {
                            displayImageUrl = trimmedUrl;
                          } else {
                            const placeholder = PlaceHolderImages.find(p => p.id === trimmedUrl);
                            if (placeholder) {
                              displayImageUrl = placeholder.imageUrl;
                              displayImageHint = placeholder.imageHint;
                            }
                          }

                          return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="aspect-square relative w-20 h-20 overflow-hidden rounded-md border border-slate-100 flex items-center justify-center">
                                {displayImageUrl ? (
                                  <Image 
                                    src={displayImageUrl} 
                                    alt={item.name} 
                                    fill 
                                    className="object-contain p-1" 
                                    data-ai-hint={displayImageHint} 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                     <Package className="h-8 w-8 text-slate-200" />
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                                <Link href={`/${lang}/products/${item.slug}`} className="hover:text-primary">{item.name}</Link>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                    className="w-16 h-9 text-center"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">₾{(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )})}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Button variant="outline" onClick={clearCart} className="mt-4">
                    {dictionary.cart.clearCart}
                </Button>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{dictionary.cart.orderSummary}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>{dictionary.cart.subtotal}</span>
                      <span>₾{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{dictionary.cart.shipping}</span>
                      <span>{dictionary.cart.free}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>{dictionary.cart.total}</span>
                      <span>₾{cartTotal.toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90">{dictionary.cart.checkout}</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer lang={lang} dictionary={dictionary.footer}/>
    </div>
  );
}
