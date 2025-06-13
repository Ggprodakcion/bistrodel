"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Импортируем useRouter
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider" // Импортируем useAuth

// Тип для профиля пользователя
interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

export default function ClientProfilePage() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile>({
    id: "CLIENT-12345", // Моковый ID клиента
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dashboard/login") // Перенаправляем на страницу входа, если не аутентифицирован
      return
    }

    // Загрузка данных профиля из localStorage при монтировании компонента
    const storedProfile = localStorage.getItem("clientProfile")
    const currentClientEmail = localStorage.getItem("currentClientEmail") // Получаем email текущего пользователя

    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile)
      // Если профиль в localStorage не соответствует текущему пользователю,
      // или если профиль не содержит email, инициализируем новый
      if (parsedProfile.email === currentClientEmail) {
        setProfile(parsedProfile)
      } else {
        // Если профиль не соответствует, создаем новый или загружаем по email
        const initialProfile: UserProfile = {
          id: `CLIENT-${Date.now()}`, // Генерируем новый ID
          name: "Новый Пользователь",
          email: currentClientEmail || "", // Используем email из аутентификации
          phone: "",
          address: "",
        }
        setProfile(initialProfile)
        localStorage.setItem("clientProfile", JSON.stringify(initialProfile))
      }
    } else {
      // Если профиля нет, инициализируем его моковыми данными
      const initialProfile: UserProfile = {
        id: `CLIENT-${Date.now()}`,
        name: "Новый Пользователь",
        email: currentClientEmail || "",
        phone: "",
        address: "",
      }
      setProfile(initialProfile)
      localStorage.setItem("clientProfile", JSON.stringify(initialProfile))
    }
  }, [isAuthenticated, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setProfile((prevProfile) => ({
      ...prevProfile,
      [id]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    // Симуляция сохранения данных на сервере
    await new Promise((resolve) => setTimeout(resolve, 1000))
    localStorage.setItem("clientProfile", JSON.stringify(profile))
    setIsSaving(false)
    setIsEditing(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000) // Скрыть сообщение об успехе через 3 секунды
  }

  if (!isAuthenticated) {
    return null // Или лоадер, пока идет перенаправление
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="w-full py-6 px-4 md:px-6 bg-gray-900 text-white flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold hover:underline"
          prefetch={false}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>В личный кабинет</span>
        </Link>
        <h1 className="text-2xl font-bold">Мой Профиль</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={logout} // Добавляем кнопку выхода
          className="text-white border-white hover:bg-gray-700"
        >
          Выйти
        </Button>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl rounded-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" /> Личные данные
            </CardTitle>
            <CardDescription>Просматривайте и редактируйте информацию о вашем аккаунте.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id">ID Клиента</Label>
                <Input id="id" value={profile.id} disabled className="bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <Label htmlFor="name">Имя</Label>
                <Input id="name" value={profile.name} onChange={handleChange} disabled={!isEditing} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={true} // Email не должен быть редактируемым после регистрации
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" type="tel" value={profile.phone} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Адрес</Label>
                <Input id="address" value={profile.address} onChange={handleChange} disabled={!isEditing} />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Отмена
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-pulse" /> Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" /> Сохранить
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
              )}
            </div>
            {saveSuccess && (
              <p className="text-center text-green-600 dark:text-green-400 mt-4">Данные успешно сохранены!</p>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer (re-using from landing page for consistency) */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-950 text-gray-400">
        <p className="text-xs">&copy; 2025 БыстроДел. Все права защищены.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Главная
          </Link>
          <Link href="/services" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Услуги
          </Link>
          <Link href="/dashboard" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Кабинет Клиента
          </Link>
          <Link href="/admin" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Админ Панель
          </Link>
          <Link href="/contact" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Контакты
          </Link>
        </nav>
      </footer>
    </div>
  )
}
