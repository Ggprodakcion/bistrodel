"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react" // Импортируем Loader2 icon

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Новое состояние загрузки
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true) // Начинаем загрузку

    try {
      // Симулируем API-вызов для аутентификации
      // В реальном приложении это был бы fetch к вашему бэкенд API
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (password === adminPassword) {
            resolve({ success: true })
          } else {
            reject(new Error("Неверный пароль администратора.")) // Симулируем ошибку API
          }
        }, 1000)
      })

      // Раскомментируйте для тестирования NetworkError:
      // if (Math.random() < 0.5) {
      //   throw new TypeError("NetworkError when attempting to fetch resource.");
      // }

      if ((response as { success: boolean }).success) {
        login("admin", "admin") // Используем функцию login из контекста аутентификации
        router.push("/admin")
      } else {
        setError("Неверный пароль администратора.")
      }
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("NetworkError")) {
        setError("Ошибка сети. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.")
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Произошла неизвестная ошибка.")
      }
      console.error("Admin login error:", err)
    } finally {
      setIsLoading(false) // Завершаем загрузку
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Вход в Админ Панель</CardTitle>
          <CardDescription>Введите пароль администратора для доступа.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
