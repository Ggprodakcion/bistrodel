import { Telegraf } from "telegraf"
import { NextResponse } from "next/server"

// ВАЖНО: Замените 'YOUR_BOT_TOKEN' на токен вашего Telegram-бота.
// Получить его можно у @BotFather в Telegram.
// Рекомендуется хранить токен в переменной окружения (например, process.env.TELEGRAM_BOT_TOKEN)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN"

const bot = new Telegraf(BOT_TOKEN)

// ВАЖНО: Для реального использования, вам нужно будет реализовать
// безопасную аутентификацию администраторов бота (например, по Telegram ID).
// Для этой демонстрации, любой, кто знает команды, сможет их использовать.
const ADMIN_TELEGRAM_IDS = process.env.ADMIN_TELEGRAM_IDS
  ? process.env.ADMIN_TELEGRAM_IDS.split(",").map((id) => Number.parseInt(id.trim(), 10))
  : []

// Функция для получения данных из localStorage (СИМУЛЯЦИЯ)
// В реальном приложении здесь будет запрос к вашей базе данных
function getSimulatedOrders() {
  // Поскольку API Route работает на сервере, он не имеет прямого доступа к localStorage браузера.
  // Здесь мы симулируем данные, которые могли бы быть получены из базы данных.
  // Для реального использования, вам нужно будет подключить базу данных (например, Supabase, Neon).
  return [
    { id: "ORDER-12345", service: "Текстовые услуги", status: "Новый", clientName: "Анна", date: "2025-06-10" },
    { id: "ORDER-67890", service: "Видеомонтаж", status: "В работе", clientName: "Петр", date: "2025-06-08" },
    { id: "ORDER-11223", service: "Сайты", status: "Завершено", clientName: "Мария", date: "2025-06-05" },
  ]
}

function getSimulatedSupportTickets() {
  return [
    { id: "TICKET-ABC", subject: "Проблема с оплатой", status: "Новое", name: "Иван", date: "2025-06-12" },
    { id: "TICKET-DEF", subject: "Вопрос по проекту", status: "В работе", name: "Ольга", date: "2025-06-11" },
  ]
}

// Обработчик команды /start
bot.start((ctx) => {
  ctx.reply("Добро пожаловать в админ-бот БыстроДел! Используйте /help для списка команд.")
})

// Обработчик команды /help
bot.help((ctx) => {
  ctx.reply(`Доступные команды:
/orders - Показать список последних заказов
/tickets - Показать список последних обращений в поддержку
/status <ID_заказа> <новый_статус> - Изменить статус заказа (пример: /status ORDER-12345 В работе)
/ticketstatus <ID_обращения> <новый_статус> - Изменить статус обращения (пример: /ticketstatus TICKET-ABC Завершено)
`)
})

// Обработчик команды /orders
bot.command("orders", (ctx) => {
  const orders = getSimulatedOrders() // Получаем симулированные данные
  if (orders.length === 0) {
    ctx.reply("Активных заказов нет.")
    return
  }
  const orderList = orders
    .map(
      (order) =>
        `ID: ${order.id.split("-")[1]}\nУслуга: ${order.service}\nКлиент: ${order.clientName}\nСтатус: ${order.status}\nДата: ${order.date}`,
    )
    .join("\n\n")
  ctx.reply(`Последние заказы:\n\n${orderList}`)
})

// Обработчик команды /tickets
bot.command("tickets", (ctx) => {
  const tickets = getSimulatedSupportTickets() // Получаем симулированные данные
  if (tickets.length === 0) {
    ctx.reply("Активных обращений нет.")
    return
  }
  const ticketList = tickets
    .map(
      (ticket) =>
        `ID: ${ticket.id.split("-")[1]}\nТема: ${ticket.subject}\nКлиент: ${ticket.name}\nСтатус: ${ticket.status}\nДата: ${ticket.date}`,
    )
    .join("\n\n")
  ctx.reply(`Последние обращения в поддержку:\n\n${ticketList}`)
})

// Обработчик команды /status
bot.command("status", (ctx) => {
  const args = ctx.message.text.split(" ").slice(1)
  if (args.length < 2) {
    ctx.reply("Использование: /status <ID_заказа> <новый_статус>")
    return
  }
  const orderIdPart = args[0] // Например, "12345"
  const newStatus = args.slice(1).join(" ") // Например, "В работе"

  // В реальном приложении здесь будет логика обновления статуса в базе данных
  // и проверка, что ID заказа существует и статус валиден.
  ctx.reply(
    `Симуляция: Статус заказа ${orderIdPart} изменен на "${newStatus}". (В реальном приложении это обновило бы базу данных)`,
  )
})

// Обработчик команды /ticketstatus
bot.command("ticketstatus", (ctx) => {
  const args = ctx.message.text.split(" ").slice(1)
  if (args.length < 2) {
    ctx.reply("Использование: /ticketstatus <ID_обращения> <новый_статус>")
    return
  }
  const ticketIdPart = args[0] // Например, "ABC"
  const newStatus = args.slice(1).join(" ") // Например, "Завершено"

  // В реальном приложении здесь будет логика обновления статуса в базе данных
  ctx.reply(
    `Симуляция: Статус обращения ${ticketIdPart} изменен на "${newStatus}". (В реальном приложении это обновило бы базу данных)`,
  )
})

// Обработчик для всех остальных сообщений
bot.on("text", (ctx) => {
  if (!ctx.message.text.startsWith("/")) {
    // Игнорируем, если это не команда
    ctx.reply("Извините, я не понимаю эту команду. Используйте /help для списка команд.")
  }
})

// Обработчик для входящих запросов на вебхук
export async function POST(request: Request) {
  try {
    const body = await request.json()
    await bot.handleUpdate(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error handling Telegram webhook:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

// Для установки вебхука (выполняется один раз после деплоя)
// Вы можете вызвать этот маршрут вручную, например, через Postman или curl,
// или создать отдельный скрипт.
// URL вебхука будет: https://<ваш-домен>/api/telegram-webhook
export async function GET() {
  try {
    const webhookUrl = `${process.env.VERCEL_URL}/api/telegram-webhook` // Или ваш домен
    await bot.telegram.setWebhook(webhookUrl)
    console.log("Webhook set to:", webhookUrl)
    return NextResponse.json({ success: true, message: `Webhook set to ${webhookUrl}` })
  } catch (error) {
    console.error("Error setting webhook:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
