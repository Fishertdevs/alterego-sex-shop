import { getOrdersByUserId, type Order } from "./orders"

export interface ReturnRequest {
  id: string
  orderId: string
  userId: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
  }[]
  reason: string
  description: string
  status: "pending" | "approved" | "rejected" | "completed"
  refundAmount: number
  createdAt: string
  updatedAt: string
  trackingNumber?: string
}

const RETURNS_STORAGE_KEY = "alterego-returns"

export function createReturnRequest(
  orderId: string,
  userId: string,
  items: ReturnRequest["items"],
  reason: string,
  description: string,
): ReturnRequest {
  if (typeof window === "undefined") throw new Error("Cannot create return request on server")

  const allReturns = getAllReturnsData()
  const userReturns = allReturns[userId] || []

  // Check if return already exists for this order
  if (userReturns.some((ret) => ret.orderId === orderId)) {
    throw new Error("Ya existe una solicitud de devolución para este pedido")
  }

  const refundAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const newReturn: ReturnRequest = {
    id: `RET-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    orderId,
    userId,
    items,
    reason,
    description,
    status: "pending",
    refundAmount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  userReturns.push(newReturn)
  allReturns[userId] = userReturns
  localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(allReturns))

  return newReturn
}

export function getReturnsByUserId(userId: string): ReturnRequest[] {
  if (typeof window === "undefined") return []

  const allReturns = getAllReturnsData()
  return (allReturns[userId] || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getReturnById(returnId: string, userId: string): ReturnRequest | null {
  const returns = getReturnsByUserId(userId)
  return returns.find((ret) => ret.id === returnId) || null
}

export function updateReturnStatus(
  returnId: string,
  userId: string,
  status: ReturnRequest["status"],
  trackingNumber?: string,
): void {
  if (typeof window === "undefined") return

  const allReturns = getAllReturnsData()
  const userReturns = allReturns[userId] || []

  const returnIndex = userReturns.findIndex((ret) => ret.id === returnId)
  if (returnIndex === -1) return

  userReturns[returnIndex].status = status
  userReturns[returnIndex].updatedAt = new Date().toISOString()
  if (trackingNumber) {
    userReturns[returnIndex].trackingNumber = trackingNumber
  }

  allReturns[userId] = userReturns
  localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(allReturns))
}

export function cancelReturnRequest(returnId: string, userId: string): void {
  if (typeof window === "undefined") return

  const allReturns = getAllReturnsData()
  const userReturns = allReturns[userId] || []

  const filtered = userReturns.filter((ret) => ret.id !== returnId)
  allReturns[userId] = filtered
  localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(allReturns))
}

export function getEligibleOrdersForReturn(userId: string): Order[] {
  const orders = getOrdersByUserId(userId)
  const returns = getReturnsByUserId(userId)
  const returnedOrderIds = new Set(returns.map((ret) => ret.orderId))

  // Only delivered orders that haven't been returned yet
  return orders.filter((order) => order.status === "delivered" && !returnedOrderIds.has(order.id))
}

function getAllReturnsData(): Record<string, ReturnRequest[]> {
  if (typeof window === "undefined") return {}

  const returnsJson = localStorage.getItem(RETURNS_STORAGE_KEY)
  return returnsJson ? JSON.parse(returnsJson) : {}
}
