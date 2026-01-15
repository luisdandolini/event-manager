import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  toLocalInputValue,
  toIsoFromLocalInput,
} from "../../../utils/dateUtils";
import type {
  CreateEventInput,
  UpdateEventInput,
  Event,
} from "../../../domain/event/event.schema";
import { Modal } from "../../../components/ui/Modal";
import { FormField } from "../../../components/ui/FormField";
import { Button } from "../../../components/ui/Button";
import {
  EventFormSchema,
  type EventFormInput,
  type EventFormOutput,
} from "../schemas/eventForm.schema";

type Props =
  | {
      open: boolean;
      mode: "create";
      initial?: never;
      onClose: () => void;
      onSubmit: (data: CreateEventInput) => Promise<unknown>;
      isSubmitting?: boolean;
    }
  | {
      open: boolean;
      mode: "edit";
      initial: Event;
      onClose: () => void;
      onSubmit: (data: UpdateEventInput) => Promise<unknown>;
      isSubmitting?: boolean;
    };

function buildDefaultValues(): EventFormInput {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  return {
    title: "",
    startDateLocal: toLocalInputValue(now.toISOString()),
    endDateLocal: toLocalInputValue(oneHourLater.toISOString()),
    price: 0,
    status: "STARTED",
  };
}

export function EventFormModal(props: Props) {
  const { open, mode, isSubmitting, onClose } = props;

  const [initialDefaults] = useState<EventFormInput>(() =>
    buildDefaultValues()
  );

  const form = useForm<EventFormInput, unknown, EventFormOutput>({
    resolver: zodResolver(EventFormSchema),
    mode: "onSubmit",
    defaultValues: initialDefaults,
  });

  const disabled = !!isSubmitting;
  const modalTitle = mode === "create" ? "Novo evento" : "Editar evento";

  const initialTitle = mode === "edit" ? props.initial.title : "";
  const initialStartDate = mode === "edit" ? props.initial.startDate : "";
  const initialEndDate = mode === "edit" ? props.initial.endDate : "";
  const initialPrice = mode === "edit" ? props.initial.price : 0;
  const initialStatus = mode === "edit" ? props.initial.status : "STARTED";

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      form.reset(buildDefaultValues());
    } else {
      form.reset({
        title: initialTitle,
        startDateLocal: toLocalInputValue(initialStartDate),
        endDateLocal: toLocalInputValue(initialEndDate),
        price: initialPrice,
        status: initialStatus,
      });
    }

    queueMicrotask(() => form.setFocus("title"));
  }, [
    open,
    mode,
    initialTitle,
    initialStartDate,
    initialEndDate,
    initialPrice,
    initialStatus,
    form,
  ]);

  const handleClose = () => {
    form.clearErrors("root");
    onClose();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    form.clearErrors("root");

    const payload = {
      title: values.title,
      startDate: toIsoFromLocalInput(values.startDateLocal),
      endDate: toIsoFromLocalInput(values.endDateLocal),
      price: values.price,
      status: values.status,
    };

    try {
      if (mode === "create") {
        await props.onSubmit(payload as CreateEventInput);
      } else {
        await props.onSubmit(payload as UpdateEventInput);
      }
      handleClose();
    } catch (err) {
      form.setError("root", {
        type: "server",
        message: err instanceof Error ? err.message : "Erro ao salvar.",
      });
    }
  });

  const rootError = form.formState.errors.root?.message;

  return (
    <Modal
      open={open}
      title={modalTitle}
      description="Preencha todos os campos obrigatórios. A data de fim deve ser posterior à data de início."
      onClose={handleClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {rootError && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            role="alert"
            aria-live="polite"
          >
            {rootError}
          </div>
        )}

        <FormField
          name="title"
          label="Título do evento"
          required
          hint="Ex: React Conference 2026"
          error={form.formState.errors.title?.message}
        >
          {(a11y) => (
            <input
              {...a11y}
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed"
              disabled={disabled}
              {...form.register("title")}
            />
          )}
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            name="startDateLocal"
            label="Data e hora de início"
            required
            error={form.formState.errors.startDateLocal?.message}
          >
            {(a11y) => (
              <input
                {...a11y}
                type="datetime-local"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={disabled}
                {...form.register("startDateLocal")}
              />
            )}
          </FormField>

          <FormField
            name="endDateLocal"
            label="Data e hora de fim"
            required
            error={form.formState.errors.endDateLocal?.message}
          >
            {(a11y) => (
              <input
                {...a11y}
                type="datetime-local"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={disabled}
                {...form.register("endDateLocal")}
              />
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            name="price"
            label="Preço (R$)"
            required
            hint="Valor mínimo: R$ 0,00"
            error={form.formState.errors.price?.message}
          >
            {(a11y) => (
              <input
                {...a11y}
                type="text"
                inputMode="decimal"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="0,00"
                disabled={disabled}
                {...form.register("price")}
              />
            )}
          </FormField>

          <FormField name="status" label="Status" required>
            {(a11y) => (
              <select
                {...a11y}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={disabled}
                {...form.register("status")}
              >
                <option value="STARTED">Em andamento</option>
                <option value="PAUSED">Pausado</option>
                <option value="COMPLETED">Concluído</option>
              </select>
            )}
          </FormField>
        </div>

        <div className="flex items-center justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={disabled}
            className="cursor-pointer"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={disabled}
            className="cursor-pointer"
          >
            {mode === "create" ? "Criar evento" : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
