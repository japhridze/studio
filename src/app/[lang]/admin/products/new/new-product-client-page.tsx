
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFirestore, useStorage, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/lib/data';
import type { getDictionary } from '@/lib/dictionaries';

const formSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  discountPercentage: z.coerce.number().min(0).max(100).default(0),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  image: z.instanceof(File).optional(),
});

/**
 * Transliterates Georgian characters to Latin equivalents.
 */
const transliterateGeorgian = (text: string) => {
  const map: Record<string, string> = {
    'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z', 'თ': 't', 'ი': 'i',
    'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',
    'ტ': 't', 'უ': 'u', 'ფ': 'p', 'ქ': 'k', 'ღ': 'gh', 'ყ': 'q', 'შ': 'sh', 'ჩ': 'ch',
    'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
  };
  return text.split('').map(char => map[char] || char).join('');
};

const createLatinSlug = (name: string) => {
  if (!name) return '';
  let slug = transliterateGeorgian(name.toLowerCase());
  slug = slug
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/(^-|-$)/g, '');
  if (!slug) return 'product-' + Date.now().toString(36);
  return slug;
};

export default function NewProductClientPage({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
  const router = useRouter();
  const firestore = useFirestore();
  const storage = useStorage();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      sku: '',
      description: '',
      price: 0,
      discountPercentage: 0,
      stock: 0,
      categoryId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    let imageUrl = "";

    try {
        if (!user || !firestore || !storage) {
            throw new Error("Firebase services not initialized");
        }

        const imageFile = values.image;
        if (imageFile && imageFile.size > 0) {
            try {
                const storageRef = ref(storage, `products/${user.uid}/${Date.now()}-${imageFile.name}`);
                const uploadTask = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(uploadTask.ref);
            } catch (err) {
                console.error("Image upload failed, continuing without image", err);
            }
        }

        const finalSlug = values.slug && values.slug.trim() 
            ? createLatinSlug(values.slug) 
            : createLatinSlug(values.name);

        const productData = {
            name: values.name,
            slug: finalSlug,
            sku: values.sku,
            description: values.description,
            price: values.price, // Stored as Original Price
            discountPercentage: values.discountPercentage,
            stock: values.stock,
            categoryId: values.categoryId,
            imageUrl: imageUrl, 
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await addDoc(collection(firestore, "products"), productData);

        toast({
            title: dictionary.admin.productCreatedSuccess,
            description: dictionary.admin.productCreatedSuccessDescription,
        });

        router.push(`/${lang}/admin/products`);

    } catch (dbError: any) {
        toast({
            variant: "destructive",
            title: dictionary.admin.dbWriteFailedTitle,
            description: dbError.message,
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.admin.addNewProduct}</CardTitle>
        <CardDescription>{dictionary.admin.addNewProductDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.admin.productName}</FormLabel>
                    <FormControl><Input placeholder={dictionary.admin.productNamePlaceholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl><Input placeholder="CDP-001" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug (Latin only)</FormLabel>
                  <FormControl><Input placeholder="e.g. cordless-drill-pro" {...field} /></FormControl>
                  <FormDescription>Leave empty to auto-generate from name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.admin.description}</FormLabel>
                  <FormControl><Textarea placeholder={dictionary.admin.descriptionPlaceholder} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{dictionary.admin.price} (₾)</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder={dictionary.admin.pricePlaceholder} {...field} /></FormControl>
                    <FormDescription>Enter the base price (original price).</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{dictionary.admin.discountPercentage} (%)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g. 10" {...field} /></FormControl>
                    <FormDescription>Percentage to subtract from price.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{dictionary.admin.stock}</FormLabel>
                    <FormControl><Input type="number" placeholder={dictionary.admin.stockPlaceholder} {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.admin.category}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder={dictionary.admin.selectCategory} /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{(dictionary.categories as any)[cat.slug] || cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...rest }}) => (
                <FormItem>
                  <FormLabel>{dictionary.admin.productImage}</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} {...rest} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? dictionary.admin.addingProduct : dictionary.admin.addProduct}
              </Button>
              <Button variant="outline" asChild>
                  <Link href={`/${lang}/admin/products`}>{dictionary.admin.cancel}</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
