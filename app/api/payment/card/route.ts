import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, cardData } = body

    // Validar datos requeridos
    if (!orderId || !cardData) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Validar datos de tarjeta
    const { cardNumber, cardName, expiryDate, cvv } = cardData

    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      return NextResponse.json({ error: "Datos de tarjeta incompletos" }, { status: 400 })
    }

    // Simular procesamiento de pago (en producción, aquí integrarías con Stripe, Wompi, PayU, etc.)
    console.log("[v0] Procesando pago con tarjeta para orden:", orderId)
    console.log("[v0] Tarjeta terminada en:", cardNumber.slice(-4))

    // Simular delay de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simular éxito del pago (95% de éxito)
    const isSuccess = Math.random() > 0.05

    if (isSuccess) {
      const transactionId = `TXN-CARD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

      return NextResponse.json({
        success: true,
        transactionId,
        orderId,
        message: "Pago procesado exitosamente",
        paymentMethod: "card",
        last4: cardNumber.slice(-4),
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error:
            "El pago fue rechazado. Por favor, verifica los datos de tu tarjeta o intenta con otro método de pago.",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("[v0] Error al procesar pago con tarjeta:", error)
    return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 })
  }
}
