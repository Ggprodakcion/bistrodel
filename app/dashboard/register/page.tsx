"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function ClientRegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const { register, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Пароли не совпадают.")
      return
    }

    const { success: registrationSuccess, error: registrationError } = await register(email, password)

    if (registrationSuccess) {
      setSuccess("Регистрация успешна! Теперь вы можете войти.")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setTimeout(() => router.push("/dashboard/login"), 2000)
    } else {
      setError(registrationError || "Произошла ошибка при регистрации.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md rounded-xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Регистрация Клиента</CardTitle>
          <CardDescription>Создайте новый аккаунт.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Придумайте пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}
            <Button type="submit" className="w-full" disabled={!!success}>
              Зарегистрироваться
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Уже есть аккаунт?{" "}
            <Link href="/dashboard/login" className="text-primary hover:underline" prefetch={false}>
              Войти
            </Link>
          </div>
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
