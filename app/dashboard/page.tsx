"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle, History, Download, User, LifeBuoy } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { NotificationBadge } from "@/components/notification-badge" // Импорт NotificationBadge

// Тип для сообщения
interface Message {
  id: number
  sender: "client" | "manager"
  text?: string
  fileUrl?: string
  fileName?: string
  timestamp: string
}

// Тип для заказа
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
  adminHasUnreadMessages?: boolean
  clientHasUnreadMessages?: boolean
}

interface SupportTicket {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "Новое" | "В работе" | "Завершено" | "Отклонено"
  date: string
  isUnread: boolean // Для админа
  clientHasUnreadMessages: boolean // Для клиента
  chatMessages: Message[]
}

export default function ClientDashboardPage() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [clientOrders, setClientOrders] = useState<Order[]>([])
  const [currentClientEmail, setCurrentClientEmail] = useState<string | null>(null)
  const [clientSupportTickets, setClientSupportTickets] = useState<SupportTicket[]>([]) // Новое состояние для обращений

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dashboard/login")
      return
    }

    const email = localStorage.getItem("currentClientEmail")
    setCurrentClientEmail(email)

    const loadClientOrders = () => {
      const allOrders: Order[] = JSON.parse(localStorage.getItem("clientOrders") || "[]")
      const filteredOrders = allOrders.filter((order) => order.clientEmail === email)
      setClientOrders(filteredOrders)

      const allTickets: SupportTicket[] = JSON.parse(localStorage.getItem("supportTickets") || "[]")
      const filteredTickets = allTickets.filter((ticket) => ticket.email === email)
      setClientSupportTickets(filteredTickets)
    }

    loadClientOrders()
    const interval = setInterval(loadClientOrders, 5000)
    return () => clearInterval(interval)
  }, [isAuthenticated, router])

  const totalUnreadOrders = clientOrders.filter((order) => order.clientHasUnreadMessages).length
  const totalUnreadSupportTickets = clientSupportTickets.filter((ticket) => ticket.clientHasUnreadMessages).length

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="w-full py-6 px-4 md:px-6 bg-gray-900 text-white flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold hover:underline" prefetch={false}>
          <ArrowLeft className="h-5 w-5" />
          <span>На главную</span>
        </Link>
        <h1 className="text-2xl font-bold">Личный Кабинет Клиента</h1>
        <Button variant="default" size="sm" onClick={logout}>
          Выйти
        </Button>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Ваши Заказы
            <NotificationBadge count={totalUnreadOrders} className="ml-2" />
          </h2>

          {clientOrders.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">У вас пока нет активных заказов.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clientOrders.map((order) => (
                <Card key={order.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl">Заказ №{order.id.split("-")[1]}</CardTitle>
                    <CardDescription>Услуга: {order.service}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Статус:</span> {order.status}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Дата:</span> {order.date}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Детали:</span> {order.details}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      {order.canDiscuss && (
                        <Link href={`/dashboard/${order.id}/chat`} passHref>
                          <Button size="sm" className="flex-1 relative">
                            <MessageCircle className="h-4 w-4 mr-2" /> Обсудить
                            <NotificationBadge count={order.clientHasUnreadMessages ? 1 : 0} />
                          </Button>
                        </Link>
                      )}
                      {order.canDownload && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" /> Скачать
                        </Button>
                      )}
                      {!order.canDiscuss && !order.canDownload && (
                        <Button size="sm" variant="outline" className="flex-1" disabled>
                          Действий нет
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Дополнительные возможности</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#" passHref>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" /> История заказов
              </Button>
            </Link>
            <Link href="/dashboard/support" passHref>
              <Button variant="outline" className="relative">
                <LifeBuoy className="h-4 w-4 mr-2" /> Поддержка (Чат)
                <NotificationBadge count={totalUnreadSupportTickets} />
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button variant="outline">FAQ</Button>
            </Link>
            <Link href="/dashboard/profile" passHref>
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" /> Мой Профиль
              </Button>
            </Link>
          </div>
        </div>
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
