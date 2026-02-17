
'use client';

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/lib/data';
import type { getDictionary } from '@/lib/dictionaries';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const formSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  image: z.instanceof(File).optional(),
});

// Helper function to create a slug
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\\p{L}\\p{N}]+/gu, '-')
    .replace(/(^-|-$)+/g, '');
};

export default function NewProductClientPage({ lang, dictionary }: { lang: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
  const router = useRouter();
  const firestore = useFirestore();
  const storage = useStorage();
  const { user } = useUser();
  const { toast } = useToast();

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
    if (!firestore || !storage || !user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create a product.',
      });
      return;
    }

    let imageUrl = ''; // Default placeholder URL

    try {
      // Step 1: Upload image if one was provided
      const imageFile = values.image;
      if (imageFile && imageFile.size > 0) {
        try {
          const storageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(storageRef);
        } catch (uploadError: any) {
          console.error("Image upload failed:", uploadError);
          toast({
            variant: "destructive",
            title: "Image Upload Failed",
            description: `The product will be saved without an image. Error: ${uploadError.message}`,
          });
          // imageUrl remains an empty string, allowing the process to continue
        }
      }

      // Step 2: Prepare and save product data to Firestore
      const slug = createSlug(values.name);
      const productData = {
          name: values.name,
          slug: slug,
          sku: values.sku,
          description: values.description,
          price: values.price,
          stock: values.stock,
          categoryId: values.categoryId,
          imageUrl: imageUrl, // This will be the URL or an empty string
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
      };
      
      const productsCollection = collection(firestore, 'products');
      await addDoc(productsCollection, productData);
      
      // Step 3: Success
      toast({ title: dictionary.admin.productCreatedSuccess, description: dictionary.admin.productCreatedSuccessDescription });
      router.push(`/${lang}/admin/products`);

    } catch (error: any) {
        console.error("Error creating product:", error);
        
        const permissionError = new FirestorePermissionError({
            path: 'products',
            operation: 'create',
            requestResourceData: { ...values, imageUrl: '', slug: createSlug(values.name) },
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
            variant: "destructive",
            title: "Error Creating Product",
            description: error.message || "Could not save product to the database. Please check your permissions and try again.",
        });
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
