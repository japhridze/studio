'use client';
import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ShoppingCart, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { products, categories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCart } from '@/context/cart-context';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const product = products.find(p => p.slug === params.slug);

  if (!product) {
    notFound();
  }
  
  const productCategory = categories.find(c => c.id === product.categoryId);
  const productImage = PlaceHolderImages.find(p => p.id === product.images[0]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-square relative w-full overflow-hidden rounded-lg shadow-lg">
                {productImage ? (
                <Image
                    src={productImage.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={productImage.imageHint}
                />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Package className="w-24 h-24 text-muted-foreground" />
                    </div>
                )}
            </div>
            
            <div>
              {productCategory && (
                <Link href="#" className="text-sm text-primary font-medium hover:underline">{productCategory.name}</Link>
              )}
              <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground mt-2">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mt-4">${product.price.toFixed(2)}</p>
              
              <Card className="mt-6 bg-card">
                <CardContent className="p-6">
                  <p className="text-muted-foreground">{product.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
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
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
