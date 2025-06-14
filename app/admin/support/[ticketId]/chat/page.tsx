"use client"

import { Label } from "@/components/ui/label"

import { CardDescription } from "@/components/ui/card"

import type React from "react"
import type { HTMLDivElement } from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Send,
  Paperclip,
  FileText,
  FileImage,
  FileArchive,
  FileSpreadsheet,
  FileQuestion,
} from "lucide-react"

interface Message {
  id: number
  sender: "client" | "manager"
  text?: string // Текст может быть опциональным, если это файл
  fileUrl?: string // URL файла
  fileName?: string // Имя файла
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
  isUnread: boolean // Для админа
  clientHasUnreadMessages: boolean // Для клиента
  chatMessages: Message[]
}

// Вспомогательная функция для получения иконки файла
const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      return <FileText className="h-4 w-4" />
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
      return <FileImage className="h-4 w-4" /> // Для изображений будет превью, но иконка тоже может быть полезна
    case "zip":
    case "rar":
    case "7z":
      return <FileArchive className="h-4 w-4" />
    case "xls":
    case "xlsx":
      return <FileSpreadsheet className="h-4 w-4" />
    default:
      return <FileQuestion className="h-4 w-4" />
  }
}

// Вспомогательная функция для проверки, является ли файл изображением
const isImageFile = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension || "")
}

export default function AdminSupportChatPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.ticketId as string

  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadTicketData = () => {
      const storedTickets: SupportTicket[] = JSON.parse(localStorage.getItem("supportTickets") || "[]")
      const foundTicket = storedTickets.find((t) => t.id === ticketId)
      if (foundTicket) {
        const updatedTicket = { ...foundTicket, isUnread: false }
        setTicket(updatedTicket)
        setMessages(updatedTicket.chatMessages)
        updateTicketInLocalStorage(
          updatedTicket.id,
          updatedTicket.chatMessages,
          false,
          updatedTicket.clientHasUnreadMessages,
        )
      } else {
        router.push("/admin/support")
      }
    }

    loadTicketData()
    const interval = setInterval(loadTicketData, 3000)
    return () => clearInterval(interval)
  }, [ticketId, router])

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
        sender: "manager",
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      const updatedMessages = [...messages, newMsg]
      setMessages(updatedMessages)
      setNewMessage("")

      updateTicketInLocalStorage(ticket.id, updatedMessages, false, true)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && ticket) {
      const fileUrl = `/placeholder.svg?width=100&height=100`
      const newFileMsg: Message = {
        id: messages.length + 1,
        sender: "manager",
        fileUrl: fileUrl,
        fileName: file.name,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      const updatedMessages = [...messages, newFileMsg]
      setMessages(updatedMessages)

      updateTicketInLocalStorage(ticket.id, updatedMessages, false, true)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const updateTicketInLocalStorage = (
    currentTicketId: string,
    updatedMessages: Message[],
    adminUnread: boolean,
    clientUnread: boolean,
  ) => {
    const storedTickets: SupportTicket[] = JSON.parse(localStorage.getItem("supportTickets") || "[]")
    const updatedTickets = storedTickets.map((t) =>
      t.id === currentTicketId
        ? { ...t, chatMessages: updatedMessages, isUnread: adminUnread, clientHasUnreadMessages: clientUnread }
        : t,
    )
    localStorage.setItem("supportTickets", JSON.stringify(updatedTickets))
  }

  if (!ticket) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="w-full py-6 px-4 md:px-6 bg-gray-900 text-white flex items-center justify-between">
        <Link
          href="/admin/support"
          className="flex items-center gap-2 text-lg font-semibold hover:underline"
          prefetch={false}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>К обращениям</span>
        </Link>
        <h1 className="text-2xl font-bold">Чат по Обращению №{ticket.id.split("-")[1]}</h1>
        <div className="w-10" /> {/* Placeholder for alignment */}
      </header>

      <main className="flex-1 container mx-auto py-8 px-4 md:px-6 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Тема: {ticket.subject}</CardTitle>
            <CardDescription>
              От: {ticket.name} ({ticket.email}) | Статус: {ticket.status}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800 rounded-md mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "manager" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === "manager"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {msg.text && <p className="text-sm">{msg.text}</p>}
                    {msg.fileUrl && msg.fileName && (
                      <div className="flex flex-col items-start gap-2">
                        {isImageFile(msg.fileName) ? (
                          <img
                            src={msg.fileUrl || "/placeholder.svg"}
                            alt={msg.fileName}
                            className="max-w-full h-auto rounded-md object-contain"
                            style={{ maxWidth: "150px", maxHeight: "150px" }}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            {getFileIcon(msg.fileName)}
                            <span className="text-sm">{msg.fileName}</span>
                          </div>
                        )}
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline hover:no-underline mt-1"
                        >
                          Скачать файл
                        </a>
                      </div>
                    )}
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
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-admin"
              />
              <Label htmlFor="file-upload-admin" className="cursor-pointer">
                <Button type="button" variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Прикрепить файл</span>
                </Button>
              </Label>
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
