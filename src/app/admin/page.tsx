"use client";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RedirectPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Client-side check
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem("token");
    setMounted(true);
    
    if (!token) {
      router.push("/auth/login");
      setIsAuthenticated(false);
    } else {
      router.push("/admin/create");
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!mounted || isAuthenticated === null) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return null;
}