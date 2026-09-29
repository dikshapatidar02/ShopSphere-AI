import { AccessibilityAnnouncer } from "@/components/common/AccessibilityAnnouncer";
import { QueryProvider } from "@/components/providers/query-provider";
import { AssistantPanel } from "@/features/ai-assistant";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopSphere AI — Intelligent E-Commerce Platform",
  description:
    "An advanced frontend-first intelligent e-commerce platform powered by modern web technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-background text-foreground`}>
        <a href="#main-content" className="sr-only sr-only-focusable">
          Skip to main content
        </a>
        <QueryProvider>
          {children}
          <AssistantPanel />
          <AccessibilityAnnouncer />
        </QueryProvider>
      </body>
    </html>
  );
}
