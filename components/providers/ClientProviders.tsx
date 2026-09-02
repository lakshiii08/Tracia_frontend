"use client";

import type { ReactNode } from "react";
import { AppDataProvider } from "@/lib/store";
import { AuthProvider } from "@/auth/useAuthorization";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppDataProvider>{children}</AppDataProvider>
    </AuthProvider>
  );
}
