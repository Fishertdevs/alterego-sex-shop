import { getOrdersByUserId, type Order } from "./orders"

export interface PaymentTransaction {
  id: string
  orderId: string
  transactionId: string
  amount: number
  paymentMethod: string
  status: "completed" | "pending" | "failed" | "refunded"
  date: string
}

export interface SavedPaymentMethod {
  id: string
  userId: string
  type: "card" | "pse"
  last4?: string
  brand?: string
  bankName?: string
  isDefault: boolean
  addedAt: string
}

const PAYMENT_METHODS_STORAGE_KEY = "alterego-payment-methods"

export function getPaymentHistory(userId: string): PaymentTransaction[] {
  const orders = getOrdersByUserId(userId)

  return orders
    .filter((order) => order.transactionId)
    .map((order) => ({
      id: `PAY-${order.id}`,
      orderId: order.id,
      transactionId: order.transactionId!,
      amount: order.total,
      paymentMethod: order.paymentMethod,
      status: mapOrderStatusToPaymentStatus(order.status),
      date: order.createdAt,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function mapOrderStatusToPaymentStatus(orderStatus: Order["status"]): PaymentTransaction["status"] {
  switch (orderStatus) {
    case "pending":
      return "pending"
    case "processing":
    case "shipped":
    case "delivered":
      return "completed"
    case "cancelled":
      return "refunded"
    default:
      return "completed"
  }
}

export function getSavedPaymentMethods(userId: string): SavedPaymentMethod[] {
  if (typeof window === "undefined") return []

  const allMethods = getAllPaymentMethodsData()
  return allMethods[userId] || []
}

export function savePaymentMethod(method: Omit<SavedPaymentMethod, "id" | "addedAt">): void {
  if (typeof window === "undefined") return

  const allMethods = getAllPaymentMethodsData()
  const userMethods = allMethods[method.userId] || []

  // If this is set as default, unset other defaults
  if (method.isDefault) {
    userMethods.forEach((m) => (m.isDefault = false))
  }

  const newMethod: SavedPaymentMethod = {
    ...method,
    id: `PM-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    addedAt: new Date().toISOString(),
  }

  userMethods.push(newMethod)
  allMethods[method.userId] = userMethods
  localStorage.setItem(PAYMENT_METHODS_STORAGE_KEY, JSON.stringify(allMethods))
}

export function removePaymentMethod(methodId: string, userId: string): void {
  if (typeof window === "undefined") return

  const allMethods = getAllPaymentMethodsData()
  const userMethods = allMethods[userId] || []
  const filtered = userMethods.filter((m) => m.id !== methodId)

  allMethods[userId] = filtered
  localStorage.setItem(PAYMENT_METHODS_STORAGE_KEY, JSON.stringify(allMethods))
}

export function setDefaultPaymentMethod(methodId: string, userId: string): void {
  if (typeof window === "undefined") return

  const allMethods = getAllPaymentMethodsData()
  const userMethods = allMethods[userId] || []

  userMethods.forEach((m) => {
    m.isDefault = m.id === methodId
  })

  allMethods[userId] = userMethods
  localStorage.setItem(PAYMENT_METHODS_STORAGE_KEY, JSON.stringify(allMethods))
}

function getAllPaymentMethodsData(): Record<string, SavedPaymentMethod[]> {
  if (typeof window === "undefined") return {}

  const methodsJson = localStorage.getItem(PAYMENT_METHODS_STORAGE_KEY)
  return methodsJson ? JSON.parse(methodsJson) : {}
}
