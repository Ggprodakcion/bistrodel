"use client" // Добавляем use client

import { useEffect } from "react" // Импортируем useEffect
import Link from "next/link"
import { useRouter } from "next/navigation" // Импортируем useRouter
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle, History, Download, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider" // Импортируем useAuth

// This is a placeholder for client's orders. In a real app, this would come from a database.
const mockOrders = [
  {
    id: "ORDER-1701234567890",
    service: "Текстовые услуги",
    status: "В работе",
    date: "2025-06-10",
    details: "Написание 5 SEO-статей для блога о технологиях.",
    canDiscuss: true,
    canDownload: false,
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
    details: "Разработка корпоративной презентации.",
    canDiscuss: false,
    canDownload: true,
  },
]

export default function ClientDashboardPage() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dashboard/login") // Перенаправляем на страницу входа, если не аутентифицирован
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Или лоадер, пока идет перенаправление
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="w-full py-6 px-4 md:px-6 bg-gray-900 text-white flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold hover:underline" prefetch={false}>
          <ArrowLeft className="h-5 w-5" />
          <span>На главную</span>
        </Link>
        <h1 className="text-2xl font-bold">Личный Кабинет Клиента</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={logout} // Добавляем кнопку выхода
          className="text-white border-white hover:bg-gray-700"
        >
          Выйти
        </Button>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Ваши Заказы</h2>

          {mockOrders.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">У вас пока нет активных заказов.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockOrders.map((order) => (
                <Card key={order.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl">Заказ №{order.id.split("-")[1]}</CardTitle>
                    <CardDescription>Услуга: {order.service}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Статус:</span> {order.status}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Дата:</span> {order.date}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Детали:</span> {order.details}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      {order.canDiscuss && (
                        <Link href={`/dashboard/${order.id}/chat`} passHref>
                          <Button size="sm" className="flex-1">
                            <MessageCircle className="h-4 w-4 mr-2" /> Обсудить
                          </Button>
                        </Link>
                      )}
                      {order.canDownload && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" /> Скачать
                        </Button>
                      )}
                      {!order.canDiscuss && !order.canDownload && (
                        <Button size="sm" variant="outline" className="flex-1" disabled>
                          Действий нет
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Дополнительные возможности</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#" passHref>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" /> История заказов
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" /> Поддержка (Чат)
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button variant="outline">FAQ</Button>
            </Link>
            <Link href="/dashboard/profile" passHref>
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" /> Мой Профиль
              </Button>
            </Link>
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
