export interface SupportTicket {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "Новое" | "В работе" | "Завершено" | "Отклонено"
  date: string
  isUnread: boolean // Это поле будет использоваться для админа (adminHasUnreadMessages)
  clientHasUnreadMessages: boolean // Новое поле для клиента
  chatMessages: {
    id: number
    sender: "client" | "manager"
    text?: string
    fileUrl?: string
    fileName?: string
    timestamp: string
  }[]
}
