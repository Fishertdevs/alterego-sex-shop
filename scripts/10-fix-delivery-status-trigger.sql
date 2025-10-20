-- ============================================
-- CORREGIR TRIGGER DE DELIVERY_STATUS
-- ============================================

-- Actualizar función para generar notificaciones automáticas de pedidos
-- Corregir los valores de delivery_status para que coincidan con la restricción CHECK
CREATE OR REPLACE FUNCTION create_order_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificación cuando se crea un nuevo pedido (pendiente)
  IF TG_OP = 'INSERT' THEN
    INSERT INTO notifications (type, title, message, related_id)
    VALUES (
      'order_pending',
      'Nuevo Pedido Pendiente',
      'Se ha creado un nuevo pedido de ' || NEW.customer_name || ' por $' || NEW.total_product_cost || ' COP',
      NEW.id
    );
  END IF;
  
  -- Notificación cuando cambia el estado del pedido
  IF TG_OP = 'UPDATE' AND OLD.order_status IS DISTINCT FROM NEW.order_status THEN
    CASE NEW.order_status
      WHEN 'confirmed' THEN
        INSERT INTO notifications (type, title, message, related_id)
        VALUES (
          'sale_confirmed',
          'Venta Confirmada',
          'El pedido de ' || NEW.customer_name || ' ha sido confirmado por $' || NEW.total_product_cost || ' COP',
          NEW.id
        );
      WHEN 'cancelled' THEN
        INSERT INTO notifications (type, title, message, related_id)
        VALUES (
          'sale_discarded',
          'Venta Descartada',
          'El pedido de ' || NEW.customer_name || ' ha sido cancelado',
          NEW.id
        );
      WHEN 'completed' THEN
        INSERT INTO notifications (type, title, message, related_id)
        VALUES (
          'order_completed',
          'Pedido Completado',
          'El pedido de ' || NEW.customer_name || ' ha sido completado exitosamente',
          NEW.id
        );
      ELSE
        -- No hacer nada para otros estados
        NULL;
    END CASE;
  END IF;
  
  -- Notificación cuando cambia el estado de entrega
  -- Actualizar los valores para que coincidan con la restricción CHECK: 'yes', 'no', 'returned', 'in_transit'
  IF TG_OP = 'UPDATE' AND OLD.delivery_status IS DISTINCT FROM NEW.delivery_status THEN
    CASE NEW.delivery_status
      WHEN 'yes' THEN
        INSERT INTO notifications (type, title, message, related_id)
        VALUES (
          'delivery_yes',
          'Pedido Entregado',
          'El pedido de ' || NEW.customer_name || ' ha sido entregado exitosamente',
          NEW.id
        );
      WHEN 'no' THEN
        INSERT INTO notifications (type, title, message, related_id)
        VALUES (
          'delivery_no',
          'Pedido No Entregado',
          'El pedido de ' || NEW.customer_name || ' no pudo ser entregado',
          NEW.id
        );
      WHEN 'returned' THEN
        INSERT INTO notifications (type, title, message, related_id)
        VALUES (
          'delivery_returned',
          'Pedido Devuelto',
          'El pedido de ' || NEW.customer_name || ' ha sido devuelto',
          NEW.id
        );
      WHEN 'in_transit' THEN
        INSERT INTO notifications (type, title, message, related_id)
        VALUES (
          'delivery_in_transit',
          'Pedido En Tránsito',
          'El pedido de ' || NEW.customer_name || ' está en tránsito',
          NEW.id
        );
      ELSE
        -- No hacer nada para otros estados
        NULL;
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- El trigger ya existe, no es necesario recrearlo
-- Solo se actualiza la función que ejecuta
