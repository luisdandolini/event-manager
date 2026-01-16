import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, RotateCcw, Plus, Filter, Search } from "lucide-react";
import { Button } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { LanguageSwitch } from "../components/i18n/LanguageSwitch";
import {
  sortEvents,
  filterEventsByStatus,
  type SortBy,
  type StatusFilter,
} from "../utils/eventUtils";
import type { Event } from "../domain/event/event.schema";
import { useEvents } from "../features/events/hooks/useEvents";
import { EventList } from "../features/events/components/EventList";
import { EventFormModal } from "../features/events/components/EventFormModal";

export function EventsPage() {
  const { t } = useTranslation("common");
  const {
    events,
    isLoading,
    error,
    refetch,
    createEvent,
    updateEvent,
    deleteEvent,
    isCreating,
    isUpdating,
    isDeleting,
  } = useEvents();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortBy>("START_DATE_ASC");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const filteredEvents = useMemo(() => {
    const byStatus = filterEventsByStatus(events, statusFilter);
    return sortEvents(byStatus, sortBy);
  }, [events, statusFilter, sortBy]);

  const openCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4 text-gray-900" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("events.loading.title")}
          </h2>
          <p className="text-gray-600">{t("events.loading.subtitle")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <AlertTriangle
              className="mx-auto h-12 w-12 text-red-600 mb-4"
              aria-hidden="true"
            />
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              {t("events.error.title")}
            </h2>

            <p className="text-sm text-red-700 mb-4">{error}</p>

            <Button
              variant="secondary"
              onClick={() => refetch()}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              {t("actions.retry")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const busy = isCreating || isUpdating || isDeleting;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t("events.header.title")}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {t("events.header.subtitle")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitch />

              <Button
                variant="primary"
                size="lg"
                onClick={openCreate}
                disabled={busy}
                aria-label={t("events.actions.createAria")}
                className="cursor-pointer"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
                {t("events.actions.create")}
              </Button>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-700">
                {t("events.filters.title")}
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {t("events.filters.statusLabel")}
                </span>
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                  aria-label={t("events.filters.statusAria")}
                >
                  <option value="ALL">{t("events.filters.status.all")}</option>
                  <option value="STARTED">{t("events.status.STARTED")}</option>
                  <option value="PAUSED">{t("events.status.PAUSED")}</option>
                  <option value="COMPLETED">
                    {t("events.status.COMPLETED")}
                  </option>
                </select>
              </label>

              <label className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {t("events.filters.sortLabel")}
                </span>
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  aria-label={t("events.filters.sortAria")}
                >
                  <option value="START_DATE_ASC">
                    {t("events.sort.START_DATE_ASC")}
                  </option>
                  <option value="START_DATE_DESC">
                    {t("events.sort.START_DATE_DESC")}
                  </option>
                  <option value="PRICE_ASC">
                    {t("events.sort.PRICE_ASC")}
                  </option>
                  <option value="PRICE_DESC">
                    {t("events.sort.PRICE_DESC")}
                  </option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <EventList
          events={filteredEvents}
          onDelete={deleteEvent}
          onEdit={openEdit}
          onChangeStatus={(id, status) => updateEvent(id, { status })}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
        />

        {filteredEvents.length === 0 && events.length > 0 && (
          <div className="mt-6 text-center py-12">
            <Search
              className="mx-auto h-12 w-12 text-gray-400"
              aria-hidden="true"
            />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              {t("events.emptyFiltered.title")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t("events.emptyFiltered.subtitle")}
            </p>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setStatusFilter("ALL");
                setSortBy("START_DATE_ASC");
              }}
              className="mt-4"
            >
              {t("actions.clearFilters")}
            </Button>
          </div>
        )}
      </div>

      {editingEvent ? (
        <EventFormModal
          open={isModalOpen}
          mode="edit"
          initial={editingEvent}
          onClose={closeModal}
          onSubmit={(data) => updateEvent(editingEvent.id, data)}
          isSubmitting={isUpdating}
        />
      ) : (
        <EventFormModal
          open={isModalOpen}
          mode="create"
          onClose={closeModal}
          onSubmit={createEvent}
          isSubmitting={isCreating}
        />
      )}
    </div>
  );
}
