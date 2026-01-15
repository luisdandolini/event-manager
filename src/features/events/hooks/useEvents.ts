import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
} from "../../../domain/event/event.schema";
import type { ApiError } from "../../../api/http";
import { EventsService } from "../../../api/events.service";

const eventsQueryKey = ["events"] as const;

type OptimisticCreateRollback = {
  previousList?: Event[];
  optimisticId: number;
};

type OptimisticListRollback = {
  previousList?: Event[];
};

export function useEvents() {
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: eventsQueryKey,
    queryFn: EventsService.list,
    staleTime: 1000 * 60 * 5,
  });

  const createEventMutation = useMutation<
    Event,
    unknown,
    CreateEventInput,
    OptimisticCreateRollback
  >({
    mutationFn: EventsService.create,
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: eventsQueryKey });

      const previousList = queryClient.getQueryData<Event[]>(eventsQueryKey);
      const optimisticId = Date.now();

      queryClient.setQueryData<Event[]>(eventsQueryKey, (current = []) => [
        ...current,
        { id: optimisticId, ...newEvent } as Event,
      ]);

      return { previousList, optimisticId };
    },
    onError: (err, _newEvent, rollback) => {
      if (rollback?.previousList) {
        queryClient.setQueryData(eventsQueryKey, rollback.previousList);
      }

      const message =
        (err as ApiError | null)?.message ??
        (err instanceof Error
          ? err.message
          : "Não foi possível criar o evento.");

      toast.error(message);
    },
    onSuccess: (createdEvent, _newEvent, rollback) => {
      queryClient.setQueryData<Event[]>(eventsQueryKey, (current = []) =>
        current.map((e) => (e.id === rollback?.optimisticId ? createdEvent : e))
      );

      toast.success("Evento criado com sucesso!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventsQueryKey });
    },
  });

  const updateEventMutation = useMutation<
    Event,
    unknown,
    { id: number; data: UpdateEventInput },
    OptimisticListRollback
  >({
    mutationFn: ({ id, data }) => EventsService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: eventsQueryKey });

      const previousList = queryClient.getQueryData<Event[]>(eventsQueryKey);

      queryClient.setQueryData<Event[]>(eventsQueryKey, (current = []) =>
        current.map((event) =>
          event.id === id ? { ...event, ...data } : event
        )
      );

      return { previousList };
    },
    onError: (err, _vars, rollback) => {
      if (rollback?.previousList) {
        queryClient.setQueryData(eventsQueryKey, rollback.previousList);
      }

      const message =
        (err as ApiError | null)?.message ??
        (err instanceof Error
          ? err.message
          : "Não foi possível atualizar o evento.");

      toast.error(message);
    },
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData<Event[]>(eventsQueryKey, (current = []) =>
        current.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
      );

      toast.success("Evento atualizado!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventsQueryKey });
    },
  });

  const deleteEventMutation = useMutation<
    unknown,
    unknown,
    number,
    OptimisticListRollback
  >({
    mutationFn: EventsService.remove,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: eventsQueryKey });

      const previousList = queryClient.getQueryData<Event[]>(eventsQueryKey);

      queryClient.setQueryData<Event[]>(eventsQueryKey, (current = []) =>
        current.filter((event) => event.id !== id)
      );

      return { previousList };
    },
    onError: (err, _id, rollback) => {
      if (rollback?.previousList) {
        queryClient.setQueryData(eventsQueryKey, rollback.previousList);
      }

      const message =
        (err as ApiError | null)?.message ??
        (err instanceof Error
          ? err.message
          : "Não foi possível excluir o evento.");

      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Evento excluído!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventsQueryKey });
    },
  });

  const errorMessage =
    (error as ApiError | null)?.message ??
    (error instanceof Error ? error.message : null);

  return {
    events,
    isLoading,
    error: errorMessage,
    refetch,

    createEvent: createEventMutation.mutateAsync,
    updateEvent: (id: number, data: UpdateEventInput) =>
      updateEventMutation.mutateAsync({ id, data }),
    deleteEvent: deleteEventMutation.mutateAsync,

    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
  };
}
