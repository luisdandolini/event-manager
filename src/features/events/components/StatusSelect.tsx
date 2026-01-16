import { useTranslation } from "react-i18next";
import type { Event } from "../../../domain/event/event.schema";

interface StatusSelectProps {
  value: Event["status"];
  onChange: (status: Event["status"]) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const statusConfig: Record<Event["status"], { color: string }> = {
  STARTED: {
    color: "text-green-700 bg-green-50 border-green-200",
  },
  PAUSED: {
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
  },
  COMPLETED: {
    color: "text-gray-700 bg-gray-50 border-gray-200",
  },
};

export function StatusSelect({
  value,
  onChange,
  disabled,
  ariaLabel,
}: StatusSelectProps) {
  const { t } = useTranslation("common");
  const config = statusConfig[value];

  return (
    <select
      className={[
        "rounded-md border px-3 py-1.5 text-xs font-medium",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        config.color,
      ].join(" ")}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as Event["status"])}
      aria-label={ariaLabel ?? t("events.table.columns.status")}
    >
      <option value="STARTED">{t("events.status.STARTED")}</option>
      <option value="PAUSED">{t("events.status.PAUSED")}</option>
      <option value="COMPLETED">{t("events.status.COMPLETED")}</option>
    </select>
  );
}
