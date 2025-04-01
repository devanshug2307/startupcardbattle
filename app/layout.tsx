import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Startup Card Battle",
  description: "A strategic card game of innovation & power",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <a
          target="_blank"
          href="https://jam.pieter.com"
          style={{
            fontFamily: "system-ui, sans-serif",
            position: "fixed",
            bottom: "-1px",
            right: "-1px",
            padding: "7px",
            fontSize: "14px",
            fontWeight: "bold",
            background: "#fff",
            color: "#000",
            textDecoration: "none",
            zIndex: 10000,
            borderTopLeftRadius: "12px",
            border: "1px solid #fff",
          }}
        >
          🕹️ Vibe Jam 2025
        </a>
      </body>
    </html>
  );
}
