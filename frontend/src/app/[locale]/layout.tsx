import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VisionDeck",
  description: "Everything ingenious is simple",
};

export default async function RootLayout({
    children,
    params: { locale },
  }: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
  }>) {

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
        {children}
        <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
