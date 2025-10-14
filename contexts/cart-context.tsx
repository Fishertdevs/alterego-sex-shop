"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  discount?: number
  image: string
  category: string
  description: string
  stock: number
  featured?: boolean
}

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "alterego-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1
        if (newQuantity > product.stock) {
          alert(`Solo hay ${product.stock} unidades disponibles de este producto`)
          return prev
        }
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item))
      }

      if (product.stock <= 0) {
        alert("Este producto no está disponible en este momento")
        return prev
      }

      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prev) => {
      const item = prev.find((i) => i.id === productId)
      if (item && quantity > item.stock) {
        alert(`Solo hay ${item.stock} unidades disponibles de este producto`)
        return prev
      }
      return prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    })
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
