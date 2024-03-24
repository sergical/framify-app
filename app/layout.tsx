import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

import {
  EthereumWalletConnectors,
  DynamicContextProvider,
} from "@/lib/dynamic";
import { cn } from "@/lib/utils";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Framify | Stay Based",
  description: "The best way to shop online with crypto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased h-full",
          fontSans.variable
        )}
      >
        <DynamicContextProvider
          settings={{
            // Find your environment id at https://app.dynamic.xyz/dashboard/developer
            environmentId: process.env
              .NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string,
            walletConnectors: [EthereumWalletConnectors],
          }}
        >
          <Header />
          {children}
        </DynamicContextProvider>
      </body>
    </html>
  );
}
