import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomOrderFormProps {
  onAddToCart: (item: CartItem) => void;
  onClose: () => void;
}

export default function CustomOrderForm({
  onAddToCart,
  onClose,
}: CustomOrderFormProps) {
  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const handleAdd = () => {
    const cleanDescription =
      description.trim();

    const numericPrice =
      Number(price);

    if (!cleanDescription) {
      alert(
        "Describe lo que necesitas."
      );
      return;
    }

    if (
      !numericPrice ||
      numericPrice <= 0
    ) {
      alert(
        "Ingresa un precio aproximado."
      );
      return;
    }

    onAddToCart({
      id: `personalizado-${Date.now()}`,
      name: cleanDescription,
      price: numericPrice,
      quantity: 1,
    });

    setDescription("");
    setPrice("");

    alert(
      "Pedido personalizado agregado."
    );
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-black text-gray-900">
          📦 Pedido personalizado
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Describe exactamente lo que necesitas.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="customDescription"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            ¿Qué necesitas?
          </label>

          <textarea
            id="customDescription"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows={4}
            placeholder="Ej: Necesito comprar un medicamento, recoger un paquete..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-red-500 focus:bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="customPrice"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Precio aproximado
          </label>

          <input
            id="customPrice"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            placeholder=""
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-red-500 focus:bg-white"
          />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="w-full rounded-xl bg-red-500 px-4 py-3 font-black text-white hover:bg-red-600"
        >
          📦 Agregar al pedido
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 font-bold text-gray-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}