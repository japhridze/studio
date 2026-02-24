'use client';

import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginButton() {
  const auth = useAuth();
  const { toast } = useToast();

  const login = async () => {
    if (!auth) {
        toast({ title: "Error", description: "Firebase auth service not available.", variant: "destructive" });
        return;
    }
    try {
      // IMPORTANT: Replace "123456" with the actual password for your admin account.
      // This button is intended for debugging purposes.
      await signInWithEmailAndPassword(
        auth,
        "tornikejaparidze777@gmail.com",
        "123456"
      );
      toast({ title: "Admin Logged In", description: "Successfully logged in as admin. Reloading..." });
      // Reload the page to re-evaluate admin access.
      window.location.reload();
    } catch (error: any) {
        console.error("Admin login failed:", error);
        toast({ title: "Admin Login Failed", description: error.message, variant: "destructive" });
    }
  };

  return <Button onClick={login} variant="secondary">Login as Admin</Button>;
}
