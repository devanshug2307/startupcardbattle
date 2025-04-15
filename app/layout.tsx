import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Startup Battle",
  description: "A strategic card game for startup enthusiasts",
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
        <div className="relative">
          <div
            className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#2C0855,#0A0118_50%)]"
            style={{
              zIndex: -10000,
            }}
          />
          {children}
        </div>
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
