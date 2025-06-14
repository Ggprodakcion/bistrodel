"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, User, KeyRound, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

// Тип для профиля пользователя
interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  lastUpdated?: string
}

// Тип для сообщения (для очистки чатов при удалении аккаунта)
interface Message {
  id: number
  sender: "client" | "manager"
  text?: string
  fileUrl?: string
  fileName?: string
  timestamp: string
}

// Тип для заказа (для очистки чатов при удалении аккаунта)
interface Order {
  id: string
  service: string
  status: string
  date: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  details: string
  canDiscuss: boolean
  canDownload: boolean
  chatMessages: Message[]
}

// Тип для обращения в поддержку (для очистки чатов при удалении аккаунта)
interface SupportTicket {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "Новое" | "В работе" | "Завершено" | "Отклонено"
  date: string
  isUnread: boolean
  chatMessages: Message[]
}

export default function ClientProfilePage() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile>({
    id: "CLIENT-12345",
    name: "",
    email: "",
    phone: "",
    address: "",
    lastUpdated: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [passwordChange, setPasswordChange] = useState({
    current: "",
    new: "",
    confirmNew: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dashboard/login")
      return
    }

    const storedProfile = localStorage.getItem("clientProfile")
    const currentClientEmail = localStorage.getItem("currentClientEmail")

    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile)
      if (parsedProfile.email === currentClientEmail) {
        setProfile(parsedProfile)
      } else {
        const initialProfile: UserProfile = {
          id: `CLIENT-${Date.now()}`,
          name: "Новый Пользователь",
          email: currentClientEmail || "",
          phone: "",
          address: "",
          lastUpdated: new Date().toLocaleString("ru-RU"),
        }
        setProfile(initialProfile)
        localStorage.setItem("clientProfile", JSON.stringify(initialProfile))
      }
    } else {
      const initialProfile: UserProfile = {
        id: `CLIENT-${Date.now()}`,
        name: "Новый Пользователь",
        email: currentClientEmail || "",
        phone: "",
        address: "",
        lastUpdated: new Date().toLocaleString("ru-RU"),
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
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const updatedProfile = { ...profile, lastUpdated: new Date().toLocaleString("ru-RU") }
    localStorage.setItem("clientProfile", JSON.stringify(updatedProfile))
    setProfile(updatedProfile)
    setIsSaving(false)
    setIsEditing(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    const storedUsers = JSON.parse(localStorage.getItem("clientUsers") || "[]")
    const currentUserEmail = localStorage.getItem("currentClientEmail")
    const userIndex = storedUsers.findIndex((u: any) => u.email === currentUserEmail)

    if (userIndex === -1) {
      setPasswordError("Пользователь не найден.")
      return
    }

    const currentUser = storedUsers[userIndex]

    if (currentUser.password !== passwordChange.current) {
      setPasswordError("Текущий пароль неверен.")
      return
    }

    if (passwordChange.new.length < 6) {
      setPasswordError("Новый пароль должен быть не менее 6 символов.")
      return
    }

    if (passwordChange.new !== passwordChange.confirmNew) {
      setPasswordError("Новый пароль и подтверждение не совпадают.")
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    currentUser.password = passwordChange.new
    storedUsers[userIndex] = currentUser
    localStorage.setItem("clientUsers", JSON.stringify(storedUsers))

    setPasswordSuccess("Пароль успешно изменен!")
    setPasswordChange({ current: "", new: "", confirmNew: "" })
    setTimeout(() => setPasswordSuccess(""), 3000)
  }

  const handleDeleteAccount = () => {
    if (window.confirm("Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.")) {
      const storedUsers = JSON.parse(localStorage.getItem("clientUsers") || "[]")
      const currentUserEmail = localStorage.getItem("currentClientEmail")
      const updatedUsers = storedUsers.filter((u: any) => u.email !== currentUserEmail)
      localStorage.setItem("clientUsers", JSON.stringify(updatedUsers))

      // Удаляем профиль
      localStorage.removeItem("clientProfile")

      // Удаляем заказы и обращения, связанные с этим email
      const allOrders: Order[] = JSON.parse(localStorage.getItem("clientOrders") || "[]")
      const remainingOrders = allOrders.filter((order) => order.clientEmail !== currentUserEmail)
      localStorage.setItem("clientOrders", JSON.stringify(remainingOrders))

      const allTickets: SupportTicket[] = JSON.parse(localStorage.getItem("supportTickets") || "[]")
      const remainingTickets = allTickets.filter((ticket) => ticket.email !== currentUserEmail)
      localStorage.setItem("supportTickets", JSON.stringify(remainingTickets))

      logout()
      alert("Ваш аккаунт был успешно удален.")
    }
  }

  if (!isAuthenticated) {
    return null
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
        <Button variant="outline" size="sm" onClick={logout} className="text-white border-white hover:bg-gray-700">
          Выйти
        </Button>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-6 flex flex-col items-center">
        <Card className="w-full max-w-3xl rounded-xl shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" /> Личные данные
            </CardTitle>
            <CardDescription>Просматривайте и редактируйте информацию о вашем аккаунте.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                <img
                  src="/placeholder.svg?height=96&width=96"
                  alt="Аватар пользователя"
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-lg font-semibold">{profile.name || "Имя не указано"}</p>
              {profile.lastUpdated && (
                <p className="text-sm text-gray-500 dark:text-gray-400">Последнее обновление: {profile.lastUpdated}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id">ID Клиента</Label>
                <Input id="id" value={profile.id} disabled className="bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={true}
                  className="bg-gray-50 dark:bg-gray-800"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Имя</Label>
                <Input id="name" value={profile.name} onChange={handleChange} disabled={!isEditing} required />
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

        <Card className="w-full max-w-3xl rounded-xl shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <KeyRound className="h-6 w-6" /> Изменить пароль
            </CardTitle>
            <CardDescription>Обновите свой пароль для повышения безопасности.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="current-password">Текущий пароль</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordChange.current}
                  onChange={(e) => setPasswordChange({ ...passwordChange, current: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-password">Новый пароль</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordChange.new}
                  onChange={(e) => setPasswordChange({ ...passwordChange, new: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm-new-password">Подтвердите новый пароль</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={passwordChange.confirmNew}
                  onChange={(e) => setPasswordChange({ ...passwordChange, confirmNew: e.target.value })}
                  required
                />
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}
              <Button type="submit" className="w-full">
                Изменить пароль
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="w-full max-w-3xl rounded-xl shadow-xl border-destructive/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
              <Trash2 className="h-6 w-6" /> Зона Опасности
            </CardTitle>
            <CardDescription>Действия, которые могут повлиять на ваш аккаунт.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-gray-700 dark:text-gray-300">Удалить аккаунт безвозвратно.</p>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Удалить аккаунт
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

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
