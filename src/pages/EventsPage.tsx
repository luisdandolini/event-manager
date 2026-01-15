import { useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
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
import { AlertTriangle, RotateCcw, Plus, Filter, Search } from "lucide-react";

export function EventsPage() {
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
            Carregando eventos
          </h2>
          <p className="text-gray-600">
            Aguarde enquanto carregamos seus eventos...
          </p>
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
              Erro ao carregar eventos
            </h2>
            <p className="text-sm text-red-700 mb-4">{error}</p>

            <Button
              variant="secondary"
              onClick={() => refetch()}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Tentar novamente
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
                Gerenciador de Eventos
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Crie, edite e organize seus eventos de forma simples
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={openCreate}
              disabled={busy}
              aria-label="Criar novo evento"
              className="cursor-pointer"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              Novo evento
            </Button>
          </div>
        </header>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-700">Filtros</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Status:
                </span>
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                  aria-label="Filtrar por status"
                >
                  <option value="ALL">Todos</option>
                  <option value="STARTED">Em andamento</option>
                  <option value="PAUSED">Pausados</option>
                  <option value="COMPLETED">Concluídos</option>
                </select>
              </label>

              <label className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Ordenar:
                </span>
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  aria-label="Ordenar eventos"
                >
                  <option value="START_DATE_ASC">Data (mais antigo)</option>
                  <option value="START_DATE_DESC">Data (mais recente)</option>
                  <option value="PRICE_ASC">Preço (menor)</option>
                  <option value="PRICE_DESC">Preço (maior)</option>
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
              Nenhum evento encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os filtros para encontrar o que procura
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
              Limpar filtros
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
