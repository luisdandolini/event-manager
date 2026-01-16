import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Event } from "../../../domain/event/event.schema";
import { StatusSelect } from "./StatusSelect";
import { ConfirmDialog } from "./ConfirmDialog";
import { formatDate } from "../../../utils/dateUtils";
import { formatCurrency } from "../../../utils/formatters";
import { Button } from "../../../components/ui/Button";
import {
  CalendarDays,
  Clock,
  BadgeDollarSign,
  Pencil,
  Trash2,
} from "lucide-react";

interface EventListProps {
  events: Event[];
  onDelete: (id: number) => Promise<unknown>;
  onEdit: (event: Event) => void;
  onChangeStatus: (id: number, status: Event["status"]) => Promise<unknown>;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export function EventList({
  events,
  onDelete,
  onEdit,
  onChangeStatus,
  isDeleting,
  isUpdating,
}: EventListProps) {
  const { t } = useTranslation("common");
  const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);

  const handleDeleteClick = (event: Event) => setDeleteConfirm(event);

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    await onDelete(deleteConfirm.id);
    setDeleteConfirm(null);
  };

  if (events.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <CalendarDays
          className="mx-auto h-12 w-12 text-gray-400"
          aria-hidden="true"
        />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          {t("events.list.empty.title")}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {t("events.list.empty.subtitle")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:hidden" role="list">
        {events.map((event) => (
          <EventCardMobile
            key={event.id}
            event={event}
            onEdit={() => onEdit(event)}
            onDelete={() => handleDeleteClick(event)}
            onChangeStatus={(status) => onChangeStatus(event.id, status)}
            isDeleting={isDeleting}
            isUpdating={isUpdating}
          />
        ))}
      </div>

      <div className="hidden sm:block">
        <EventTableDesktop
          events={events}
          onEdit={onEdit}
          onDelete={handleDeleteClick}
          onChangeStatus={onChangeStatus}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
        />
      </div>

      <ConfirmDialog
        open={!!deleteConfirm}
        title={t("events.confirmDelete.title")}
        message={t("events.confirmDelete.message", {
          title: deleteConfirm?.title ?? "",
        })}
        confirmLabel={t("events.confirmDelete.confirm")}
        cancelLabel={t("actions.cancel")}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={isDeleting}
      />
    </>
  );
}

function EventCardMobile({
  event,
  onEdit,
  onDelete,
  onChangeStatus,
  isDeleting,
  isUpdating,
}: {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  onChangeStatus: (status: Event["status"]) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}) {
  const { t } = useTranslation("common");

  return (
    <article
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
      role="listitem"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900">
            {event.title}
          </h3>

          <div className="mt-1 space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              <time dateTime={event.startDate}>
                {formatDate(event.startDate)}
              </time>
            </div>

            <div className="flex items-center gap-1.5">
              <BadgeDollarSign
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span className="font-medium">{formatCurrency(event.price)}</span>
            </div>
          </div>
        </div>

        <StatusSelect
          value={event.status}
          onChange={onChangeStatus}
          disabled={isUpdating}
          ariaLabel={t("events.list.aria.statusForEvent", {
            title: event.title,
          })}
        />
      </div>

      <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onEdit}
          className="flex-1"
          aria-label={t("events.list.aria.editEvent", { title: event.title })}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          {t("actions.edit")}
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex-1"
          aria-label={t("events.list.aria.deleteEvent", { title: event.title })}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {t("actions.delete")}
        </Button>
      </div>
    </article>
  );
}

function EventTableDesktop({
  events,
  onEdit,
  onDelete,
  onChangeStatus,
  isDeleting,
  isUpdating,
}: {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onChangeStatus: (id: number, status: Event["status"]) => Promise<unknown>;
  isDeleting?: boolean;
  isUpdating?: boolean;
}) {
  const { t } = useTranslation("common");

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("events.table.columns.event")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("events.table.columns.start")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("events.table.columns.end")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("events.table.columns.price")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("events.table.columns.status")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("events.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {events.map((event) => (
              <tr
                key={event.id}
                className="transition-colors duration-150 hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-gray-900">{event.title}</div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <time
                    dateTime={event.startDate}
                    className="text-sm text-gray-600"
                  >
                    {formatDate(event.startDate)}
                  </time>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <time
                    dateTime={event.endDate}
                    className="text-sm text-gray-600"
                  >
                    {formatDate(event.endDate)}
                  </time>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(event.price)}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <StatusSelect
                    value={event.status}
                    onChange={(status) => onChangeStatus(event.id, status)}
                    disabled={isUpdating}
                    ariaLabel={t("events.list.aria.statusForEvent", {
                      title: event.title,
                    })}
                  />
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(event)}
                      aria-label={t("events.list.aria.editEvent", {
                        title: event.title,
                      })}
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      {t("actions.edit")}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(event)}
                      disabled={isDeleting}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      aria-label={t("events.list.aria.deleteEvent", {
                        title: event.title,
                      })}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      {t("actions.delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
