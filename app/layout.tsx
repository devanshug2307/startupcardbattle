import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Startup Card Battle",
  description: "A strategic card game of innovation & power",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
