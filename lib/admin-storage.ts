// Sistema de almacenamiento para el dashboard de administración

export interface AdminProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  subcategory?: string // Added subcategory field
  stock: number
  images: string[] // Base64 o URLs
  videos: string[] // Agregar soporte para videos
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminOrder {
  id: string
  customerName: string
  customerEmail: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  shippingAddress: string
  createdAt: string
  updatedAt: string
}

export interface AdminCustomer {
  id: string
  name: string
  email: string
  phone?: string
  totalOrders: number
  totalSpent: number
  createdAt: string
  lastOrderAt?: string
}

export interface AdminSettings {
  storeName: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  currency: string
  taxRate: number
  shippingCost: number
  notifications: {
    emailOnNewOrder: boolean
    emailOnLowStock: boolean
    lowStockThreshold: number
  }
}

// Productos
export function getAdminProducts(): AdminProduct[] {
  if (typeof window === "undefined") return []
  const products = localStorage.getItem("admin_products")
  return products ? JSON.parse(products) : []
}

export function saveAdminProduct(product: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">): AdminProduct {
  const products = getAdminProducts()
  const newProduct: AdminProduct = {
    ...product,
    id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  products.push(newProduct)
  localStorage.setItem("admin_products", JSON.stringify(products))
  return newProduct
}

export function updateAdminProduct(id: string, updates: Partial<AdminProduct>): AdminProduct | null {
  const products = getAdminProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return null

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem("admin_products", JSON.stringify(products))
  return products[index]
}

export function deleteAdminProduct(id: string): boolean {
  const products = getAdminProducts()
  const filtered = products.filter((p) => p.id !== id)
  if (filtered.length === products.length) return false
  localStorage.setItem("admin_products", JSON.stringify(filtered))
  return true
}

// Pedidos
export function getAdminOrders(): AdminOrder[] {
  if (typeof window === "undefined") return []
  const orders = localStorage.getItem("admin_orders")
  return orders ? JSON.parse(orders) : []
}

export function saveAdminOrder(order: Omit<AdminOrder, "id" | "createdAt" | "updatedAt">): AdminOrder {
  const orders = getAdminOrders()
  const newOrder: AdminOrder = {
    ...order,
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  orders.push(newOrder)
  localStorage.setItem("admin_orders", JSON.stringify(orders))
  return newOrder
}

export function updateAdminOrder(id: string, updates: Partial<AdminOrder>): AdminOrder | null {
  const orders = getAdminOrders()
  const index = orders.findIndex((o) => o.id === id)
  if (index === -1) return null

  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem("admin_orders", JSON.stringify(orders))
  return orders[index]
}

// Clientes
export function getAdminCustomers(): AdminCustomer[] {
  if (typeof window === "undefined") return []
  const customers = localStorage.getItem("admin_customers")
  return customers ? JSON.parse(customers) : []
}

export function saveAdminCustomer(customer: Omit<AdminCustomer, "id" | "createdAt">): AdminCustomer {
  const customers = getAdminCustomers()
  const newCustomer: AdminCustomer = {
    ...customer,
    id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  }
  customers.push(newCustomer)
  localStorage.setItem("admin_customers", JSON.stringify(customers))
  return newCustomer
}

export function updateAdminCustomer(id: string, updates: Partial<AdminCustomer>): AdminCustomer | null {
  const customers = getAdminCustomers()
  const index = customers.findIndex((c) => c.id === id)
  if (index === -1) return null

  customers[index] = {
    ...customers[index],
    ...updates,
  }
  localStorage.setItem("admin_customers", JSON.stringify(customers))
  return customers[index]
}

// Configuración
export function getAdminSettings(): AdminSettings {
  if (typeof window === "undefined") {
    return getDefaultSettings()
  }
  const settings = localStorage.getItem("admin_settings")
  return settings ? JSON.parse(settings) : getDefaultSettings()
}

export function saveAdminSettings(settings: AdminSettings): void {
  localStorage.setItem("admin_settings", JSON.stringify(settings))
}

function getDefaultSettings(): AdminSettings {
  return {
    storeName: "ALTERƎGO",
    storeEmail: "contacto@alterego.com",
    storePhone: "+57 300 123 4567",
    storeAddress: "Bogotá, Colombia",
    currency: "COP",
    taxRate: 19,
    shippingCost: 15000,
    notifications: {
      emailOnNewOrder: true,
      emailOnLowStock: true,
      lowStockThreshold: 5,
    },
  }
}

// Utilidades para imágenes
export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Estadísticas
export function getAdminStats() {
  const products = getAdminProducts()
  const orders = getAdminOrders()
  const customers = getAdminCustomers()

  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, order) => sum + order.total, 0)

  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const lowStockProducts = products.filter((p) => p.stock < 5).length

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalRevenue,
    pendingOrders,
    lowStockProducts,
  }
}
