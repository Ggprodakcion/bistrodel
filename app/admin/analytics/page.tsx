"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart, PieChartIcon } from "lucide-react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import { useRouter } from "next/navigation"

// Моковые данные для заказов (должны быть такими же, как в admin/page.tsx)
const mockAdminOrders = [
  {
    id: "ORDER-1701234567890",
    service: "Текстовые услуги",
    status: "В работе",
    date: "2025-06-10",
    clientName: "Анна Смирнова",
    clientEmail: "anna.s@example.com",
    clientPhone: "+79001234567",
    details: "Написание 5 SEO-статей для блога о технологиях. Срок: 3 дня. Бюджет: 15000 руб.",
  },
  {
    id: "ORDER-1701234567891",
    service: "Видеомонтаж",
    status: "Ожидает обсуждения",
    date: "2025-06-12",
    clientName: "Петр Иванов",
    clientEmail: "petr.i@example.com",
    clientPhone: "+79009876543",
    details: "Монтаж рекламного ролика для нового продукта. Длительность: 30 сек. Нужен футаж.",
  },
  {
    id: "ORDER-1701234567892",
    service: "Презентации",
    status: "Завершено",
    date: "2025-06-05",
    clientName: "Мария Кузнецова",
    clientEmail: "maria.k@example.com",
    clientPhone: "+79005554433",
    details: "Разработка корпоративной презентации для годового отчета. 20 слайдов.",
  },
  {
    id: "ORDER-1701234567893",
    service: "Сайты",
    status: "Новый",
    date: "2025-06-13",
    clientName: "Дмитрий Васильев",
    clientEmail: "dmitry.v@example.com",
    clientPhone: "+79001112233",
    details: "Создание лендинга для нового стартапа. Сбор заявок. Срок: 7 дней.",
  },
  {
    id: "ORDER-1701234567894",
    service: "Текстовые услуги",
    status: "В работе",
    date: "2025-06-14",
    clientName: "Ольга Сидорова",
    clientEmail: "olga.s@example.com",
    clientPhone: "+79007778899",
    details: "Рерайтинг статей для новостного портала.",
  },
  {
    id: "ORDER-1701234567895",
    service: "Боты",
    status: "Новый",
    date: "2025-06-15",
    clientName: "Игорь Николаев",
    clientEmail: "igor.n@example.com",
    clientPhone: "+79002223344",
    details: "Разработка Telegram-бота для поддержки клиентов.",
  },
]

interface SupportTicket {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "Новое" | "В работе" | "Завершено" | "Отклонено"
  date: string
  isUnread: boolean
  chatMessages: { id: number; sender: "client" | "manager"; text: string; timestamp: string }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([])

  useEffect(() => {
    const authStatus = localStorage.getItem("isAdminAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      const storedTickets: SupportTicket[] = JSON.parse(localStorage.getItem("supportTickets") || "[]")
      setSupportTickets(storedTickets)
    } else {
      router.push("/admin/login")
    }
  }, [router])

  // Аналитика по заказам
  const ordersByStatus = useMemo(() => {
    const statusCounts: { [key: string]: number } = {}
    mockAdminOrders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })
    return Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }))
  }, [])

  const ordersByService = useMemo(() => {
    const serviceCounts: { [key: string]: number } = {}
    mockAdminOrders.forEach((order) => {
      serviceCounts[order.service] = (serviceCounts[order.service] || 0) + 1
    })
    return Object.keys(serviceCounts).map((service) => ({
      name: service,
      value: serviceCounts[service],
    }))
  }, [])

  // Аналитика по обращениям в поддержку
  const ticketsByStatus = useMemo(() => {
    const statusCounts: { [key: string]: number } = {}
    supportTickets.forEach((ticket) => {
      statusCounts[ticket.status] = (statusCounts[ticket.status] || 0) + 1
    })
    return Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }))
  }, [supportTickets])

  const totalTickets = supportTickets.length

  if (!isAuthenticated) {
    return null // Или лоадер
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="w-full py-6 px-4 md:px-6 bg-gray-900 text-white flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold hover:underline" prefetch={false}>
          <ArrowLeft className="h-5 w-5" />
          <span>К админ-панели</span>
        </Link>
        <h1 className="text-2xl font-bold">Аналитика</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            localStorage.removeItem("isAdminAuthenticated")
            router.push("/admin/login")
          }}
          className="text-white border-white hover:bg-gray-700"
        >
          Выйти
        </Button>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Обзор Статистики</h2>

          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {/* Карточка: Общее количество заказов */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Всего Заказов</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAdminOrders.length}</div>
                <p className="text-xs text-muted-foreground">Общее количество заказов в системе</p>
              </CardContent>
            </Card>

            {/* Карточка: Общее количество обращений */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Всего Обращений</CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTickets}</div>
                <p className="text-xs text-muted-foreground">Общее количество обращений в поддержку</p>
              </CardContent>
            </Card>

            {/* График: Заказы по статусам */}
            <Card className="lg:col-span-2 xl:col-span-1">
              <CardHeader>
                <CardTitle>Заказы по Статусам</CardTitle>
                <CardDescription>Распределение заказов по их текущему статусу.</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {ordersByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* График: Заказы по типам услуг */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Заказы по Типам Услуг</CardTitle>
                <CardDescription>Количество заказов по каждой предлагаемой услуге.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={ordersByService} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Количество заказов" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* График: Обращения в поддержку по статусам */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Обращения в Поддержку по Статусам</CardTitle>
                <CardDescription>Распределение обращений по их текущему статусу.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={ticketsByStatus} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#00C49F" name="Количество обращений" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
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
