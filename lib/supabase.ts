import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is not set in environment variables.")
  // В реальном приложении здесь можно выбросить ошибку или перенаправить пользователя
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "")
