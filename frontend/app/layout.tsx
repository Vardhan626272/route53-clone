import type { Metadata } from "next";

import { ToastContainer, ToastProvider } from "@/components/ui/Toast";

import "./globals.css";

export const metadata: Metadata = {
  title: "Route 53 | AWS Console Clone",
  description: "AWS Route53 clone for hosted zone and DNS record management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-aws-bg font-sans text-aws-text antialiased">
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
