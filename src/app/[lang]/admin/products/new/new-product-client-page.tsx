'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFirestore, useStorage } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/lib/data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { getDictionary } from '@/lib/dictionaries';

const formSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  image: z.instanceof(File).refine(file => file.size > 0, 'Image is required'),
});

// Helper function to create a slug
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)+/g, '');
};

export default function NewProductClientPage({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
  const router = useRouter();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !storage) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firebase services not available.' });
      return;
    }

    const slug = createSlug(values.name);
    const productData = {
        name: values.name,
        slug: slug,
        description: values.description,
        price: values.price,
        stock: values.stock,
        categoryId: values.categoryId,
        imageUrl: '', // Will be updated after upload
    };

    try {
      // 1. Upload image to Firebase Storage
      const imageFile = values.image;
      const storageRef = ref(storage, `products/${slug}-${Date.now()}-${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // Add final URL to data
      productData.imageUrl = imageUrl;
    } catch (error: any) {
        const permissionError = new FirestorePermissionError({
            path: `storage://${storage.app.options.storageBucket}/products/${slug}`,
            operation: 'write',
            requestResourceData: {
                name: values.image.name,
                size: values.image.size,
                type: values.image.type
            }
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
            variant: "destructive",
            title: dictionary.admin.permissionDenied,
            description: dictionary.admin.permissionDeniedImage,
        });
        return;
    }


    // 2. Add product to Firestore
    const productsCollection = collection(firestore, 'products');
    
    // No await, use promise chaining for error handling
    addDoc(productsCollection, productData)
    .then(() => {
        toast({ title: dictionary.admin.productCreatedSuccess, description: dictionary.admin.productCreatedSuccessDescription });
        router.push(`/${lang}/admin/products`);
        router.refresh();
    })
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: productsCollection.path,
            operation: 'create',
            requestResourceData: productData,
        });
        errorEmitter.emit('permission-error', permissionError);
        // User facing toast
        toast({
            variant: "destructive",
            title: dictionary.admin.permissionDenied,
            description: dictionary.admin.permissionDeniedProduct,
        });
    });
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? dictionary.admin.addingProduct : dictionary.admin.addProduct}
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
