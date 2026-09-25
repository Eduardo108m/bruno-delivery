export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  reference: string;
  lat: number | null;
  lng: number | null;
}

export interface CheckoutData {
  items: CartItem[];
  customer: CustomerData;
  deliveryCost: number;
  whatsappNumber: string;
}

export function calculateSubtotal(
  items: CartItem[]
): number {
  return items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );
}

export function calculateTotal(
  items: CartItem[],
  deliveryCost: number
): number {
  return calculateSubtotal(items) + deliveryCost;
}

export function generateWhatsAppMessage(
  data: CheckoutData
): string {
  const {
    items,
    customer,
    deliveryCost,
  } = data;

  const subtotal = calculateSubtotal(items);
  const total = calculateTotal(
    items,
    deliveryCost
  );

  let message = `🛵 *NUEVO PEDIDO - BRUNO DELIVERY*\n\n`;

  message += `👤 *DATOS DEL CLIENTE*\n`;
  message += `Nombre: ${customer.name}\n`;
  message += `Teléfono: ${customer.phone}\n\n`;

  message += `📦 *PRODUCTOS*\n`;

  items.forEach((item) => {
    const itemTotal =
      item.price * item.quantity;

    message += `• ${item.name} x${item.quantity} - $${itemTotal.toFixed(
      2
    )}\n`;
  });

  message += `\n💰 *RESUMEN*\n`;
  message += `Subtotal: $${subtotal.toFixed(2)}\n`;
  message += `Delivery: $${deliveryCost.toFixed(2)}\n`;
  message += `*TOTAL: $${total.toFixed(2)}*\n\n`;

  message += `📍 *DATOS DE ENTREGA*\n`;
  message += `Dirección: ${customer.address}\n`;

  if (customer.reference.trim()) {
    message += `Referencia: ${customer.reference}\n`;
  }

  // Generar enlace de Google Maps
  if (
    customer.lat !== null &&
    customer.lng !== null
  ) {
    const mapsUrl = `https://www.google.com/maps?q=${customer.lat},${customer.lng}`;

    message += `\n🗺️ *UBICACIÓN GPS*\n`;
    message += `${mapsUrl}\n`;
  } else {
    message += `\n⚠️ *UBICACIÓN GPS*\n`;
    message += `El cliente no seleccionó una ubicación en el mapa.\n`;
  }

  message += `\n🙏 Gracias por usar Bruno Delivery.`;

  return message;
}

export function generateWhatsAppCheckout(
  data: CheckoutData
): string {
  const message =
    generateWhatsAppMessage(data);

  const cleanNumber =
    data.whatsappNumber.replace(/\D/g, "");

  const encodedMessage =
    encodeURIComponent(message);

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}