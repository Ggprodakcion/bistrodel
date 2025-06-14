"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, Trash2, LifeBuoy, BarChart, MessageCircle } from "lucide-react"

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
  chatMessages: Message[] // Обновлено
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newTicketsCount, setNewTicketsCount] = useState(0)
  const [filterStatus, setFilterStatus] = useState("Все")
  const [sortKey, setSortKey] = useState("date-desc")

  useEffect(() => {
    const authStatus = localStorage.getItem("isAdminAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      loadOrders()
      checkNewTickets()
      const orderInterval = setInterval(loadOrders, 5000)
      const ticketInterval = setInterval(checkNewTickets, 5000)
      return () => {
        clearInterval(orderInterval)
        clearInterval(ticketInterval)
      }
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const loadOrders = () => {
    const storedOrders: Order[] = JSON.parse(localStorage.getItem("clientOrders") || "[]")
    setOrders(storedOrders)
  }

  const checkNewTickets = () => {
    const storedTickets = JSON.parse(localStorage.getItem("supportTickets") || "[]")
    const unreadCount = storedTickets.filter((ticket: any) => ticket.isUnread).length
    setNewTicketsCount(unreadCount)
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      localStorage.setItem("clientOrders", JSON.stringify(updatedOrders))
      return updatedOrders
    })
    console.log(`Статус заказа ${orderId} изменен на: ${newStatus}`)
  }

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить заказ №${orderId.split("-")[1]}?`)) {
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.filter((order) => order.id !== orderId)
        localStorage.setItem("clientOrders", JSON.stringify(updatedOrders))
        return updatedOrders
      })
      alert(`Заказ №${orderId.split("-")[1]} удален.`)
    }
  }

  const handleDeleteCompleted = () => {
    if (window.confirm("Вы уверены, что хотите удалить ВСЕ завершенные и отмененные заказы?")) {
      const updatedOrders = orders.filter((order) => order.status !== "Завершено" && order.status !== "Отменен")
      setOrders(updatedOrders)
      localStorage.setItem("clientOrders", JSON.stringify(updatedOrders))
      alert("Все завершенные и отмененные заказы удалены из списка.")
    }
  }

  const filteredAndSortedOrders = useMemo(() => {
    let currentOrders = [...orders]

    if (filterStatus !== "Все") {
      currentOrders = currentOrders.filter((order) => order.status === filterStatus)
    }

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
              <Trash2 className="h-4 w-4 mr-2" /> Удалить завершенные/отмененные
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
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteOrder(order.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Удалить</span>
                              </Button>
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
