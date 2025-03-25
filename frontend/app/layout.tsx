import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SidebarDemo } from "@/components/sidebar-demo";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "FisioFind",
  description: "Find your physiotherapist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Use Next.js Script component for better performance */}
        <Script
          src="https://animatedicons.co/scripts/embed-animated-icons.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
        style={{ backgroundColor: "rgb(238, 251, 250)" }}
      >
        <div className="flex min-h-screen">
          <SidebarDemo />
          <main className="flex-1 transition-all duration-300 h-screen overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
