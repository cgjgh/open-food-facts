import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { AnimatedBackground } from "@/components/animated-background";
import { BottomNav } from "@/components/bottom-nav";
import { Sidebar } from "@/components/sidebar";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Open Food Facts",
  description: "Explore food products — nutritional scores, ingredients, and eco impact at a glance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AnimatedBackground />
          <div className="relative flex min-h-screen" style={{ zIndex: 1 }}>
            <Sidebar />
            <div className="flex-1 flex flex-col transition-all duration-300 md:pl-[var(--sidebar-width,260px)]">
              <Header />
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
            </div>
          </div>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
