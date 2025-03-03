"use client"
import { Container, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();

function MyApp() {


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container><Typography variant="h4">Coming Soon</Typography></Container>;
      </ThemeProvider>
  );
}

export default MyApp;
