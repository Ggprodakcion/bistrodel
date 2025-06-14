"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

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

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const storedOrders: Order[] = JSON.parse(localStorage.getItem("clientOrders") || "[]")
    const foundOrder = storedOrders.find((o) => o.id === orderId)
    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      router.push("/admin")
    }
  }, [orderId, router])

  const handleCompleteOrder = () => {
    if (!order) return

    if (window.confirm(`Вы уверены, что хотите завершить заказ №${order.id.split("-")[1]}?`)) {
      const updatedOrders: Order[] = JSON.parse(localStorage.getItem("clientOrders") || "[]")
      const orderIndex = updatedOrders.findIndex((o) => o.id === order.id)

      if (orderIndex !== -1) {
        const updatedOrder = {
          ...updatedOrders[orderIndex],
          status: "Завершено",
          canDownload: true,
          chatMessages: [
            ...updatedOrders[orderIndex].chatMessages,
            {
              id: updatedOrders[orderIndex].chatMessages.length + 1,
              sender: "manager",
              text: "Ваш заказ завершен! Вы можете скачать готовые материалы в личном кабинете.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        }
        updatedOrders[orderIndex] = updatedOrder
        localStorage.setItem("clientOrders", JSON.stringify(updatedOrders))
        setOrder(updatedOrder)
        alert(`Заказ №${order.id.split("-")[1]} успешно завершен!`)
      }
    }
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Заказ не найден</CardTitle>
            <CardDescription>Заказ с ID "{orderId.split("-")[1]}" не существует.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin" passHref>
              <Button>Вернуться к списку заказов</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="w-full py-6 px-4 md:px-6 bg-gray-900 text-white flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold hover:underline" prefetch={false}>
          <ArrowLeft className="h-5 w-5" />
          <span>К заказам</span>
        </Link>
        <h1 className="text-2xl font-bold">Детали Заказа №{order.id.split("-")[1]}</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Информация о Заказе и Клиенте</CardTitle>
            <CardDescription>Подробные данные по заказу и контактная информация клиента.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Детали Заказа</h3>
              <p>
                <span className="font-medium">Услуга:</span> {order.service}
              </p>
              <p>
                <span className="font-medium">Статус:</span> {order.status}
              </p>
              <p>
                <span className="font-medium">Дата оформления:</span> {order.date}
              </p>
              <p>
                <span className="font-medium">Описание заказа:</span> {order.details}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Данные Клиента</h3>
              <p>
                <span className="font-medium">Имя:</span> {order.clientName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.clientEmail}
              </p>
              <p>
                <span className="font-medium">Телефон:</span> {order.clientPhone || "Не указан"}
              </p>
            </div>
            <div className="md:col-span-2 flex justify-center gap-4 mt-4">
              <Link href={`/dashboard/${order.id}/chat`} passHref>
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" /> Перейти в чат
                </Button>
              </Link>
              {order.status !== "Завершено" && (
                <Button onClick={handleCompleteOrder} className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" /> Завершить заказ
                </Button>
              )}
              <Link href="/admin" passHref>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Вернуться к заказам
                </Button>
              </Link>
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
