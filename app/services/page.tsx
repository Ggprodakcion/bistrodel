import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Film, Presentation, Code, Bot } from "lucide-react" // Удаляем ArrowLeft
import { PublicHeader } from "@/components/public-header" // Импортируем новый хедер
import { PublicFooter } from "@/components/public-footer" // Импортируем новый футер

export default function ServicesPage() {
  const servicesData = [
    {
      icon: FileText,
      title: "Текстовые услуги",
      description:
        "Создаем уникальный и оптимизированный контент, который привлекает внимание и повышает позиции в поисковых системах.",
      includes: [
        "Копирайтинг (продающие тексты, статьи, рекламные слоганы)",
        "Рерайтинг (переработка существующих текстов)",
        "SEO-оптимизация текстов",
        "Наполнение сайтов контентом",
      ],
      examples: "(Здесь будут ссылки на портфолио или примеры текстов)",
      price: "от 750 руб. за 1000 знаков", // Уменьшенная примерная цена
      linkService: "Текстовые услуги",
    },
    {
      icon: Film,
      title: "Видеомонтаж",
      description: "Профессиональный видеомонтаж для любых целей — от рекламных ролик до контента для YouTube.",
      includes: [
        "Монтаж видео для YouTube-каналов",
        "Создание рекламных ролик и промо-видео",
        "Цветокоррекция и звукорежиссура",
        "Добавление эффектов и графики",
      ],
      examples: "(Здесь будут ссылки на портфолио или примеры видео)",
      price: "от 7500 руб. за ролик", // Уменьшенная примерная цена
      linkService: "Видеомонтаж",
    },
    {
      icon: Presentation,
      title: "Презентации",
      description: "Разрабатываем стильные, информативные и убедительные презентации, которые произведут впечатление.",
      includes: [
        "Разработка дизайна слайдов",
        "Создание инфографики и диаграмм",
        "Анимация и переходы",
        "Подготовка к печати или онлайн-показу",
      ],
      examples: "(Здесь будут ссылки на портфолио или примеры презентаций)",
      price: "от 5000 руб. за презентацию", // Уменьшенная примерная цена
      linkService: "Презентации",
    },
    {
      icon: Code,
      title: "Сайты",
      description:
        "Создаем адаптивные и функциональные веб-сайты, которые эффективно представляют ваш бизнес в интернете.",
      includes: [
        "Разработка лендингов и сайтов-визиток",
        "Адаптивный дизайн для всех устройств",
        "Базовая SEO-оптимизация",
        "Интеграция форм обратной связи",
      ],
      examples: "(Здесь будут ссылки на портфолио или примеры сайтов)",
      price: "от 25000 руб. за лендинг", // Уменьшенная примерная цена
      linkService: "Сайты",
    },
    {
      icon: Bot,
      title: "Боты",
      description:
        "Разрабатываем интеллектуальных ботов для автоматизации рутинных задач и улучшения взаимодействия с клиентами.",
      includes: [
        "Разработка Telegram-ботов",
        "Боты для автоматизации бизнес-процессов",
        "Интеграция с внешними API",
        "Разработка чат-ботов для веб-сайтов",
      ],
      examples: "(Здесь будут ссылки на портфолио или примеры ботов)",
      price: "от 15000 руб. за бота", // Уменьшенная примерная цена
      linkService: "Боты",
    },
  ]
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader /> {/* Используем новый хедер */}
      {/* Services Detail Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 flex-1">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Подробно о наших услугах</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Мы предлагаем комплексные цифровые решения, разработанные для достижения ваших бизнес-целей.
                Ознакомьтесь с нашими основными категориями услуг:
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {servicesData.map((service, index) => (
              <Card key={index} className="flex flex-col p-6">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <service.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{service.description}</p>
                  <h3 className="font-semibold text-lg mb-2">Что входит в стоимость:</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mb-4">
                    {service.includes.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <h3 className="font-semibold text-lg mb-2">Примеры работ:</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{service.examples}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">Цена: {service.price}</p>
                  <Link href={`/order?service=${service.linkService}`} passHref>
                    <Button className="w-full">Заказать</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/order"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Обсудить ваш проект
            </Link>
          </div>
        </div>
      </section>
      <PublicFooter /> {/* Используем новый футер */}
    </div>
  )
}
