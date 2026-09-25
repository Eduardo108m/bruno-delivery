import { useState } from "react";

export interface LocationData {
  lat: number | null;
  lng: number | null;
  reference: string;
}

interface LocationPickerProps {
  value: LocationData;
  onChange: (location: LocationData) => void;
}

export default function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const detectLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError(
        "Tu navegador no soporta la función de geolocalización."
      );
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          reference: value.reference,
        });

        setLoading(false);
      },
      (error) => {
        setLoading(false);

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setError(
            "Permiso de ubicación rechazado. Activa el GPS y permite la ubicación para este sitio."
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          setError(
            "No fue posible determinar tu ubicación."
          );
        } else if (
          error.code === error.TIMEOUT
        ) {
          setError(
            "La detección de ubicación tardó demasiado. Inténtalo nuevamente."
          );
        } else {
          setError(
            "Ocurrió un error al obtener tu ubicación."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleReferenceChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange({
      ...value,
      reference: event.target.value,
    });
  };

  const openGoogleMaps = () => {
    if (
      value.lat === null ||
      value.lng === null
    ) {
      return;
    }

    const url =
      `https://www.google.com/maps/search/?api=1&query=` +
      `${value.lat},${value.lng}`;

    window.open(url, "_blank");
  };

  return (
    <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900">
          📍 Ubicación de entrega
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Usa tu GPS para que el repartidor pueda encontrar tu ubicación.
        </p>
      </div>

      <button
        type="button"
        onClick={detectLocation}
        disabled={loading}
        className="active-scale w-full rounded-xl bg-red-500 px-4 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
      >
        {loading
          ? "📡 Detectando ubicación..."
          : "📍 Usar mi ubicación actual"}
      </button>

      {value.lat !== null &&
        value.lng !== null && (
          <div className="mt-3 rounded-xl bg-green-50 p-3">
            <div className="flex items-start gap-2">
              <span className="text-lg">
                ✅
              </span>

              <div className="flex-1">
                <p className="font-semibold text-green-700">
                  Ubicación obtenida
                </p>

                <p className="mt-1 text-xs text-green-600">
                  Latitud:{" "}
                  {value.lat.toFixed(6)}
                </p>

                <p className="text-xs text-green-600">
                  Longitud:{" "}
                  {value.lng.toFixed(6)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openGoogleMaps}
              className="mt-3 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-semibold text-green-700"
            >
              🗺️ Ver ubicación en Google Maps
            </button>
          </div>
        )}

      {error && (
        <div className="mt-3 rounded-xl bg-red-50 p-3">
          <p className="text-sm leading-5 text-red-600">
            ⚠️ {error}
          </p>
        </div>
      )}

      <div className="mt-4">
        <label
          htmlFor="reference"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Referencia adicional
        </label>

        <textarea
          id="reference"
          value={value.reference}
          onChange={
            handleReferenceChange
          }
          rows={3}
          placeholder="Ej: Casa de dos pisos color celeste junto a la tienda..."
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none transition focus:border-red-500 focus:bg-white"
        />
      </div>
    </div>
  );
}