
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFirestore, useStorage, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/lib/data';
import type { getDictionary } from '@/lib/dictionaries';

const formSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  image: z.instanceof(File).optional(),
});

// Helper function to create a URL-friendly slug from a string.
const createSlug = (name: string) => {
  if (!name) return '';
  
  // The \p{L} and \p{N} are Unicode property escapes.
  // \p{L} matches any kind of letter from any language.
  // \p{N} matches any kind of numeric character in any script.
  // The 'u' flag is essential for Unicode regex.
  const slug = name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-') // Replace non-letters/numbers with a hyphen
    .replace(/--+/g, '-')             // Replace multiple hyphens with a single one
    .replace(/(^-|-$)/g, '');         // Remove leading/trailing hyphens

  // If the name consists only of characters that are replaced,
  // the slug might be empty. Provide a fallback.
  if (!slug) {
    return 'product-' + Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

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
      sku: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      if (!user || !storage || !firestore) {
        throw new Error('Authentication or Firebase services are not available. Please log in.');
      }
      
      let imageUrl = '';
      const imageFile = values.image;

      if (imageFile && imageFile.size > 0) {
        const storageRef = ref(storage, `products/${user.uid}/${Date.now()}-${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      const productData = {
        name: values.name,
        slug: createSlug(values.name),
        sku: values.sku,
        description: values.description,
        price: values.price,
        stock: values.stock,
        categoryId: values.categoryId,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const productsCollection = collection(firestore, 'products');
      await addDoc(productsCollection, productData);
      
      toast({
        title: dictionary.admin.productCreatedSuccess,
        description: dictionary.admin.productCreatedSuccessDescription,
      });
      router.push(`/${lang}/admin/products`);

    } catch (error: any) {
      console.error("Failed to add product:", error);
      let title = "Failed to add product";
      let description = "An unexpected error occurred.";

      if (error.code) {
        switch (error.code) {
          case 'storage/unauthorized':
            title = dictionary.admin.permissionDenied || "Permission Denied";
            description = dictionary.admin.permissionDeniedImage || "You do not have permission to upload an image. Check Storage Rules.";
            break;
          case 'permission-denied': // Firestore permission error
             title = dictionary.admin.permissionDenied || "Permission Denied";
             description = dictionary.admin.permissionDeniedProduct || "You do not have permission to create this product. Check Firestore Rules.";
             // Also emit the detailed error for the dev overlay
             const permissionError = new FirestorePermissionError({
                path: 'products',
                operation: 'create',
                requestResourceData: values,
             });
             errorEmitter.emit('permission-error', permissionError);
            break;
          default:
            description = error.message;
        }
      } else {
        description = error.message;
      }
      
      toast({
        variant: "destructive",
        title: title,
        description: description,
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
            <div className="grid grid-cols-2 gap-4">
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.admin.description}</FormLabel>
                  <FormControl><Textarea placeholder={dictionary.admin.descriptionPlaceholder} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{dictionary.admin.price}</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder={dictionary.admin.pricePlaceholder} {...field} /></FormControl>
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
