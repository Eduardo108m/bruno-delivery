import { useState, type FormEvent } from "react";

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
  const [price, setPrice] = useState("");
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanName = name.trim();
    const numericPrice = Number(price);

    const nextNameError = cleanName
      ? ""
      : "Escribe qué producto deseas comprar.";
    const nextPriceError =
      Number.isFinite(numericPrice) && numericPrice > 0
        ? ""
        : "Ingresa un precio mayor que 0.";

    setNameError(nextNameError);
    setPriceError(nextPriceError);
    setFeedback("");

    if (nextNameError || nextPriceError) {
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
    setFeedback("Producto agregado al pedido.");
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 border-b border-gray-100 pb-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-600">
          Servicio de compras
        </p>
        <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
          🛒 Comprar por mí
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Cuéntanos qué producto buscas y cuánto cuesta aproximadamente.
        </p>
      </div>

      <form noValidate onSubmit={handleAdd} className="space-y-5">
        <div>
          <label
            htmlFor="productName"
            className="mb-2 block text-sm font-bold text-gray-800"
          >
            Producto <span className="text-red-600">*</span>
          </label>

          <input
            id="productName"
            type="text"
            maxLength={80}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError("");
              setFeedback("");
            }}
            placeholder="Ej. Arroz, leche o jabón"
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "productNameError" : undefined}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
          {nameError && (
            <p id="productNameError" className="mt-2 text-sm text-red-700" role="alert">
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="productPrice"
            className="mb-2 block text-sm font-bold text-gray-800"
          >
            Precio aproximado <span className="text-red-600">*</span>
          </label>

          <input
            id="productPrice"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            value={price}
            onChange={(event) => {
              setPrice(event.target.value);
              setPriceError("");
              setFeedback("");
            }}
            placeholder="0.00"
            aria-invalid={Boolean(priceError)}
            aria-describedby={priceError ? "productPriceError" : undefined}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
          <p className="mt-2 text-xs text-gray-500">Valor en dólares (USD).</p>
          {priceError && (
            <p id="productPriceError" className="mt-2 text-sm text-red-700" role="alert">
              {priceError}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="active-scale w-full rounded-xl bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
        >
          Agregar producto
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          Cancelar
        </button>
        {feedback && (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-800" aria-live="polite" role="status">
            {feedback}
          </p>
        )}
      </form>
    </section>
  );
}