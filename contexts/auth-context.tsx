"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "alterego-user"
const USERS_STORAGE_KEY = "alterego-users"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AuthContext - Initializing...")

    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY)
        console.log("[v0] AuthContext - Stored user:", storedUser)

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          console.log("[v0] AuthContext - Parsed user:", parsedUser)
          setUser(parsedUser)
        } else {
          console.log("[v0] AuthContext - No stored user found")
        }
      } catch (error) {
        console.error("[v0] AuthContext - Error loading user:", error)
      }
    }

    loadUser()
    setIsLoading(false)
    console.log("[v0] AuthContext - Initialization complete")

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        console.log("[v0] AuthContext - Storage changed, reloading user")
        loadUser()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    console.log("[v0] AuthContext - Login attempt for:", email)

    // Mock authentication - in production, this would be a real API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const loggedInUser = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        isAdmin: foundUser.isAdmin || false,
      }
      console.log("[v0] AuthContext - Login successful:", loggedInUser)
      setUser(loggedInUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
      setIsLoading(false)
      return true
    }

    console.log("[v0] AuthContext - Login failed")
    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock registration
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]")
    const userExists = users.some((u: any) => u.email === email)

    if (userExists) {
      setIsLoading(false)
      return false
    }

    const isAdmin = email === "altergo102@gmail.com"

    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password, // In production, this should be hashed
      isAdmin,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

    const loggedInUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      isAdmin: newUser.isAdmin,
    }

    setUser(loggedInUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
    setIsLoading(false)
    return true
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const updatedUser = {
      ...user,
      ...updates,
      // Prevent changing admin status or id
      id: user.id,
      isAdmin: user.isAdmin,
    }

    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))

    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]")
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    }

    setIsLoading(false)
    return true
  }

  const logout = () => {
    console.log("[v0] AuthContext - Logging out")
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { User }
