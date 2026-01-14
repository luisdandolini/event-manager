import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventsService } from "../api/events.service";
import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
} from "../domain/event/event.schema";
import type { ApiError } from "../api/http";

const EVENTS_QUERY_KEY = ["events"] as const;

export function useEvents() {
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: EventsService.list,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: EventsService.create,
    onMutate: async (newEvent: CreateEventInput) => {
      await queryClient.cancelQueries({ queryKey: EVENTS_QUERY_KEY });

      const previousEvents =
        queryClient.getQueryData<Event[]>(EVENTS_QUERY_KEY);
      const tempId = Date.now();

      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) => [
        ...old,
        { id: tempId, ...newEvent } as Event,
      ]);

      return { previousEvents, tempId };
    },
    onError: (_err, _newEvent, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(EVENTS_QUERY_KEY, context.previousEvents);
      }
    },
    onSuccess: (created, _newEvent, context) => {
      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) =>
        old.map((e) => (e.id === context?.tempId ? created : e))
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEventInput }) =>
      EventsService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: EVENTS_QUERY_KEY });

      const previousEvents =
        queryClient.getQueryData<Event[]>(EVENTS_QUERY_KEY);

      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) =>
        old.map((event) => (event.id === id ? { ...event, ...data } : event))
      );

      return { previousEvents };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(EVENTS_QUERY_KEY, context.previousEvents);
      }
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) =>
        old.map((e) => (e.id === updated.id ? updated : e))
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: EventsService.remove,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: EVENTS_QUERY_KEY });

      const previousEvents =
        queryClient.getQueryData<Event[]>(EVENTS_QUERY_KEY);

      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) =>
        old.filter((event) => event.id !== id)
      );

      return { previousEvents };
    },
    onError: (_err, _id, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(EVENTS_QUERY_KEY, context.previousEvents);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
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

    createEvent: createMutation.mutateAsync,
    updateEvent: (id: number, data: UpdateEventInput) =>
      updateMutation.mutateAsync({ id, data }),
    deleteEvent: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
