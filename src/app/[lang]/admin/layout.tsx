
'use client';

import Link from "next/link";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  LayoutGrid,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/admin-header";
import Logo from "@/components/logo";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc } from "firebase/firestore";
import type { User } from "@/lib/types";
import AdminLoginButton from "@/components/admin-login-button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const lang = (params?.lang as 'en' | 'ka') || 'en';
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userDocRef);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || isUserLoading) return; 

    if (!user) {
      router.push(`/${lang}/login`);
    }
  }, [user, isUserLoading, hasMounted, router, lang]);

  if (!hasMounted || isUserLoading || isProfileLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-10 w-32 mt-4" />
            </div>
        </div>
    );
  }

  if (userProfile?.role !== 'admin') {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <LayoutGrid className="h-6 w-6 text-destructive" />
            </div>
            <p className="font-bold text-2xl tracking-tight">Access Denied</p>
            <p className="text-muted-foreground">You do not have permission to view this page. Please log in as an administrator to access the dashboard.</p>
            <div className="pt-4 w-full">
              <AdminLoginButton />
            </div>
            <Button asChild variant="ghost" className="mt-2">
              <Link href={`/${lang}`}>Return to Store</Link>
            </Button>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo isAdmin={true} lang={lang} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Products">
                <Link href={`/${lang}/admin/products`}>
                  <Package />
                  <span>Products</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Categories">
                <Link href={`/${lang}/admin/categories`}>
                  <LayoutGrid />
                  <span>Categories</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Orders">
                <Link href={`/${lang}/admin/orders`}>
                  <ShoppingCart />
                  <span>Orders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Users">
                <Link href={`/${lang}/admin/users`}>
                  <Users />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href={`/${lang}`}>
              <Home className="h-4 w-4" />
              <span>Back to Store</span>
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AdminHeader lang={lang} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
