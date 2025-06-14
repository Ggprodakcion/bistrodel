import Link from "next/link"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { ArrowLeft } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Условия использования</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Добро пожаловать на БыстроДел! Эти Условия использования регулируют ваше использование нашего веб-сайта и
            услуг. Используя наш сайт, вы соглашаетесь с этими условиями.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Принятие условий</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Получая доступ или используя наш Сервис, вы соглашаетесь соблюдать настоящие Условия. Если вы не согласны с
            какой-либо частью условий, вы не можете получить доступ к Сервису.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Услуги</h2>
          <p className="text-gray-700 dark:text-gray-300">
            БыстроДел предоставляет услуги по созданию контента, видеомонтажу, разработке презентаций, сайтов и ботов.
            Детали каждой услуги, включая цены и сроки, указаны на соответствующих страницах.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Обязанности пользователя</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Вы соглашаетесь использовать наш Сервис только в законных целях и в соответствии с настоящими Условиями. Вы
            несете ответственность за сохранение конфиденциальности вашей учетной записи и пароля.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Изменения в условиях</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Мы оставляем за собой право изменять или заменять настоящие Условия в любое время. Ваше дальнейшее
            использование Сервиса после любых таких изменений означает ваше согласие с новыми Условиями.
          </p>
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
              prefetch={false}
            >
              <ArrowLeft className="h-4 w-4" />
              Вернуться на главную
            </Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
