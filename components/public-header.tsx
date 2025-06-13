"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider" // Импортируем useAuth

export function PublicHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { isAuthenticated } = useAuth() // Получаем статус аутентификации

  return (
    <header className="sticky top-0 z-40 w-full bg-gray-900 text-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Site Name */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold" prefetch={false}>
          <span>БыстроДел</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Главная
          </Link>
          <Link href="/services" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Услуги
          </Link>
          <Link href="/order" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Заказать
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Контакты
          </Link>
          {isAuthenticated ? (
            <Link href="/dashboard" passHref>
              <Button variant="default" size="sm">
                Кабинет Клиента
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/login" passHref>
              <Button variant="default" size="sm">
                Войти
              </Button>
            </Link>
          )}
          <Link href="/admin" passHref>
            <Button variant="default" size="sm">
              Админ Панель
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-900 text-white">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold mb-6"
              prefetch={false}
              onClick={() => setIsSheetOpen(false)}
            >
              <span>БыстроДел</span>
            </Link>
            <nav className="grid gap-4 py-6">
              <Link
                href="/"
                className="text-lg font-medium hover:underline underline-offset-4"
                prefetch={false}
                onClick={() => setIsSheetOpen(false)}
              >
                Главная
              </Link>
              <Link
                href="/services"
                className="text-lg font-medium hover:underline underline-offset-4"
                prefetch={false}
                onClick={() => setIsSheetOpen(false)}
              >
                Услуги
              </Link>
              <Link
                href="/order"
                className="text-lg font-medium hover:underline underline-offset-4"
                prefetch={false}
                onClick={() => setIsSheetOpen(false)}
              >
                Заказать
              </Link>
              <Link
                href="/contact"
                className="text-lg font-medium hover:underline underline-offset-4"
                prefetch={false}
                onClick={() => setIsSheetOpen(false)}
              >
                Контакты
              </Link>
              {isAuthenticated ? (
                <Link href="/dashboard" passHref>
                  <Button variant="default" className="w-full" onClick={() => setIsSheetOpen(false)}>
                    Кабинет Клиента
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/dashboard/login" passHref>
                    <Button variant="default" className="w-full" onClick={() => setIsSheetOpen(false)}>
                      Войти
                    </Button>
                  </Link>
                  <Link href="/dashboard/register" passHref>
                    <Button variant="default" className="w-full" onClick={() => setIsSheetOpen(false)}>
                      Регистрация
                    </Button>
                  </Link>
                </>
              )}
              <Link href="/admin" passHref>
                <Button variant="default" className="w-full" onClick={() => setIsSheetOpen(false)}>
                  Админ Панель
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
