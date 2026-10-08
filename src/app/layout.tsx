import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/seo/analytics";
import { buildRootMetadata } from "@/lib/seo";
import "./globals.css";

/**
 * Site-wide typeface: Poppins (Google Fonts).
 * Weights map to our text styles in globals.css.
 * @see https://fonts.google.com/specimen/Poppins
 */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        {children}
        <Toaster theme="light" position="bottom-center" richColors />
        <Analytics />
      </body>
    </html>
  );
}
