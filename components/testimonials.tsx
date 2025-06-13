import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Иван Петров",
      service: "Текстовые услуги",
      rating: 5,
      review:
        "БыстроДел превзошел все ожидания! Тексты для моего сайта были написаны профессионально и точно в срок. SEO-оптимизация на высшем уровне, уже вижу результаты.",
    },
    {
      id: 2,
      name: "Елена Смирнова",
      service: "Видеомонтаж",
      rating: 5,
      review:
        "Заказывала монтаж рекламного ролика. Команда БыстроДел учла все пожелания, видео получилось динамичным и очень качественным. Рекомендую!",
    },
    {
      id: 3,
      name: "Алексей Козлов",
      service: "Презентации",
      rating: 4,
      review:
        "Нужна была презентация для инвесторов. Сделали стильно и информативно, но пришлось немного доработать по мелочам. В целом, доволен результатом.",
    },
    {
      id: 4,
      name: "Ольга Морозова",
      service: "Сайты",
      rating: 5,
      review:
        "Мой новый лендинг выглядит потрясающе и отлично работает на всех устройствах. БыстроДел справились с задачей на отлично, очень отзывчивая поддержка.",
    },
    {
      id: 5,
      name: "Сергей Волков",
      service: "Боты",
      rating: 5,
      review:
        "Заказал Telegram-бота для автоматизации рассылок. Работает без сбоев, очень удобно. Значительно упростил мне жизнь. Спасибо БыстроДел!",
    },
  ]

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Что говорят наши клиенты</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Истории успеха и отзывы от тех, кто уже доверил нам свои проекты.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="flex flex-col p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                    <Star key={i + testimonial.rating} className="h-5 w-5 text-gray-300" />
                  ))}
                </div>
                <CardTitle className="text-lg font-semibold">{testimonial.name}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.service}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.review}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
