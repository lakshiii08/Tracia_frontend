import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppDataProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "TRACIA - Operator Authentication",
  description: "Trace, Relationship & Criminal Intelligence Analytics",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen w-full overflow-x-hidden antialiased`}
      >
        <AppDataProvider>{children}</AppDataProvider>
      </body>
    </html>
  );
}
