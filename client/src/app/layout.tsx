import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";
import CartContextProvider from "@/contexts/CartProvider";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Decorative Designs by AK",
  description: "hello",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClientLayout>
        <Header />
        {children}
      </ClientLayout>
    </html>
  );
}
