"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MessageCircle, Trash2 } from "lucide-react"

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

export default function AdminSupportPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [filterStatus, setFilterStatus] = useState("Все")
  const [sortKey, setSortKey] = useState("date-desc")

  useEffect(() => {
    const authStatus = localStorage.getItem("isAdminAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      loadAndMarkTicketsAsRead()
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const loadAndMarkTicketsAsRead = () => {
    const storedTickets: SupportTicket[] = JSON.parse(localStorage.getItem("supportTickets") || "[]")
    const updatedTickets = storedTickets.map((ticket) => ({ ...ticket, isUnread: false }))
    setTickets(updatedTickets)
    localStorage.setItem("supportTickets", JSON.stringify(updatedTickets))
  }

  const handleStatusChange = (ticketId: string, newStatus: SupportTicket["status"]) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket)),
    )
    const updatedTickets = tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket))
    localStorage.setItem("supportTickets", JSON.stringify(updatedTickets))
    console.log(`Статус обращения ${ticketId} изменен на: ${newStatus}`)
  }

  const handleDeleteCompleted = () => {
    const updatedTickets = tickets.filter((ticket) => ticket.status !== "Завершено" && ticket.status !== "Отклонено")
    setTickets(updatedTickets)
    localStorage.setItem("supportTickets", JSON.stringify(updatedTickets))
    alert("Все завершенные и отклоненные обращения удалены из списка.")
  }

  // Фильтрация и сортировка обращений
  const filteredAndSortedTickets = useMemo(() => {
    let currentTickets = [...tickets]

    // Фильтрация
    if (filterStatus !== "Все") {
      currentTickets = currentTickets.filter((ticket) => ticket.status === filterStatus)
    }

    // Сортировка
    currentTickets.sort((a, b) => {
      switch (sortKey) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "subject-asc":
          return a.subject.localeCompare(b.subject)
        case "client-asc":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
    return currentTickets
  }, [tickets, filterStatus, sortKey])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="w-full py-6 px-4 md:px-6 bg-gray-900 text-white flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold hover:underline" prefetch={false}>
          <ArrowLeft className="h-5 w-5" />
          <span>К админ-панели</span>
        </Link>
        <h1 className="text-2xl font-bold">Обращения в Поддержку</h1>
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
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Управление Обращениями</h2>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Все">Все статусы</SelectItem>
                  <SelectItem value="Новое">Новое</SelectItem>
                  <SelectItem value="В работе">В работе</SelectItem>
                  <SelectItem value="Завершено">Завершено</SelectItem>
                  <SelectItem value="Отклонено">Отклонено</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortKey} onValueChange={setSortKey}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Сортировать по" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Дата (новые)</SelectItem>
                  <SelectItem value="date-asc">Дата (старые)</SelectItem>
                  <SelectItem value="subject-asc">Тема (А-Я)</SelectItem>
                  <SelectItem value="client-asc">Клиент (А-Я)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="destructive" onClick={handleDeleteCompleted}>
              <Trash2 className="h-4 w-4 mr-2" /> Удалить завершенные/отклоненные
            </Button>
          </div>

          {filteredAndSortedTickets.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Нет обращений, соответствующих фильтрам.</p>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Список Обращений</CardTitle>
                <CardDescription>Обзор всех текущих и завершенных обращений.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {" "}
                  {/* Добавлено для горизонтальной прокрутки */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Тема</TableHead>
                        <TableHead>Клиент</TableHead>
                        <TableHead>Email Клиента</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedTickets.map((ticket) => (
                        <TableRow
                          key={ticket.id}
                          className={ticket.isUnread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}
                        >
                          <TableCell className="font-medium">{ticket.id.split("-")[1]}</TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>{ticket.name}</TableCell>
                          <TableCell>{ticket.email}</TableCell>
                          <TableCell>
                            <Select
                              value={ticket.status}
                              onValueChange={(value: SupportTicket["status"]) => handleStatusChange(ticket.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Статус" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Новое">Новое</SelectItem>
                                <SelectItem value="В работе">В работе</SelectItem>
                                <SelectItem value="Завершено">Завершено</SelectItem>
                                <SelectItem value="Отклонено">Отклонено</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{ticket.date}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/support/${ticket.id}/chat`} passHref>
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-4 w-4 mr-1" /> Чат
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
