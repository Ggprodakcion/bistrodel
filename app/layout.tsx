import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider" // Импортируем AuthProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "БыстроДел",
  description: "Ваши Цифровые Решения, Воплощенные в Жизнь",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {" "}
            {/* Оборачиваем children в AuthProvider */}
            <div className="fade-in-page min-h-screen flex flex-col">{children}</div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
