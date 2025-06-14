"use client"

import { Label } from "@/components/ui/label"

import { CardDescription } from "@/components/ui/card"

import type React from "react"
import type { HTMLDivElement } from "react"

import { useState, useEffect, useRef, useCallback } from "react" // Добавляем useCallback
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
  Loader2,
  Smile,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"

interface Message {
  id: number
  sender: "client" | "manager"
  text?: string
  fileUrl?: string
  fileName?: string
  timestamp: string
}

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
  clientIsTyping?: boolean // Новое поле
  managerIsTyping?: boolean // Новое поле
}

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
      return <FileImage className="h-4 w-4" />
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

const isImageFile = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension || "")
}

export default function OrderChatPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string
  const { isAuthenticated, logout } = useAuth()

  const [order, setOrder] = useState<Order | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null) // Для debounce

  const updateOrderInLocalStorage = useCallback(
    (
      currentOrderId: string,
      updatedMessages: Message[],
      adminUnread: boolean,
      clientUnread: boolean,
      clientTyping: boolean,
      managerTyping: boolean,
    ) => {
      const storedOrders: Order[] = JSON.parse(localStorage.getItem("clientOrders") || "[]")
      const updatedOrders = storedOrders.map((o) =>
        o.id === currentOrderId
          ? {
              ...o,
              chatMessages: updatedMessages,
              adminHasUnreadMessages: adminUnread,
              clientHasUnreadMessages: clientUnread,
              clientIsTyping: clientTyping,
              managerIsTyping: managerTyping,
            }
          : o,
      )
      localStorage.setItem("clientOrders", JSON.stringify(updatedOrders))
    },
    [],
  )

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dashboard/login")
      return
    }

    const loadOrderData = () => {
      const storedOrders: Order[] = JSON.parse(localStorage.getItem("clientOrders") || "[]")
      const foundOrder = storedOrders.find((o) => o.id === orderId)
      const currentClientEmail = localStorage.getItem("currentClientEmail")

      if (foundOrder && foundOrder.clientEmail === currentClientEmail) {
        // При загрузке страницы, сбрасываем флаг clientIsTyping для текущего клиента
        const updatedOrder = { ...foundOrder, clientHasUnreadMessages: false, clientIsTyping: false }
        setOrder(updatedOrder)
        setMessages(updatedOrder.chatMessages)
        updateOrderInLocalStorage(
          updatedOrder.id,
          updatedOrder.chatMessages,
          updatedOrder.adminHasUnreadMessages || false,
          false, // clientHasUnreadMessages
          false, // clientIsTyping
          updatedOrder.managerIsTyping || false,
        )
      } else {
        router.push("/dashboard")
      }
    }

    loadOrderData()
    const interval = setInterval(loadOrderData, 1000) // Уменьшаем интервал для более отзывчивого индикатора
    return () => {
      clearInterval(interval)
      // При размонтировании компонента, убедимся, что флаг clientIsTyping сброшен
      if (order) {
        updateOrderInLocalStorage(
          order.id,
          order.chatMessages,
          order.adminHasUnreadMessages || false,
          order.clientHasUnreadMessages || false,
          false, // clientIsTyping
          order.managerIsTyping || false,
        )
      }
    }
  }, [isAuthenticated, router, orderId, updateOrderInLocalStorage, order])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && order && !isUploadingFile) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "client",
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      const updatedMessages = [...messages, newMsg]
      setMessages(updatedMessages)
      setNewMessage("")
      setShowEmojiPicker(false)

      // Сбрасываем флаг clientIsTyping после отправки сообщения
      updateOrderInLocalStorage(order.id, updatedMessages, true, false, false, order.managerIsTyping || false)

      // Simulate manager's response
      setTimeout(() => {
        const managerResponse: Message = {
          id: updatedMessages.length + 1,
          sender: "manager",
          text: "Спасибо за ваше сообщение. Мы рассмотрим его и ответим в ближайшее время.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        const finalMessages = [...updatedMessages, managerResponse]
        setMessages(finalMessages)
        // Сбрасываем managerIsTyping после ответа менеджера
        updateOrderInLocalStorage(order.id, finalMessages, false, true, false, false)
      }, 1500)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && order) {
      setIsUploadingFile(true)
      setShowEmojiPicker(false)
      // Сбрасываем флаг clientIsTyping при загрузке файла
      updateOrderInLocalStorage(order.id, messages, true, false, false, order.managerIsTyping || false)

      const reader = new FileReader()
      reader.onloadend = () => {
        const fileDataUrl = reader.result as string
        const newFileMsg: Message = {
          id: messages.length + 1,
          sender: "client",
          fileUrl: fileDataUrl,
          fileName: file.name,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        const updatedMessages = [...messages, newFileMsg]
        setMessages(updatedMessages)

        updateOrderInLocalStorage(order.id, updatedMessages, true, false, false, order.managerIsTyping || false)

        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        setTimeout(() => {
          const managerResponse: Message = {
            id: updatedMessages.length + 1,
            sender: "manager",
            text: `Получили ваш файл: ${file.name}. Спасибо!`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
          const finalMessages = [...updatedMessages, managerResponse]
          setMessages(finalMessages)
          updateOrderInLocalStorage(order.id, finalMessages, false, true, false, false)
          setIsUploadingFile(false)
        }, 1500)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    if (order) {
      // Устанавливаем clientIsTyping в true
      updateOrderInLocalStorage(
        order.id,
        messages,
        order.adminHasUnreadMessages || false,
        order.clientHasUnreadMessages || false,
        true, // clientIsTyping
        order.managerIsTyping || false,
      )

      // Сбрасываем предыдущий таймаут
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Устанавливаем новый таймаут для сброса clientIsTyping в false
      typingTimeoutRef.current = setTimeout(() => {
        if (order) {
          updateOrderInLocalStorage(
            order.id,
            messages,
            order.adminHasUnreadMessages || false,
            order.clientHasUnreadMessages || false,
            false, // clientIsTyping
            order.managerIsTyping || false,
          )
        }
      }, 1500) // 1.5 секунды бездействия
    }
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prevMsg) => prevMsg + emojiData.emoji)
    // Также обрабатываем состояние набора текста при добавлении эмодзи
    if (order) {
      updateOrderInLocalStorage(
        order.id,
        messages,
        order.adminHasUnreadMessages || false,
        order.clientHasUnreadMessages || false,
        true, // clientIsTyping
        order.managerIsTyping || false,
      )
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        if (order) {
          updateOrderInLocalStorage(
            order.id,
            messages,
            order.adminHasUnreadMessages || false,
            order.clientHasUnreadMessages || false,
            false, // clientIsTyping
            order.managerIsTyping || false,
          )
        }
      }, 1500)
    }
  }

  if (!isAuthenticated || !order) {
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
        <h1 className="text-2xl font-bold">Обсуждение Заказа №{order.id.split("-")[1]}</h1>
        <Button variant="outline" size="sm" onClick={logout} className="text-white border-white hover:bg-gray-700">
          Выйти
        </Button>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4 md:px-6 flex flex-col">
        <Card className="flex-1 flex flex-col shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">Чат по заказу: {order.service}</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Статус: {order.status}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800 rounded-b-md">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-xl shadow-md ${
                      msg.sender === "client"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                    }`}
                  >
                    {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                    {msg.fileUrl && msg.fileName && (
                      <div className="flex flex-col items-start gap-2 mt-2">
                        {isImageFile(msg.fileName) ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <img
                                src={msg.fileUrl || "/placeholder.svg"}
                                alt={msg.fileName}
                                className="max-w-full h-auto rounded-lg object-contain cursor-pointer hover:opacity-80 transition-opacity border border-gray-300 dark:border-gray-600"
                                style={{ maxWidth: "150px", maxHeight: "150px" }}
                              />
                            </DialogTrigger>
                            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-transparent border-none shadow-none">
                              <img
                                src={msg.fileUrl || "/placeholder.svg"}
                                alt={msg.fileName}
                                className="w-full h-full object-contain"
                              />
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500">
                            {getFileIcon(msg.fileName)}
                            <span className="text-sm font-medium">{msg.fileName}</span>
                          </div>
                        )}
                        <a
                          href={msg.fileUrl}
                          download={msg.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline hover:no-underline mt-1 text-blue-600 dark:text-blue-400"
                        >
                          Скачать файл
                        </a>
                      </div>
                    )}
                    <span className="text-xs opacity-75 mt-1 block text-right text-gray-600 dark:text-gray-300">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {order.managerIsTyping && (
              <div className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2">Менеджер печатает...</div>
            )}
            <div className="relative p-4 border-t bg-white dark:bg-gray-900 rounded-b-lg">
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 z-10">
                  <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Напишите сообщение..."
                  value={newMessage}
                  onChange={handleNewMessageChange} // Используем новую функцию
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-primary focus:border-primary"
                  disabled={isUploadingFile}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="rounded-lg"
                  disabled={isUploadingFile}
                >
                  <Smile className="h-4 w-4" />
                  <span className="sr-only">Выбрать эмодзи</span>
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload-client"
                  disabled={isUploadingFile}
                />
                <Label htmlFor="file-upload-client" className="cursor-pointer">
                  <Button type="button" variant="outline" size="icon" disabled={isUploadingFile} className="rounded-lg">
                    {isUploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                    <span className="sr-only">Прикрепить файл</span>
                  </Button>
                </Label>
                <Button type="submit" disabled={!newMessage.trim() || isUploadingFile} className="rounded-lg">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Отправить</span>
                </Button>
              </form>
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
