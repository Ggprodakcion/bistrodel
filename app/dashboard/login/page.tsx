"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react" // Импортируем Loader2 icon

export default function LoginPage() {
  const [email, setEmail] = useState("")
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
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === "client@example.com" && password === "password") {
            resolve({ success: true })
          } else {
            reject(new Error("Неверный email или пароль.")) // Симулируем ошибку API
          }
        }, 1000)
      })

      // Раскомментируйте для тестирования NetworkError:
      // if (Math.random() < 0.5) {
      //   throw new TypeError("NetworkError when attempting to fetch resource.");
      // }

      if ((response as { success: boolean }).success) {
        login(email, "client") // Используем функцию login из контекста аутентификации
        router.push("/dashboard")
      } else {
        setError("Неверный email или пароль.")
      }
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("NetworkError")) {
        setError("Ошибка сети. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.")
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Произошла неизвестная ошибка.")
      }
      console.error("Login error:", err)
    } finally {
      setIsLoading(false) // Завершаем загрузку
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Вход в личный кабинет</CardTitle>
          <CardDescription>Введите свои учетные данные для доступа к личному кабинету.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
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
          <div className="mt-4 text-center text-sm">
            Нет аккаунта?{" "}
            <Link href="/dashboard/register" className="underline" prefetch={false}>
              Зарегистрироваться
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
