import { Quicksand } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"

const fontMono = Quicksand({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.className)}
    >
      <body>{children}</body>
    </html>
  )
}
