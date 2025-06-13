"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle } from "lucide-react"

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
]

export default function AdminOrderDetailPage() {
  const params = useParams()
  const orderId = params.orderId as string

  const order = mockAdminOrders.find((o) => o.id === orderId)

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
        <div className="w-10" /> {/* Placeholder for alignment */}
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
              {/* Здесь можно добавить больше полей, если они есть в вашей базе данных */}
            </div>
            <div className="md:col-span-2 flex justify-center gap-4 mt-4">
              <Link href={`/dashboard/${order.id}/chat`} passHref>
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" /> Перейти в чат
                </Button>
              </Link>
              <Link href="/admin" passHref>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Вернуться к заказам
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
