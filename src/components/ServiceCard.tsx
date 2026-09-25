interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

export default function ServiceCard({
  icon,
  title,
  description,
  onClick,
}: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="active-scale w-full rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-3xl">
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-bold text-gray-900">
            {title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}