import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../components/ThemeRegistry"; // Import the ThemeRegistry

// Configure Poppins
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.variable}>
        {/* Wrap children with ThemeRegistry */}
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
