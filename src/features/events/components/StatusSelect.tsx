import type { Event } from "../../../domain/event/event.schema";

interface StatusSelectProps {
  value: Event["status"];
  onChange: (status: Event["status"]) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const statusConfig = {
  STARTED: {
    label: "Em andamento",
    color: "text-green-700 bg-green-50 border-green-200",
  },
  PAUSED: {
    label: "Pausado",
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
  },
  COMPLETED: {
    label: "Concluído",
    color: "text-gray-700 bg-gray-50 border-gray-200",
  },
};

export function StatusSelect({
  value,
  onChange,
  disabled,
  ariaLabel,
}: StatusSelectProps) {
  const config = statusConfig[value];

  return (
    <select
      className={`
        rounded-md border px-3 py-1.5 text-xs font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400
        disabled:opacity-50 disabled:cursor-not-allowed
        ${config.color}
      `}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as Event["status"])}
      aria-label={ariaLabel || "Status do evento"}
    >
      <option value="STARTED">{statusConfig.STARTED.label}</option>
      <option value="PAUSED">{statusConfig.PAUSED.label}</option>
      <option value="COMPLETED">{statusConfig.COMPLETED.label}</option>
    </select>
  );
}
