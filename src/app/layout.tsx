import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omni-Supervisor | AI Observability Dashboard",
  description: "Real-time monitoring of AI chatbot conversations with automatic detection of hallucinations and user frustration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
