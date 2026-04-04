import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zorvyn",
  description: "Zorvyn fintech dashboard built with Next.js App Router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
