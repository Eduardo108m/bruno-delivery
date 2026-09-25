export interface SavedOrder {
  id: string;
  date: string;

  customer: {
    name: string;
    phone: string;
    address: string;
    reference: string;
    lat: number | null;
    lng: number | null;
  };

  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  subtotal: number;
  deliveryCost: number;
  total: number;

  status:
    | "Enviado"
    | "Entregado"
    | "Cancelado";
}

const STORAGE_KEY =
  "bruno_delivery_orders";

export function getOrders(): SavedOrder[] {
  try {
    const stored =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!stored) {
      return [];
    }

    return JSON.parse(
      stored
    ) as SavedOrder[];
  } catch {
    return [];
  }
}

export function saveOrder(
  order: SavedOrder
): void {
  const orders = getOrders();

  orders.unshift(order);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(orders)
  );
}

export function clearOrders(): void {
  localStorage.removeItem(
    STORAGE_KEY
  );
}