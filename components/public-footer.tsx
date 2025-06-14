import Link from "next/link"

export function PublicFooter() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-950 text-gray-400">
      <p className="text-xs">&copy; 2025 БыстроДел. Все права защищены.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link href="/contact" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          Контакты
        </Link>
        <Link href="/#about" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          О нас
        </Link>
        <Link href="/privacy-policy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          Политика конфиденциальности
        </Link>
        <Link href="/terms-of-service" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          Условия использования
        </Link>
      </nav>
    </footer>
  )
}
