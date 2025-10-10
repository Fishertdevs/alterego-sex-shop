export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  image: string
  category: string
}

export interface ShippingInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  department: string
  postalCode: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  shippingData: ShippingInfo
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  transactionId?: string
  createdAt: string
  updatedAt: string
}

const ORDERS_STORAGE_KEY = "alterego-orders"

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return

  const orders = getOrders()
  orders.push(order)
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return []

  const ordersJson = localStorage.getItem(ORDERS_STORAGE_KEY)
  return ordersJson ? JSON.parse(ordersJson) : []
}

export function getOrdersByUserId(userId: string): Order[] {
  const orders = getOrders()
  return orders
    .filter((order) => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getOrderById(orderId: string): Order | null {
  const orders = getOrders()
  return orders.find((order) => order.id === orderId) || null
}

export function updateOrderStatus(orderId: string, status: Order["status"]): void {
  if (typeof window === "undefined") return

  const orders = getOrders()
  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex !== -1) {
    orders[orderIndex].status = status
    orders[orderIndex].updatedAt = new Date().toISOString()
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  }
}

export function updateOrderTransaction(orderId: string, transactionId: string, paymentMethod: string): void {
  if (typeof window === "undefined") return

  const orders = getOrders()
  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex !== -1) {
    orders[orderIndex].transactionId = transactionId
    orders[orderIndex].paymentMethod = paymentMethod
    orders[orderIndex].status = "processing"
    orders[orderIndex].updatedAt = new Date().toISOString()
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  }
}
