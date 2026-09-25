import { useState } from "react";

interface TransportFormProps {
  onClose: () => void;
}

export default function TransportForm({
  onClose,
}: TransportFormProps) {
  const [origin, setOrigin] =
    useState("");

  const [destination, setDestination] =
    useState("");

  const [description, setDescription] =
    useState("");

  const handleRequest = () => {
    if (!origin.trim()) {
      alert(
        "Ingresa el punto de origen."
      );
      return;
    }

    if (!destination.trim()) {
      alert(
        "Ingresa el destino."
      );
      return;
    }

    const message =
      `🛵 *SOLICITUD DE TRANSPORTE - BRUNO DELIVERY*\n\n` +
      `📍 Origen: ${origin.trim()}\n` +
      `🏁 Destino: ${destination.trim()}\n` +
      `📦 Detalle: ${
        description.trim() ||
        "Sin detalles adicionales"
      }`;

    const url =
      `https://wa.me/593967584551?text=` +
      encodeURIComponent(message);

    window.open(
      url,
      "_blank"
    );
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-black text-gray-900">
          🛵 Transporte
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Solicita un servicio de transporte.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="origin"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Punto de origen
          </label>

          <input
            id="origin"
            type="text"
            value={origin}
            onChange={(e) =>
              setOrigin(e.target.value)
            }
            placeholder="Ej: Centro de Guayaquil"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-red-500 focus:bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="destination"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Destino
          </label>

          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) =>
              setDestination(
                e.target.value
              )
            }
            placeholder="Ej: Urdesa"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-red-500 focus:bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="transportDescription"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Detalles
          </label>

          <textarea
            id="transportDescription"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows={3}
            placeholder="Información adicional..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-red-500 focus:bg-white"
          />
        </div>

        <button
          type="button"
          onClick={handleRequest}
          className="w-full rounded-xl bg-red-500 px-4 py-3 font-black text-white hover:bg-red-600"
        >
          📲 Solicitar por WhatsApp
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