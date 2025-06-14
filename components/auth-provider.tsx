"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase" // Импортируем клиент Supabase

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  register: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Проверяем статус аутентификации при загрузке и подписываемся на изменения
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
      if (session) {
        localStorage.setItem("clientIsAuthenticated", "true")
        localStorage.setItem("currentClientEmail", session.user.email || "")
      } else {
        localStorage.removeItem("clientIsAuthenticated")
        localStorage.removeItem("currentClientEmail")
      }
    })

    // Изначальная проверка сессии
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
      if (session) {
        localStorage.setItem("clientIsAuthenticated", "true")
        localStorage.setItem("currentClientEmail", session.user.email || "")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error("Login error:", error.message)
      return { success: false, error: error.message }
    }
    return { success: true, error: null }
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error("Registration error:", error.message)
      return { success: false, error: error.message }
    }
    if (data.user) {
      // При успешной регистрации, также создаем начальный профиль в localStorage
      // В реальном приложении это должно быть в таблице Supabase 'profiles'
      const initialProfile = {
        id: data.user.id,
        name: "",
        email: data.user.email || "",
        phone: "",
        address: "",
        lastUpdated: new Date().toLocaleString("ru-RU"),
      }
      localStorage.setItem("clientProfile", JSON.stringify(initialProfile))
    }
    return { success: true, error: null }
  }, [])

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Logout error:", error.message)
    }
    localStorage.removeItem("clientIsAuthenticated")
    localStorage.removeItem("currentClientEmail")
    router.push("/dashboard/login")
  }, [router])

  return <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
