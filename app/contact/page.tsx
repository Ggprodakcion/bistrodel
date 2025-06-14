"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, Phone } from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { useAuth } from "@/components/auth-provider"

export default function ContactPage() {
  const { isAuthenticated } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      const currentClientEmail = localStorage.getItem("currentClientEmail")
      if (currentClientEmail) {
        setEmail(currentClientEmail)
      }
      const storedProfile = localStorage.getItem("clientProfile")
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile)
        setName(parsedProfile.name || "")
      }
    }
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newTicket = {
      id: `TICKET-${Date.now()}`,
      name,
      email,
      subject,
      message,
      status: "Новое",
      date: new Date().toLocaleDateString("ru-RU"),
      isUnread: true,
      chatMessages: [
        {
          id: 1,
          sender: "manager",
          text: `Здравствуйте, ${name}! Ваше обращение по теме "${subject}" получено. Мы скоро свяжемся с вами.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    }

    const existingTickets = JSON.parse(localStorage.getItem("supportTickets") || "[]")
    localStorage.setItem("supportTickets", JSON.stringify([...existingTickets, newTicket]))

    setIsSubmitting(false)
    setFormSubmitted(true)
    console.log("Обращение отправлено:", newTicket)
  }

  const faqItems = [
    {
      question: "Как быстро вы выполняете заказы?",
      answer:
        "Сроки выполнения зависят от сложности и объема проекта. Мы всегда обсуждаем их индивидуально с клиентом и строго придерживаемся оговоренных дедлайнов.",
    },
    {
      question: "Какие способы оплаты вы принимаете?",
      answer:
        "Мы принимаем различные способы оплаты, включая банковские карты и электронные платежные системы. Детали будут уточнены при оформлении заказа.",
    },
    {
      question: "Могу ли я внести правки после получения работы?",
      answer:
        "Да, мы предоставляем возможность внесения правок в рамках оговоренного объема. Наша цель — ваше полное удовлетворение результатом.",
    },
    {
      question: "Как происходит общение по проекту?",
      answer:
        "Основное общение происходит через внутренний чат в личном кабинете. Также доступны консультации по email и телефону.",
    },
    {
      question: "Вы работаете с индивидуальными проектами?",
      answer:
        "Безусловно! Мы специализируемся на индивидуальном подходе и готовы взяться за проекты любой сложности, адаптируя наши услуги под ваши уникальные потребности.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <PublicHeader />
      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Часто задаваемые вопросы</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Связаться с нами</h2>
            <Card className="w-full rounded-xl shadow-xl">
              <CardHeader>
                <CardTitle>Отправьте нам сообщение</CardTitle>
                <CardDescription>Мы ответим вам в ближайшее время.</CardDescription>
              </CardHeader>
              <CardContent>
                {formSubmitted ? (
                  <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                      Сообщение успешно отправлено!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Мы свяжемся с вами по указанному email в ближайшее время.
                    </p>
                    <Button onClick={() => setFormSubmitted(false)} className="mt-4">
                      Отправить еще одно сообщение
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Ваше имя</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Иван Иванов"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isAuthenticated}
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Тема</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Вопрос по услуге / Сотрудничество"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Сообщение</Label>
                      <Textarea
                        id="message"
                        placeholder="Опишите ваш вопрос или предложение."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Отправка..." : "Отправить сообщение"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Наши контакты</h3>
              <p className="text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                <Mail className="h-5 w-5" />
                Email:{" "}
                <a href="mailto:info@bystrodel.com" className="hover:underline">
                  info@bystrodel.com
                </a>
              </p>
              <p className="text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                <Phone className="h-5 w-5" />
                Телефон:{" "}
                <a href="tel:+71234567890" className="hover:underline">
                  +7 (123) 456-78-90
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
