"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { PublicHeader } from "@/components/public-header" // Импортируем новый хедер
import { PublicFooter } from "@/components/public-footer" // Импортируем новый футер

export default function OrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialService = searchParams.get("service") || ""

  const [serviceType, setServiceType] = useState(initialService)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [details, setDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")

  const availableServices = ["Текстовые услуги", "Видеомонтаж", "Презентации", "Сайты", "Боты", "Общая услуга"]

  useEffect(() => {
    if (initialService && availableServices.includes(initialService)) {
      setServiceType(initialService)
    } else {
      setServiceType("Общая услуга")
    }
  }, [initialService])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
    const generatedOrderId = `ORDER-${today}-${randomString}`
    setOrderId(generatedOrderId)
    setOrderPlaced(true)
    setIsSubmitting(false)
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md rounded-xl shadow-xl text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Заказ успешно оформлен!</CardTitle>
            <CardDescription>
              Ваш заказ №
              <span className="font-bold">
                {orderId.split("-")[1]}-{orderId.split("-")[2]}
              </span>{" "}
              по услуге "{serviceType}" принят.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Теперь вы можете перейти в личный кабинет для обсуждения деталей заказа с нашим менеджером.
            </p>
            <Link href={`/dashboard/${orderId}/chat`} passHref>
              <Button className="w-full">Перейти к обсуждению заказа</Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button variant="outline" className="w-full">
                Перейти в личный кабинет
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader /> {/* Используем новый хедер */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md rounded-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Оформление заказа</CardTitle>
            <CardDescription>Заполните форму, чтобы заказать услугу.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="serviceType">Выбранная услуга</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger id="serviceType" className="w-full">
                    <SelectValue placeholder="Выберите услугу" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                />
              </div>
              <div>
                <Label htmlFor="details">Детали заказа</Label>
                <Textarea
                  id="details"
                  placeholder="Опишите ваш проект, требования, сроки и любые другие важные детали."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Оформление..." : "Оформить заказ и перейти к оплате"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Link
          href="/services"
          className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:underline"
          prefetch={false}
        >
          <ArrowLeft className="inline-block h-4 w-4 mr-1" />
          Вернуться к услугам
        </Link>
      </main>
      <PublicFooter /> {/* Используем новый футер */}
    </div>
  )
}
