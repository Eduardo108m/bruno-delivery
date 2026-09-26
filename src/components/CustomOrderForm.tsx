import { useState, type FormEvent } from "react";

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
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanDescription = description.trim();
    const numericPrice = Number(price);

    const nextDescriptionError = cleanDescription
      ? ""
      : "Describe lo que necesitas.";
    const nextPriceError =
      Number.isFinite(numericPrice) && numericPrice > 0
        ? ""
        : "Ingresa un precio mayor que 0.";

    setDescriptionError(nextDescriptionError);
    setPriceError(nextPriceError);
    setFeedback("");

    if (nextDescriptionError || nextPriceError) {
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
    setFeedback("Pedido personalizado agregado.");
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 border-b border-gray-100 pb-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-600">
          Solicitud especial
        </p>
        <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
          📦 Pedido personalizado
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Detalla lo que debemos hacer para preparar tu pedido correctamente.
        </p>
      </div>

      <form noValidate onSubmit={handleAdd} className="space-y-5">
        <div>
          <label
            htmlFor="customDescription"
            className="mb-2 block text-sm font-bold text-gray-800"
          >
            ¿Qué necesitas? <span className="text-red-600">*</span>
          </label>

          <textarea
            id="customDescription"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setDescriptionError("");
              setFeedback("");
            }}
            rows={5}
            maxLength={500}
            placeholder="Ej. Recoger un paquete en la farmacia y entregarlo en mi domicilio."
            aria-invalid={Boolean(descriptionError)}
            aria-describedby={descriptionError ? "customDescriptionError" : "customDescriptionCount"}
            className="w-full resize-y rounded-xl border border-gray-300 bg-white p-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
          <div className="mt-2 flex items-start justify-between gap-3">
            {descriptionError ? (
              <p id="customDescriptionError" className="text-sm text-red-700" role="alert">
                {descriptionError}
              </p>
            ) : (
              <p className="text-xs text-gray-500">Incluye lugar, producto o instrucciones importantes.</p>
            )}
            <p id="customDescriptionCount" className="shrink-0 text-xs text-gray-500">
              {description.length}/500
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="customPrice"
            className="mb-2 block text-sm font-bold text-gray-800"
          >
            Precio aproximado <span className="text-red-600">*</span>
          </label>

          <input
            id="customPrice"
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
            aria-describedby={priceError ? "customPriceError" : undefined}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
          <p className="mt-2 text-xs text-gray-500">Valor en dólares (USD).</p>
          {priceError && (
            <p id="customPriceError" className="mt-2 text-sm text-red-700" role="alert">
              {priceError}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="active-scale w-full rounded-xl bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
        >
          Agregar solicitud
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