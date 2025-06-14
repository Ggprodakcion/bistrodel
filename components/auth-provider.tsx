"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  register: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedAuth = localStorage.getItem("clientIsAuthenticated")
    if (storedAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const login = useCallback((email: string, password: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem("clientUsers") || "[]")
    const user = storedUsers.find((u: any) => u.email === email && u.password === password)

    if (user) {
      localStorage.setItem("clientIsAuthenticated", "true")
      localStorage.setItem("currentClientEmail", email)
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const register = useCallback((email: string, password: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem("clientUsers") || "[]")
    const userExists = storedUsers.some((u: any) => u.email === email)

    if (userExists) {
      return false
    }

    const newUser = { email, password }
    localStorage.setItem("clientUsers", JSON.stringify([...storedUsers, newUser]))
    return true
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("clientIsAuthenticated")
    localStorage.removeItem("currentClientEmail")
    setIsAuthenticated(false)
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
