"use client"; // Mark this component as a Client Component

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ReactNode } from "react";

// Create the MUI theme
const theme = createTheme({
  typography: {
    fontFamily: "var(--font-poppins), sans-serif", // Use Poppins as the default font
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}