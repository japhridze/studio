'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
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
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export default function NewProductPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
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
            title: "Permission Denied",
            description: "You do not have permission to upload an image.",
        });
        return;
    }


    // 2. Add product to Firestore
    const productsCollection = collection(firestore, 'products');
    
    // No await, use promise chaining for error handling
    addDoc(productsCollection, productData)
    .then(() => {
        toast({ title: 'Success!', description: 'Product has been created.' });
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
            title: "Permission Denied",
            description: "You do not have permission to create a product.",
        });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>Fill out the form below to add a new product to your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Cordless Drill Pro" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Describe the product..." {...field} /></FormControl>
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
                    <FormLabel>Price</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="99.99" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl><Input type="number" placeholder="100" {...field} /></FormControl>
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
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
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
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} {...rest} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Adding Product..." : "Add Product"}
              </Button>
              <Button variant="outline" asChild>
                  <Link href={`/${lang}/admin/products`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
