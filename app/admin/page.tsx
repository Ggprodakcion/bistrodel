"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MessageCircle, Eye, Trash2, LifeBuoy, BarChart } from "lucide-react"

// Моковые данные для заказов и клиентов
const initialMockAdminOrders = [
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
    status: "Завершено", // Этот заказ будет удален
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
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState(initialMockAdminOrders)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newTicketsCount, setNewTicketsCount] = useState(0)
  const [filterStatus, setFilterStatus] = useState("Все")
  const [sortKey, setSortKey] = useState("date-desc")

  useEffect(() => {
    const authStatus = localStorage.getItem("isAdminAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      checkNewTickets()
      const interval = setInterval(checkNewTickets, 5000)
      return () => clearInterval(interval)
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const checkNewTickets = () => {
    const storedTickets = JSON.parse(localStorage.getItem("supportTickets") || "[]")
    const unreadCount = storedTickets.filter((ticket: any) => ticket.isUnread).length
    setNewTicketsCount(unreadCount)
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )
    console.log(`Статус заказа ${orderId} изменен на: ${newStatus}`)
  }

  const handleDeleteCompleted = () => {
    const updatedOrders = orders.filter((order) => order.status !== "Завершено")
    setOrders(updatedOrders)
    alert("Все завершенные заказы удалены из списка.")
  }

  // Фильтрация и сортировка заказов
  const filteredAndSortedOrders = useMemo(() => {
    let currentOrders = [...orders]

    // Фильтрация
    if (filterStatus !== "Все") {
      currentOrders = currentOrders.filter((order) => order.status === filterStatus)
    }

    // Сортировка
    currentOrders.sort((a, b) => {
      switch (sortKey) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "service-asc":
          return a.service.localeCompare(b.service)
        case "client-asc":
          return a.clientName.localeCompare(b.clientName)
        default:
          return 0
      }
    })
    return currentOrders
  }, [orders, filterStatus, sortKey])

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
        <h1 className="text-2xl font-bold">Административная Панель</h1>
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
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Управление Заказами</h2>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Все">Все статусы</SelectItem>
                  <SelectItem value="Новый">Новый</SelectItem>
                  <SelectItem value="Ожидает обсуждения">Ожидает обсуждения</SelectItem>
                  <SelectItem value="В работе">В работе</SelectItem>
                  <SelectItem value="На проверке">На проверке</SelectItem>
                  <SelectItem value="Завершено">Завершено</SelectItem>
                  <SelectItem value="Отменен">Отменен</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortKey} onValueChange={setSortKey}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Сортировать по" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Дата (новые)</SelectItem>
                  <SelectItem value="date-asc">Дата (старые)</SelectItem>
                  <SelectItem value="service-asc">Услуга (А-Я)</SelectItem>
                  <SelectItem value="client-asc">Клиент (А-Я)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="destructive" onClick={handleDeleteCompleted}>
              <Trash2 className="h-4 w-4 mr-2" /> Удалить завершенные заказы
            </Button>
          </div>

          {filteredAndSortedOrders.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Нет заказов, соответствующих фильтрам.</p>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Список Заказов</CardTitle>
                <CardDescription>Обзор всех текущих и завершенных заказов.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {" "}
                  {/* Добавлено для горизонтальной прокрутки */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Заказа</TableHead>
                        <TableHead>Услуга</TableHead>
                        <TableHead>Клиент</TableHead>
                        <TableHead>Email Клиента</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.split("-")[1]}</TableCell>
                          <TableCell>{order.service}</TableCell>
                          <TableCell>{order.clientName}</TableCell>
                          <TableCell>{order.clientEmail}</TableCell>
                          <TableCell>
                            <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Статус" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Новый">Новый</SelectItem>
                                <SelectItem value="Ожидает обсуждения">Ожидает обсуждения</SelectItem>
                                <SelectItem value="В работе">В работе</SelectItem>
                                <SelectItem value="На проверке">На проверке</SelectItem>
                                <SelectItem value="Завершено">Завершено</SelectItem>
                                <SelectItem value="Отменен">Отменен</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/dashboard/${order.id}/chat`} passHref>
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-4 w-4 mr-1" /> Чат
                                </Button>
                              </Link>
                              <Link href={`/admin/orders/${order.id}`} passHref>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" /> Детали
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Разделы Админ-панели</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admin/support" passHref>
              <Button variant="outline" className="relative">
                <LifeBuoy className="h-4 w-4 mr-2" /> Обращения в поддержку
                {newTicketsCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {newTicketsCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/admin/analytics" passHref>
              <Button variant="outline">
                <BarChart className="h-4 w-4 mr-2" /> Аналитика
              </Button>
            </Link>
            {/* Дополнительные разделы админ-панели можно добавить здесь */}
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
