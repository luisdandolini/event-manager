import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
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
  createEventFormSchema,
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

function hasMessage(err: unknown): err is { message: unknown } {
  return typeof err === "object" && err !== null && "message" in err;
}

export function EventFormModal(props: Props) {
  const { open, mode, isSubmitting, onClose } = props;
  const { t } = useTranslation("common");
  const schema = useMemo(() => createEventFormSchema(t), [t]);

  const [initialDefaults] = useState<EventFormInput>(() =>
    buildDefaultValues()
  );

  const form = useForm<EventFormInput, unknown, EventFormOutput>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: initialDefaults,
  });

  const disabled = !!isSubmitting;

  const modalTitle =
    mode === "create"
      ? t("eventForm.modal.createTitle")
      : t("eventForm.modal.editTitle");

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
    } catch (err: unknown) {
      const message = hasMessage(err)
        ? String(err.message)
        : t("eventForm.serverError");

      form.setError("root", { type: "server", message });
    }
  });

  const rootError = form.formState.errors.root?.message;

  return (
    <Modal
      open={open}
      title={modalTitle}
      description={t("eventForm.modal.description")}
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
          label={t("eventForm.fields.title.label")}
          required
          hint={t("eventForm.fields.title.hint")}
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
            label={t("eventForm.fields.startDate.label")}
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
            label={t("eventForm.fields.endDate.label")}
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
            label={t("eventForm.fields.price.label")}
            required
            hint={t("eventForm.fields.price.hint")}
            error={form.formState.errors.price?.message}
          >
            {(a11y) => (
              <input
                {...a11y}
                type="text"
                inputMode="decimal"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder={t("eventForm.fields.price.placeholder")}
                disabled={disabled}
                {...form.register("price")}
              />
            )}
          </FormField>

          <FormField
            name="status"
            label={t("eventForm.fields.status.label")}
            required
          >
            {(a11y) => (
              <select
                {...a11y}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={disabled}
                {...form.register("status")}
              >
                <option value="STARTED">{t("events.status.STARTED")}</option>
                <option value="PAUSED">{t("events.status.PAUSED")}</option>
                <option value="COMPLETED">
                  {t("events.status.COMPLETED")}
                </option>
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
            {t("actions.cancel")}
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={disabled}
            className="cursor-pointer"
          >
            {mode === "create"
              ? t("eventForm.actions.create")
              : t("eventForm.actions.save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
