"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Card,
} from "@mui/material";
import Image from "next/image";
import Toaster from "@/components/common/Alert";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) router.push("/admin/create");
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post("/api/auth/login", {
        username,
        password,
      });

      // Store token and redirect on success
      localStorage.setItem("token", data.token);
      router.push("/admin/create");

      setToast({
        open: true,
        message: "Logged in successfully!",
        severity: "success",
      });
    } catch (error: any) {
      // Handle API response errors
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      setToast({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
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

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
      suppressHydrationWarning
    >
      {/* Left Side - Full Image */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          position: "relative",
          height: "100vh",
        }}
      >
        <Image
          src="/login.png"
          alt="Background"
          fill
          priority
          style={{
            objectFit: "contain",
            background:
              "linear-gradient(90deg, rgba(69,6,6,1) 0%, rgba(216,48,48,1) 61%, rgba(233,77,77,1) 82%)",
          }}
        />
      </Box>
      <Box sx={{ position: "fixed", top: 20, left: 20 }}>
        <Image
          style={{ background: "white" }}
          alt="logo"
          src="/fixture.png"
          width={200}
          height={60}
          priority
        />
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
          Match Fixture Panel
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Please enter email and password to login
        </Typography>

        <Card
          sx={{
            padding: 4,
            boxShadow: 3,
            borderRadius: 2,
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
          <Button
            variant="contained"
            loading={loading}
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 2, py: 1.2, background: "#D83030" }}
          >
            Login
          </Button>
        </Card>
      </Box>
      <Toaster
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
