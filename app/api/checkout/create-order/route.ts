import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, items, shippingData, total } = body

    // Validar datos requeridos
    if (!userId || !items || !shippingData || !total) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Generar ID de orden único
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const order = {
      id: orderId,
      userId,
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        category: item.category,
      })),
      shippingData,
      total,
      status: "pending" as const,
      paymentMethod: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("[v0] Orden creada:", order)

    return NextResponse.json({
      success: true,
      orderId,
      order,
      message: "Orden creada exitosamente",
    })
  } catch (error) {
    console.error("[v0] Error al crear orden:", error)
    return NextResponse.json({ error: "Error al crear la orden" }, { status: 500 })
  }
}
