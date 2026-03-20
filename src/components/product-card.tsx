
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Package } from 'lucide-react';
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

  const productImageUrl = product.imageUrl || '';
  const trimmedUrl = productImageUrl.trim();

  if (trimmedUrl.startsWith('https://')) {
    imageUrl = trimmedUrl;
  } else {
    const productImage = PlaceHolderImages.find(p => p.id === trimmedUrl);
    if (productImage) {
        imageUrl = productImage.imageUrl;
        imageHint = productImage.imageHint;
    }
  }

  const discount = product.discountPercentage || 0;
  const sellingPrice = discount > 0 ? (product.price * (1 - discount / 100)) : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const messages = {
      title: dictionary.addedToCartTitle,
      description: dictionary.addedToCartDescription.replace('{quantity}', '1').replace('{productName}', product.name)
    };
    addToCart({ ...product, price: sellingPrice }, 1, messages);
  }

  return (
    <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 border border-slate-100 shadow-sm hover:shadow-xl bg-white rounded-xl">
      <CardHeader className="p-0 relative">
        <Link href={`/${lang}/products/${product.slug}`} className="block">
          <div className="aspect-square relative overflow-hidden bg-white flex items-center justify-center p-4">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={imageHint}
              />
            ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-lg">
                    <Package className="w-12 h-12 text-slate-200" />
                </div>
            )}
            
            {discount > 0 && (
                <Badge className="absolute top-3 left-3 bg-rose-500 hover:bg-rose-600 text-white border-none font-bold text-xs py-1 px-2 rounded-lg">
                    -{discount}%
                </Badge>
            )}

            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
               <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-md bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white transition-colors">
                 <Eye className="h-4 w-4" />
               </Button>
               <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-md bg-white/90 backdrop-blur-sm hover:bg-rose-500 hover:text-white transition-colors">
                 <Heart className="h-4 w-4" />
               </Button>
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow flex flex-col">
        <div className="mb-2">
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1 block">Comfort House</span>
            <Link href={`/${lang}/products/${product.slug}`} className="block">
                <CardTitle className="text-sm md:text-base font-semibold leading-snug mb-2 text-slate-800 hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                {product.name}
                </CardTitle>
            </Link>
        </div>

        <div className="mt-auto pt-2">
            <div className="flex flex-col">
                {discount > 0 && (
                    <span className="text-xs text-slate-400 line-through decoration-slate-300">
                        ₾{(product.price || 0).toFixed(2)}
                    </span>
                )}
                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-900">
                        ₾{sellingPrice.toFixed(2)}
                    </span>
                    {product.stock > 0 && product.stock < 5 && (
                       <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 rounded-sm">
                           {dictionary.lowStock || 'Low Stock'}
                       </span>
                    )}
                </div>
            </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center gap-2">
        <div className="text-[10px] text-slate-400 font-medium">
            SKU: {product.sku || 'N/A'}
        </div>
        <Button 
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90 rounded-lg shadow-sm gap-2 font-bold"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">{dictionary.addToCart}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
