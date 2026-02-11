'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trash2, ShoppingCart } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useParams } from 'next/navigation';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const params = useParams();
  const lang = params.lang as 'en' | 'ka';

  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} dictionary={{header: {}, languageSwitcher: {}, productCard: {}} as any} />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground mb-8">Your Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <Card className="text-center py-20">
              <CardContent>
                <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-2xl font-semibold">Your cart is empty</h2>
                <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
                <Button asChild className="mt-6">
                  <Link href={`/${lang}`}>Start Shopping</Link>
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
                          <TableHead className="w-[100px]">Product</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map(item => {
                          const itemImage = PlaceHolderImages.find(p => p.id === item.image);
                          return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="aspect-square relative w-20 h-20 overflow-hidden rounded-md">
                                {itemImage && <Image src={itemImage.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={itemImage.imageHint} />}
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
                                    onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                                    className="w-16 h-9 text-center"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
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
                    Clear Cart
                </Button>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90">Proceed to Checkout</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer lang={lang} dictionary={{copyright: "© {year} Gorgia Online. All Rights Reserved."} as any}/>
    </div>
  );
}
