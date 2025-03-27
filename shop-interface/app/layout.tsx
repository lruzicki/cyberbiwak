import type React from "react"
import { SonnerProvider } from "@/components/sonner-provider"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SonnerProvider />
      </body>
    </html>
  )
}

