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
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";
import type { User } from "@/lib/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace(`/login`);
    }
    if (!isProfileLoading && userProfile && userProfile.role !== 'admin') {
      router.replace(`/`);
    }
  }, [user, isUserLoading, userProfile, isProfileLoading, router]);

  if (isUserLoading || isProfileLoading || !userProfile || userProfile.role !== 'admin') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo isAdmin={true} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/products" tooltip="Products">
                <Package />
                Products
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/categories" tooltip="Categories">
                <LayoutGrid />
                Categories
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/orders" tooltip="Orders">
                <ShoppingCart />
                Orders
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/users" tooltip="Users">
                <Users />
                Users
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/">
              <Home />
              Back to Store
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
