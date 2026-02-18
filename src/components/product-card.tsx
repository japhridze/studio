
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Product, FirestoreProduct } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import type { getDictionary } from '@/lib/dictionaries';

type ProductCardProps = {
  product: Product | FirestoreProduct;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['productCard'] & Awaited<ReturnType<typeof getDictionary>>['productDetails'];
  lang: 'en' | 'ka';
};

export default function ProductCard({ product, dictionary, lang }: ProductCardProps) {
  const { addToCart } = useCart();
  
  let imageUrl: string | undefined;
  let imageHint: string | undefined;

  if (product.imageUrl && product.imageUrl.startsWith('https://')) {
    imageUrl = product.imageUrl;
  } else {
    const productImage = PlaceHolderImages.find(p => p.id === product.imageUrl);
    if (productImage) {
        imageUrl = productImage.imageUrl;
        imageHint = productImage.imageHint;
    }
  }


  const handleAddToCart = () => {
    const messages = {
      title: dictionary.addedToCartTitle,
      description: dictionary.addedToCartDescription.replace('{quantity}', '1').replace('{productName}', product.name)
    };
    addToCart(product, 1, messages);
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/${lang}/products/${product.slug}`} className="block">
          <div className="aspect-square relative overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={imageHint}
              />
            ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                </div>
            )}
            {product.stock < 10 && product.stock > 0 && (
                <Badge variant="destructive" className="absolute top-2 left-2">{dictionary.lowStock}</Badge>
            )}
            {product.stock === 0 && (
                 <Badge variant="destructive" className="absolute top-2 left-2">{dictionary.outOfStock}</Badge>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/${lang}/products/${product.slug}`} className="block">
            <CardTitle className="text-lg font-semibold leading-tight mb-2 hover:text-primary transition-colors">
            {product.name}
            </CardTitle>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</p>
        <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {dictionary.addToCart}
        </Button>
      </CardFooter>
    </Card>
  );
}
