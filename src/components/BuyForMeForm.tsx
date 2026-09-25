import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface BuyForMeFormProps {
  onAddToCart: (item: CartItem) => void;
  onClose: () => void;
}

export default function BuyForMeForm({
  onAddToCart,
  onClose,
}: BuyForMeFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] =
    useState("");

  const handleAdd = () => {
    const cleanName = name.trim();
    const numericPrice =
      Number(price);

    if (!cleanName) {
      alert(
        "Escribe qué producto deseas comprar."
      );
      return;
    }

    if (
      !numericPrice ||
      numericPrice <= 0
    ) {
      alert(
        "Ingresa un precio válido."
      );
      return;
    }

    onAddToCart({
      id: `producto-${Date.now()}`,
      name: cleanName,
      price: numericPrice,
      quantity: 1,
    });

    setName("");
    setPrice("");

    alert(
      "Producto agregado al pedido."
    );
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-black text-gray-900">
          🛒 Comprar por mí
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Indica qué producto necesitas y un precio aproximado.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="productName"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Producto
          </label>

          <input
            id="productName"
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Ej: Arroz"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-red-500 focus:bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="productPrice"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Precio aproximado
          </label>

          <input
            id="productPrice"
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
          🛒 Agregar al pedido
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