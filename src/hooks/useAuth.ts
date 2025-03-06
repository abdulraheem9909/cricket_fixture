"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    if (!token) {
      router.push("/auth/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return { isAuthenticated };
}