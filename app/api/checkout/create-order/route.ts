import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, items, shippingData, paymentData, total } = body

    console.log("[v0] Creating order with data:", { userId, items: items.length, total })

    // Validar datos requeridos
    if (!userId || !items || !shippingData || !total) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Verificar stock disponible para cada producto
    for (const item of items) {
      const { data: product, error } = await supabase
        .from("products")
        .select("id, name, stock, auto_deduct_stock")
        .eq("id", item.id)
        .single()

      if (error || !product) {
        console.error("[v0] Product not found:", item.id, error)
        return NextResponse.json({ error: `Producto no encontrado: ${item.name}` }, { status: 404 })
      }

      // Solo verificar stock si auto_deduct_stock está habilitado
      if (product.auto_deduct_stock && product.stock < item.quantity) {
        console.error(
          "[v0] Insufficient stock:",
          product.name,
          "Available:",
          product.stock,
          "Requested:",
          item.quantity,
        )
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}` },
          { status: 400 },
        )
      }
    }

    // Crear el pedido en Supabase
    const orderData = {
      user_id: userId,
      customer_name: shippingData.fullName,
      customer_phone: shippingData.phone,
      customer_address: shippingData.address,
      customer_department: shippingData.department,
      customer_municipality: shippingData.municipality,
      payment_method: paymentData?.method || "pending",
      bank: paymentData?.bank || null,
      account_type: paymentData?.accountType || null,
      account_number: paymentData?.accountNumber || null,
      order_status: "pending",
      delivery_status: "no",
      delivered: false,
      shipping_type: shippingData.shippingType || "standard",
      shipping_cost: shippingData.shippingCost || 0,
      shipping_carrier: shippingData.carrier || null,
      shipping_notes: shippingData.notes || null,
      products: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        category: item.category,
      })),
      total_amount: total,
    }

    console.log("[v0] Inserting order into database...")

    const { data: order, error: orderError } = await supabase.from("orders").insert(orderData).select().single()

    if (orderError) {
      console.error("[v0] Error creating order:", orderError)
      return NextResponse.json({ error: "Error al crear el pedido en la base de datos" }, { status: 500 })
    }

    console.log("[v0] Order created successfully:", order.id)

    // Disminuir el stock de cada producto (solo si auto_deduct_stock es true)
    for (const item of items) {
      const { data: product } = await supabase
        .from("products")
        .select("stock, auto_deduct_stock")
        .eq("id", item.id)
        .single()

      if (product && product.auto_deduct_stock) {
        const newStock = product.stock - item.quantity

        console.log("[v0] Updating stock for product:", item.id, "Old stock:", product.stock, "New stock:", newStock)

        const { error: stockError } = await supabase.from("products").update({ stock: newStock }).eq("id", item.id)

        if (stockError) {
          console.error("[v0] Error updating stock:", stockError)
          // No retornamos error aquí para no bloquear el pedido
          // El pedido ya fue creado, solo logueamos el error
        } else {
          console.log("[v0] Stock updated successfully for product:", item.id)
        }
      } else {
        console.log("[v0] Skipping stock deduction for product:", item.id, "(auto_deduct_stock disabled)")
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
      message: "Pedido creado exitosamente",
    })
  } catch (error) {
    console.error("[v0] Error in create-order:", error)
    return NextResponse.json({ error: "Error al procesar el pedido" }, { status: 500 })
  }
}
