"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
} from "@mui/material";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/admin/dashboard");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated === null) {
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

  const handleLogin = async () => {
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    console.log("response", response);

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      router.push("/admin/dashboard");
    } else {
      setError(data.message);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
        {/* <img src="/logo.png" alt="Logo" style={{ width: 50 }} /> */}
        logo
      </Box>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        Admin Panel
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
          minWidth: "500px",
        }}
      >
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
          slotProps={{ input: { autoComplete: "new-email" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          slotProps={{ input: { autoComplete: "new-password" } }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2, py: 1.2 }}
        >
          Login
        </Button>
      </Card>
    </Container>
  );
}
