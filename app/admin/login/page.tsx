"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Используем переменную окружения для пароля администратора
    // В Vercel она будет доступна как NEXT_PUBLIC_ADMIN_PASSWORD
    // Для локального тестирования можно использовать значение по умолчанию, например "admin123"
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

    if (password === adminPassword) {
      localStorage.setItem("isAdminAuthenticated", "true")
      router.push("/admin")
    } else {
      setError("Неверный пароль. Пожалуйста, попробуйте снова.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md rounded-xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Вход для Администратора</CardTitle>
          <CardDescription>Введите пароль для доступа к админ-панели.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:underline" prefetch={false}>
              <ArrowLeft className="inline-block h-4 w-4 mr-1" />
              Вернуться на главную
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
