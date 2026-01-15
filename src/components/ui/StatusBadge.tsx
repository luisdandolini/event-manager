import type { Event } from "../../domain/event/event.schema";

interface StatusBadgeProps {
  status: Event["status"];
  size?: "sm" | "md";
}

const statusColors = {
  STARTED: "bg-green-100 text-green-800 border-green-200",
  PAUSED: "bg-yellow-100 text-yellow-800 border-yellow-200",
  COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClass = size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-block rounded-full border font-medium ${sizeClass} ${statusColors[status]}`}
    >
      {status}
    </span>
  );
}
