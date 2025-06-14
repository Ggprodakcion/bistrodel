"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MessageCircle, LifeBuoy } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

// Тип для сообщения
interface Message {
  id: number
  sender: "client" | "manager"
  text?: string
  fileUrl?: string
  fileName?: string
  timestamp: string
}

interface SupportTicket {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "Новое" | "В работе" | "Завершено" | "Отклонено"
  date: string
  isUnread: boolean
  chatMessages: Message[] // Обновлено
}

export default function ClientSupportPage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [currentClientEmail, setCurrentClientEmail] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("Все")
  const [sortKey, setSortKey] = useState("date-desc")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dashboard/login")
      return
    }

    const email = localStorage.getItem("currentClientEmail")
    setCurrentClientEmail(email)

    const loadTickets = () => {
      const storedTickets: SupportTicket[] = JSON.parse(localStorage.getItem("supportTickets") || "[]")
      const filteredTickets = storedTickets.filter((ticket) => ticket.email === email)
      setTickets(filteredTickets)
    }

    loadTickets()
    const interval = setInterval(loadTickets, 5000)
    return () => clearInterval(interval)
  }, [isAuthenticated, router])

  const filteredAndSortedTickets = useMemo(() => {
    let currentTickets = [...tickets]

    if (filterStatus !== "Все") {
      currentTickets = currentTickets.filter((ticket) => ticket.status === filterStatus)
    }

    currentTickets.sort((a, b) => {
      switch (sortKey) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "subject-asc":
          return a.subject.localeCompare(b.subject)
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
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold hover:underline"
          prefetch={false}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>В личный кабинет</span>
        </Link>
        <h1 className="text-2xl font-bold">Мои Обращения в Поддержку</h1>
        <Button variant="outline" size="sm" onClick={logout} className="text-white border-white hover:bg-gray-700">
          Выйти
        </Button>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Ваши Обращения</h2>

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
                </SelectContent>
              </Select>
            </div>
            <Link href="/contact" passHref>
              <Button>
                <LifeBuoy className="h-4 w-4 mr-2" /> Создать новое обращение
              </Button>
            </Link>
          </div>

          {filteredAndSortedTickets.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">У вас пока нет обращений в поддержку.</p>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Список Обращений</CardTitle>
                <CardDescription>Обзор всех ваших обращений в службу поддержки.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Тема</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id.split("-")[1]}</TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>{ticket.status}</TableCell>
                          <TableCell>{ticket.date}</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/dashboard/support/${ticket.id}/chat`} passHref>
                              <Button variant="outline" size="sm">
                                <MessageCircle className="h-4 w-4 mr-1" /> Чат
                              </Button>
                            </Link>
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
