
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
  const lang = params.lang as 'en' | 'ka';
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
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
  }

  if (userProfile?.role !== 'admin') {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
            <p className="font-semibold text-lg">Access Denied</p>
            <p className="text-muted-foreground max-w-sm">You do not have permission to view this page. Please log in as an administrator.</p>
            <AdminLoginButton />
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
              <SidebarMenuButton href={`/${lang}/admin/products`} tooltip="Products">
                <Package />
                Products
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href={`/${lang}/admin/categories`} tooltip="Categories">
                <LayoutGrid />
                Categories
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href={`/${lang}/admin/orders`} tooltip="Orders">
                <ShoppingCart />
                Orders
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href={`/${lang}/admin/users`} tooltip="Users">
                <Users />
                Users
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href={`/${lang}`}>
              <Home />
              Back to Store
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AdminHeader lang={lang} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
