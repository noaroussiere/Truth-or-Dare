import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { Toaster } from "@/components/ui/toaster" // Import the Toaster component

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Truth or Dare Game",
  description: "A modern Truth or Dare game built with Next.js and React",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster/>
      </body>
    </html>
  )
}