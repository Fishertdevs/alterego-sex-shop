import type { Product } from "@/contexts/cart-context"

export interface FavoriteProduct {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  addedAt: string
}

const FAVORITES_STORAGE_KEY = "alterego-favorites"

export function saveFavorite(product: Product, userId: string): void {
  if (typeof window === "undefined") return

  const favorites = getFavorites(userId)

  // Check if already exists
  if (favorites.some((fav) => fav.id === product.id)) {
    return
  }

  const favorite: FavoriteProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    description: product.description,
    addedAt: new Date().toISOString(),
  }

  favorites.push(favorite)

  const allFavorites = getAllFavoritesData()
  allFavorites[userId] = favorites
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(allFavorites))
}

export function removeFavorite(productId: string, userId: string): void {
  if (typeof window === "undefined") return

  const favorites = getFavorites(userId)
  const filtered = favorites.filter((fav) => fav.id !== productId)

  const allFavorites = getAllFavoritesData()
  allFavorites[userId] = filtered
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(allFavorites))
}

export function getFavorites(userId: string): FavoriteProduct[] {
  if (typeof window === "undefined") return []

  const allFavorites = getAllFavoritesData()
  return allFavorites[userId] || []
}

export function isFavorite(productId: string, userId: string): boolean {
  const favorites = getFavorites(userId)
  return favorites.some((fav) => fav.id === productId)
}

export function toggleFavorite(product: Product, userId: string): boolean {
  if (isFavorite(product.id, userId)) {
    removeFavorite(product.id, userId)
    return false
  } else {
    saveFavorite(product, userId)
    return true
  }
}

function getAllFavoritesData(): Record<string, FavoriteProduct[]> {
  if (typeof window === "undefined") return {}

  const favoritesJson = localStorage.getItem(FAVORITES_STORAGE_KEY)
  return favoritesJson ? JSON.parse(favoritesJson) : {}
}
