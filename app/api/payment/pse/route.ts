import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, pseData } = body

    // Validar datos requeridos
    if (!orderId || !pseData) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Validar datos de PSE
    const { bank, personType, documentType, documentNumber } = pseData

    if (!bank || !personType || !documentType || !documentNumber) {
      return NextResponse.json({ error: "Datos de PSE incompletos" }, { status: 400 })
    }

    // Simular procesamiento de pago PSE
    console.log("[v0] Procesando pago PSE para orden:", orderId)
    console.log("[v0] Banco:", bank)
    console.log("[v0] Documento:", documentType, documentNumber)

    // Simular delay de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generar URL de redirección simulada al banco
    const transactionId = `TXN-PSE-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const bankRedirectUrl = `https://pse-simulator.com/payment?transaction=${transactionId}&bank=${encodeURIComponent(bank)}`

    // En producción, aquí redirigirías al usuario al portal del banco
    // Por ahora, simulamos que el pago fue exitoso
    return NextResponse.json({
      success: true,
      transactionId,
      orderId,
      bankRedirectUrl,
      message: "Redirigiendo al portal del banco...",
      paymentMethod: "pse",
      bank,
      // En producción, el usuario sería redirigido y luego regresaría con un callback
      // Por ahora simulamos que el pago fue aprobado
      status: "approved",
    })
  } catch (error) {
    console.error("[v0] Error al procesar pago PSE:", error)
    return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 })
  }
}
