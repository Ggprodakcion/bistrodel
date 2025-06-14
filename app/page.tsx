import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  Lightbulb,
  Users,
  Code,
  Film,
  FileText,
  Bot,
  Presentation,
  ClipboardList,
  MessageSquare,
  Award,
  CreditCard,
} from "lucide-react"
import { Testimonials } from "@/components/testimonials"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      {/* Hero Section / Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container px-4 md:px-6 text-center">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              БыстроДел: Ваши Цифровые Решения, Воплощенные в Жизнь
            </h1>
            <p className="mx-auto max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Мы создаем и оптимизируем контент, видео, презентации, сайты и ботов. Более 50 успешных проектов за 2
              года. Доверьтесь профессионалам для достижения ваших целей.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link
                href="/order"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Заказать услугу
              </Link>
              <Link
                href="/services"
                className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Узнать больше
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* About Us Section */}
      <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">О компании БыстроДел</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Мы — команда профессионалов с опытом работы в сфере интернет-услуг более 2 лет. За это время успешно
                реализовали более 50 проектов в таких направлениях, как текстовое сопровождение, видеомонтаж, создание
                презентаций, разработка сайтов и ботов. Наша миссия — предоставлять высококачественные цифровые услуги,
                помогая нашим клиентам достигать их целей.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Как это работает?</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Простой и понятный процесс от идеи до реализации.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 py-12">
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <ClipboardList className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">1. Оставьте заявку</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Заполните простую форму на сайте, выбрав нужную услугу и описав ваш проект.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">2. Обсуждение деталей</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Наш менеджер свяжется с вами для уточнения всех нюансов и формирования предложения.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <CreditCard className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">3. Оплата</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  После согласования деталей и стоимости, вы производите оплату удобным способом.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <Code className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">4. Выполнение проекта</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Наша команда приступает к работе, регулярно информируя вас о прогрессе.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">5. Получение результата</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Вы получаете готовую работу, соответствующую вашим ожиданиям и нашим стандартам качества.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Advantages Section */}
      <section id="advantages" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Наши Преимущества</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Почему клиенты выбирают "БыстроДел":
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-12 py-12">
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">Опыт в каждой специализации</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Глубокие знания и навыки в каждой из предлагаемых услуг.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">Более 50 выполненных заказов</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Доказанный успех и положительные отзывы от довольных клиентов.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">Индивидуальный подход</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Решения, адаптированные под уникальные потребности каждого проекта.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <Code className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">Современные инструменты</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Использование передовых технологий для лучших результатов.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">Гарантия качества и сроков</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Надежность и ответственность в каждом проекте.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Наши Услуги</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Мы предлагаем широкий спектр цифровых услуг для вашего бизнеса:
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 py-12">
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">Текстовые услуги</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Копирайтинг, рерайтинг, SEO-тексты, оптимизация контента.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <Film className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">Видеомонтаж</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Профессиональный видеомонтаж для любых целей — от рекламных ролик до контента для YouTube.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <Presentation className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">Презентации</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Разрабатываем стильные, информативные и убедительные презентации, которые произведут впечатление.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <Code className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">Сайты</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Создаем адаптивные и функциональные веб-сайты, которые эффективно представляют ваш бизнес в интернете.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <Bot className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg font-semibold">Боты</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Разрабатываем интеллектуальных ботов для автоматизации рутинных задач и улучшения взаимодействия с
                  клиентами.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <Testimonials />
      {/* Contact/CTA Section */}
      <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 text-white">
        <div className="container px-4 md:px-6 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Готовы начать?</h2>
            <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Свяжитесь с нами сегодня, чтобы обсудить ваш проект и получить индивидуальное решение.
            </p>
            <Link
              href="/order"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}
