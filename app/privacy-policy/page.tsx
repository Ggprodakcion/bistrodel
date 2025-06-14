import Link from "next/link"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Политика конфиденциальности</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Настоящая Политика конфиденциальности описывает, как БыстроДел собирает, использует и защищает информацию,
            которую вы предоставляете при использовании нашего веб-сайта.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Сбор информации</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Мы собираем информацию, которую вы добровольно предоставляете нам при регистрации, оформлении заказа или
            обращении в службу поддержки. Это может включать ваше имя, адрес электронной почты, номер телефона и детали
            проекта.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Использование информации</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Собранная информация используется для обработки ваших заказов, предоставления услуг, улучшения нашего
            сервиса и связи с вами. Мы не передаем вашу личную информацию третьим лицам без вашего согласия, за
            исключением случаев, предусмотренных законом.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Защита данных</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Мы принимаем все разумные меры для защиты вашей личной информации от несанкционированного доступа,
            изменения, раскрытия или уничтожения.
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
