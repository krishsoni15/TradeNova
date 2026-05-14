"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services/auth.service";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (code) {
      // Exchange code for token
      authService.loginWithUpstox({ code }).then((response) => {
        // Since loginWithUpstox directly returns AuthResponse (data.data), check if it has access_token
        if (response && response.access_token) {
          login(response.access_token, response.user);
          router.push("/");
        } else {
          console.error("Auth failed:", response);
          router.push("/login?error=auth_failed");
        }
      }).catch((error) => {
        console.error("Auth callback error:", error);
        router.push("/login?error=auth_failed");
      });
    } else {
      router.push("/login?error=no_code");
    }
  }, [searchParams, router, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <h2 className="text-xl font-medium text-foreground">Connecting to Upstox...</h2>
      <p className="text-muted-foreground text-sm">Please wait while we secure your connection.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
