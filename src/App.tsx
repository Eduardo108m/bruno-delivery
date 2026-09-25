import { useState } from "react";

import ServiceCard from "./components/ServiceCard";
import BuyForMeForm from "./components/BuyForMeForm";
import CustomOrderForm from "./components/CustomOrderForm";
import TransportForm from "./components/TransportForm";

import LocationPicker from "./components/LocationPicker";
import type { LocationData } from "./components/LocationPicker";

import {
  generateWhatsAppCheckout,
} from "./utils/whatsappCheckout";

import {
  getOrders,
  saveOrder,
  clearOrders,
} from "./utils/orderStorage";

import type { SavedOrder } from "./utils/orderStorage";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerData {
  phone: string;
  address: string;
}

type ServiceType =
  | "comprar"
  | "personalizado"
  | "transporte"
  | null;

const WHATSAPP_NUMBER = "593967584551";

export default function App() {
  // ==========================================
  // USUARIO
  // ==========================================

  const [userName, setUserName] = useState(
    localStorage.getItem("bruno_user_name") || ""
  );

  // IMPORTANTE:
  // Separamos lo que el usuario está escribiendo
  // del nombre que ya está guardado.
  const [nameInput, setNameInput] =
    useState(userName);

  // ==========================================
  // NAVEGACIÓN
  // ==========================================

  const [activeTab, setActiveTab] = useState<
    "inicio" | "pedidos" | "perfil"
  >("inicio");

  // ==========================================
  // SERVICIO ACTIVO
  // ==========================================

  const [activeService, setActiveService] =
    useState<ServiceType>(null);

  // ==========================================
  // CARRITO
  // ==========================================

  const [cart, setCart] = useState<CartItem[]>(
    []
  );

  // ==========================================
  // DATOS DEL CLIENTE
  // ==========================================

  const [customer, setCustomer] =
    useState<CustomerData>({
      phone: "",
      address: "",
    });

  // ==========================================
  // UBICACIÓN
  // ==========================================

  const [location, setLocation] =
    useState<LocationData>({
      lat: null,
      lng: null,
      reference: "",
    });

  // ==========================================
  // HISTORIAL
  // ==========================================

  const [orders, setOrders] =
    useState<SavedOrder[]>(getOrders());

  // ==========================================
  // CÁLCULOS DEL CARRITO
  // ==========================================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const deliveryCost = 1.0; // Costo fijo de delivery

  const total =
    subtotal + deliveryCost;

  // ==========================================
  // GUARDAR NOMBRE
  // ==========================================

  const handleSaveName = () => {
    const cleanName =
      nameInput.trim();

    if (!cleanName) {
      return;
    }

    localStorage.setItem(
      "bruno_user_name",
      cleanName
    );

    setUserName(cleanName);
  };

  // ==========================================
  // AGREGAR AL CARRITO
  // ==========================================

  const addToCart = (
    item: CartItem
  ) => {
    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (cartItem) =>
            cartItem.id === item.id
        );

      if (existingItem) {
        return currentCart.map(
          (cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity +
                    1,
                }
              : cartItem
        );
      }

      return [
        ...currentCart,
        {
          ...item,
          quantity:
            item.quantity || 1,
        },
      ];
    });
  };

  // ==========================================
  // CAMBIAR CANTIDAD
  // ==========================================

  const updateQuantity = (
    id: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      setCart(
        (currentCart) =>
          currentCart.filter(
            (item) =>
              item.id !== id
          )
      );

      return;
    }

    setCart(
      (currentCart) =>
        currentCart.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  quantity,
                }
              : item
        )
    );
  };

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  const removeFromCart = (
    id: string
  ) => {
    setCart(
      (currentCart) =>
        currentCart.filter(
          (item) =>
            item.id !== id
        )
    );
  };

  // ==========================================
  // CHECKOUT
  // ==========================================

  const handleCheckout = () => {
    if (!userName.trim()) {
      alert(
        "Primero debes ingresar tu nombre."
      );

      setActiveTab("perfil");

      return;
    }

    if (cart.length === 0) {
      alert(
        "Agrega al menos un producto al pedido."
      );

      return;
    }

    if (!customer.phone.trim()) {
      alert(
        "Ingresa tu número de teléfono."
      );

      setActiveTab("perfil");

      return;
    }

    if (!customer.address.trim()) {
      alert(
        "Ingresa la dirección de entrega."
      );

      setActiveTab("perfil");

      return;
    }

    // ========================================
    // CREAR PEDIDO
    // ========================================

    const newOrder: SavedOrder = {
      id: `PED-${Date.now()}`,

      date:
        new Date().toISOString(),

      customer: {
        name: userName.trim(),
        phone:
          customer.phone.trim(),
        address:
          customer.address.trim(),
        reference:
          location.reference.trim(),

        lat: location.lat,
        lng: location.lng,
      },

      items: cart.map(
        (item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity:
            item.quantity,
        })
      ),

      subtotal,
      deliveryCost,
      total,

      status: "Enviado",
    };

    // ========================================
    // GUARDAR PEDIDO
    // ========================================

    saveOrder(newOrder);

    setOrders(
      (currentOrders) => [
        newOrder,
        ...currentOrders,
      ]
    );

    // ========================================
    // GENERAR WHATSAPP
    // ========================================

    const whatsappUrl =
      generateWhatsAppCheckout({
        items: cart,

        customer: {
          name: userName.trim(),
          phone:
            customer.phone.trim(),
          address:
            customer.address.trim(),
          reference:
            location.reference.trim(),
          lat: location.lat,
          lng: location.lng,
        },

        deliveryCost,

        whatsappNumber:
          WHATSAPP_NUMBER,
      });

    window.open(
      whatsappUrl,
      "_blank"
    );

    // ========================================
    // LIMPIAR CARRITO
    // ========================================

    setCart([]);

    setActiveTab("pedidos");
  };

  // ==========================================
  // FORMULARIOS DE SERVICIOS
  // ==========================================

  const renderServiceForm = () => {
    if (!activeService) {
      return null;
    }

    switch (activeService) {
      case "comprar":
        return (
          <BuyForMeForm
            onAddToCart={
              addToCart
            }
            onClose={() =>
              setActiveService(
                null
              )
            }
          />
        );

      case "personalizado":
        return (
          <CustomOrderForm
            onAddToCart={
              addToCart
            }
            onClose={() =>
              setActiveService(
                null
              )
            }
          />
        );

      case "transporte":
        return (
          <TransportForm
            onClose={() =>
              setActiveService(
                null
              )
            }
          />
        );

      default:
        return null;
    }
  };

  // ==========================================
  // INICIO
  // ==========================================

  const renderHome = () => {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-sm text-gray-500">
            Hola,
          </p>

          <h1 className="text-2xl font-black text-gray-900">
            {userName} 👋
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            ¿Qué necesitas hoy?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <ServiceCard
            title="Comprar por mí"
            description="Nosotros compramos y llevamos tu pedido."
            icon="🛒"
            onClick={() =>
              setActiveService(
                "comprar"
              )
            }
          />

          <ServiceCard
            title="Pedido personalizado"
            description="Cuéntanos qué necesitas y nosotros lo gestionamos."
            icon="📦"
            onClick={() =>
              setActiveService(
                "personalizado"
              )
            }
          />

          <ServiceCard
            title="Transporte"
            description="Solicita un transporte para tus necesidades."
            icon="🛵"
            onClick={() =>
              setActiveService(
                "transporte"
              )
            }
          />
        </div>

        {cart.length > 0 && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Pedido actual
                </p>

                <p className="text-xl font-black text-gray-900">
                  $
                  {total.toFixed(
                    2
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "perfil"
                  )
                }
                className="rounded-xl bg-red-500 px-4 py-3 font-bold text-white"
              >
                Ver pedido
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // PEDIDOS
  // ==========================================

  const renderOrders = () => {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Mis pedidos
            </h2>

            <p className="text-sm text-gray-500">
              Historial guardado en este dispositivo.
            </p>
          </div>

          {orders.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const confirmDelete =
                  window.confirm(
                    "¿Quieres borrar todo el historial?"
                  );

                if (
                  confirmDelete
                ) {
                  clearOrders();
                  setOrders([]);
                }
              }}
              className="text-xs font-bold text-red-500"
            >
              Borrar
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="text-5xl">
              📦
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              No tienes pedidos
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Cuando realices un pedido aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(
              (order) => (
                <div
                  key={order.id}
                  className="rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-gray-900">
                        {order.id}
                      </p>

                      <p className="text-xs text-gray-500">
                        {new Date(
                          order.date
                        ).toLocaleString(
                          "es-EC"
                        )}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {order.items.map(
                      (item) => (
                        <div
                          key={
                            item.id
                          }
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {
                              item.name
                            }{" "}
                            x
                            {
                              item.quantity
                            }
                          </span>

                          <span className="font-semibold text-gray-900">
                            $
                            {(
                              item.price *
                              item.quantity
                            ).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span>
                        $
                        {order.subtotal.toFixed(
                          2
                        )}
                      </span>
                    </div>

                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-gray-500">
                        Delivery
                      </span>

                      <span>
                        $
                        {order.deliveryCost.toFixed(
                          2
                        )}
                      </span>
                    </div>

                    <div className="mt-2 flex justify-between">
                      <span className="font-bold">
                        Total
                      </span>

                      <span className="text-lg font-black text-red-500">
                        $
                        {order.total.toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>

                  {order.customer
                    .lat !== null &&
                    order.customer
                      .lng !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          const mapsUrl =
                            `https://www.google.com/maps/search/?api=1&query=` +
                            `${order.customer.lat},${order.customer.lng}`;

                          window.open(
                            mapsUrl,
                            "_blank"
                          );
                        }}
                        className="mt-3 w-full rounded-xl border border-gray-200 py-2 text-sm font-bold text-gray-700"
                      >
                        🗺️ Ver ubicación
                      </button>
                    )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // PERFIL
  // ==========================================

  const renderProfile = () => {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            Mi perfil
          </h2>

          <p className="text-sm text-gray-500">
            Tus datos se guardan solamente en este dispositivo.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
              👤
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Nombre
              </p>

              <p className="font-bold text-gray-900">
                {userName}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500">
                Teléfono
              </p>

              <input
                type="tel"
                value={
                  customer.phone
                }
                onChange={(e) =>
                  setCustomer(
                    (prev) => ({
                      ...prev,
                      phone:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="0999999999"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-red-500 focus:bg-white"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">
                Dirección
              </p>

              <textarea
                value={
                  customer.address
                }
                onChange={(e) =>
                  setCustomer(
                    (prev) => ({
                      ...prev,
                      address:
                        e.target
                          .value,
                    })
                  )
                }
                rows={3}
                placeholder="Escribe tu dirección de entrega"
                className="mt-1 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-red-500 focus:bg-white"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">
                GPS
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {location.lat !==
                  null &&
                location.lng !==
                  null
                  ? "✅ Ubicación disponible"
                  : "📍 Se solicitará al realizar un pedido"}
              </p>
            </div>
          </div>
        </div>

        {/* ====================================
            UBICACIÓN
        ==================================== */}

        <LocationPicker
          value={location}
          onChange={
            setLocation
          }
        />

        {/* ====================================
            CARRITO
        ==================================== */}

        {cart.length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-black text-gray-900">
              🛒 Pedido actual
            </h3>

            <div className="mt-4 space-y-3">
              {cart.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        $
                        {item.price.toFixed(
                          2
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity -
                              1
                          )
                        }
                        className="h-8 w-8 rounded-lg bg-gray-100 font-bold"
                      >
                        −
                      </button>

                      <span className="w-5 text-center font-bold">
                        {
                          item.quantity
                        }
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity +
                              1
                          )
                        }
                        className="h-8 w-8 rounded-lg bg-gray-100 font-bold"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                        className="ml-1 text-red-500"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-sm">
                <span>
                  Subtotal
                </span>

                <span>
                  $
                  {subtotal.toFixed(
                    2
                  )}
                </span>
              </div>

              <div className="mt-1 flex justify-between text-sm">
                <span>
                  Delivery
                </span>

                <span>
                  $
                  {deliveryCost.toFixed(
                    2
                  )}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-lg font-black">
                <span>
                  Total
                </span>

                <span className="text-red-500">
                  $
                  {total.toFixed(
                    2
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={
                  handleCheckout
                }
                className="mt-4 w-full rounded-xl bg-red-500 px-4 py-3 font-black text-white hover:bg-red-600"
              >
                📲 Pedir por WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // PANTALLA INICIAL: NOMBRE
  // ==========================================

  if (!userName.trim()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
              🛵
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-900">
              Bienvenido a Bruno Delivery
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Antes de comenzar, dinos cómo te gustaría que te llamemos.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Tu nombre
            </label>

            <input
              id="name"
              type="text"
              value={nameInput}
              onChange={(e) =>
                setNameInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  handleSaveName();
                }
              }}
              placeholder="Ej: Jeysson"
              autoFocus
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 focus:bg-white"
            />
          </div>

          <button
            type="button"
            onClick={
              handleSaveName
            }
            disabled={
              !nameInput.trim()
            }
            className="mt-4 w-full rounded-xl bg-red-500 px-4 py-3 font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar →
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-gray-400">
            No necesitas crear una cuenta.
            <br />
            Tu nombre se guarda solamente en este dispositivo.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // APLICACIÓN PRINCIPAL
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-black text-gray-900">
              Bruno Delivery 🛵
            </h1>

            <p className="text-xs text-gray-500">
              Hola, {userName}
            </p>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "perfil"
                )
              }
              className="relative rounded-xl bg-red-50 px-3 py-2 text-xl"
            >
              🛒

              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {cart.reduce(
                  (sum, item) =>
                    sum +
                    item.quantity,
                  0
                )}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* CONTENIDO */}

      <main className="mx-auto max-w-2xl px-4 py-5">
        {activeService ? (
          <div>
            <button
              type="button"
              onClick={() =>
                setActiveService(
                  null
                )
              }
              className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-600"
            >
              ← Volver
            </button>

            {renderServiceForm()}

            {activeService !==
              "transporte" && (
              <LocationPicker
                value={location}
                onChange={
                  setLocation
                }
              />
            )}
          </div>
        ) : activeTab ===
          "inicio" ? (
          renderHome()
        ) : activeTab ===
          "pedidos" ? (
          renderOrders()
        ) : (
          renderProfile()
        )}
      </main>

      {/* NAVEGACIÓN INFERIOR */}

      {!activeService && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white">
          <div className="mx-auto grid max-w-2xl grid-cols-3">
            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "inicio"
                )
              }
              className={`flex flex-col items-center gap-1 px-4 py-3 text-xs font-bold ${
                activeTab ===
                "inicio"
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              <span className="text-xl">
                🏠
              </span>

              Inicio
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "pedidos"
                )
              }
              className={`flex flex-col items-center gap-1 px-4 py-3 text-xs font-bold ${
                activeTab ===
                "pedidos"
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              <span className="text-xl">
                📦
              </span>

              Pedidos
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "perfil"
                )
              }
              className={`flex flex-col items-center gap-1 px-4 py-3 text-xs font-bold ${
                activeTab ===
                "perfil"
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              <span className="text-xl">
                👤
              </span>

              Perfil
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}