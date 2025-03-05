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

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage?.getItem("token");
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

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      router.push("/admin/dashboard");
    } else {
      setError(data.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Left Side - Full Image */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" }, // Hide on mobile
          position: "relative",
          height: "100vh",
        }}
      >
        <Image
          src="/login.png"
          alt="Background"
          layout="fill"
          objectFit="contain"
          priority
          style={{
            background:
              "linear-gradient(90deg, rgba(69,6,6,1) 0%, rgba(216,48,48,1) 61%, rgba(233,77,77,1) 82%)",
            objectFit: "scale-down",
          }}
        />
      </Box>
      <Box sx={{ position: "fixed", top: 20, left: 20 }}>
        {" "}
        <Image
          style={{ background: "white" }}
          alt="logo"
          src="/fixture.png"
          width={200}
          height={60}
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
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 2, py: 1.2, background: "#D83030" }}
          >
            Login
          </Button>
        </Card>
      </Box>
    </Box>
  );
}
