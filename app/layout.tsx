import type { Metadata } from 'next'
import { Geist_Mono, Inter } from "next/font/google"

import { ReduxProvider } from "@/shared/presentation/store/provider";

import { cn } from "@lib/utils";

import "./globals.css"
import MainLayout from '@/shared/presentation/components/templates/main-layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: 'Member Directory - FE Assignment',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
