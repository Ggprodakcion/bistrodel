"use client"

import type React from "react"
import type { HTMLDivElement } from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Send } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Message {
  id: number
  sender: "client" | "manager"
  text: string
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
  chatMessages: Message[]
}

export default function ClientSupportChatPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.ticketId as string
  const { isAuthenticated, logout } = useAuth()

  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dashboard/login")
      return
    }

    const loadTicketData = () => {
      const storedTickets: SupportTicket[] = JSON.parse(localStorage.getItem("supportTickets") || "[]")
      const foundTicket = storedTickets.find((t) => t.id === ticketId)
      const currentClientEmail = localStorage.getItem("currentClientEmail")

      if (foundTicket && foundTicket.email === currentClientEmail) {
        setTicket(foundTicket)
        setMessages(foundTicket.chatMessages)
      } else {
        router.push("/dashboard/support") // Перенаправляем, если тикет не найден или не принадлежит текущему клиенту
      }
    }

    loadTicketData()
    const interval = setInterval(loadTicketData, 3000) // Обновляем чат каждые 3 секунды
    return () => clearInterval(interval)
  }, [isAuthenticated, router, ticketId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && ticket) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "client",
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      const updatedMessages = [...messages, newMsg]
      setMessages(updatedMessages)
      setNewMessage("")

      // Обновляем localStorage
      const storedTickets: SupportTicket[] = JSON.parse(localStorage.getItem("supportTickets") || "[]")
      const updatedTickets = storedTickets.map((t) =>
        t.id === ticket.id ? { ...t, chatMessages: updatedMessages } : t,
      )
      localStorage.setItem("supportTickets", JSON.stringify(updatedTickets))

      // Simulate manager's response (optional, for demo purposes)
      setTimeout(() => {
        const managerResponse: Message = {
          id: updatedMessages.length + 1,
          sender: "manager",
          text: "Ваше сообщение получено. Менеджер скоро ответит.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        const finalMessages = [...updatedMessages, managerResponse]
        setMessages(finalMessages)
        const finalTickets = storedTickets.map((t) => (t.id === ticket.id ? { ...t, chatMessages: finalMessages } : t))
        localStorage.setItem("supportTickets", JSON.stringify(finalTickets))
      }, 1500)
    }
  }

  if (!isAuthenticated || !ticket) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="w-full py-6 px-4 md:px-6 bg-gray-900 text-white flex items-center justify-between">
        <Link
          href="/dashboard/support"
          className="flex items-center gap-2 text-lg font-semibold hover:underline"
          prefetch={false}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>К обращениям</span>
        </Link>
        <h1 className="text-2xl font-bold">Чат по Обращению №{ticket.id.split("-")[1]}</h1>
        <Button variant="outline" size="sm" onClick={logout} className="text-white border-white hover:bg-gray-700">
          Выйти
        </Button>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4 md:px-6 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Тема: {ticket.subject}</CardTitle>
            <CardDescription>Статус: {ticket.status}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800 rounded-md mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === "client"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-75 mt-1 block text-right">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text"
                placeholder="Напишите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Отправить</span>
              </Button>
            </form>
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
