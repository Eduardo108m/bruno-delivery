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

const STORAGE_KEY = "bruno_delivery_orders";

const MAX_ORDER_AGE =
  30 * 24 * 60 * 60 * 1000;

export function getOrders(): SavedOrder[] {
  try {
    const stored = localStorage.getItem(
      STORAGE_KEY
    );

    if (!stored) {
      return [];
    }

    const orders =
      JSON.parse(stored) as SavedOrder[];

    const now = Date.now();

    const recentOrders = orders.filter(
      (order) => {
        const orderDate =
          new Date(order.date).getTime();

        return (
          !Number.isNaN(orderDate) &&
          now - orderDate <= MAX_ORDER_AGE
        );
      }
    );

    if (
      recentOrders.length !== orders.length
    ) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(recentOrders)
      );
    }

    return recentOrders;
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