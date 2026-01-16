import { z } from "zod";
import type { TFunction } from "i18next";

export const PriceSchema = (t: TFunction) =>
  z
    .union([z.string(), z.number()])
    .transform((value, context) => {
      const raw = typeof value === "number" ? String(value) : value;
      const normalized = raw.replace(",", ".").trim();
      const parsedNumber = Number(normalized);

      if (!Number.isFinite(parsedNumber)) {
        context.addIssue({
          code: "custom",
          message: t("validation.event.priceInvalid"),
        });
        return z.NEVER;
      }

      return parsedNumber;
    })
    .pipe(z.number().min(0, t("validation.event.priceMin")));

export const createEventFormSchema = (t: TFunction) =>
  z
    .object({
      title: z.string().min(1, t("validation.event.titleRequired")),
      startDateLocal: z.string().min(1, t("validation.event.startRequired")),
      endDateLocal: z.string().min(1, t("validation.event.endRequired")),
      price: PriceSchema(t),
      status: z.enum(["STARTED", "PAUSED", "COMPLETED"]),
    })
    .superRefine((value, context) => {
      const start = new Date(value.startDateLocal).getTime();
      const end = new Date(value.endDateLocal).getTime();

      if (Number.isNaN(start)) {
        context.addIssue({
          code: "custom",
          message: t("validation.event.startInvalid"),
          path: ["startDateLocal"],
        });
        return;
      }

      if (Number.isNaN(end)) {
        context.addIssue({
          code: "custom",
          message: t("validation.event.endInvalid"),
          path: ["endDateLocal"],
        });
        return;
      }

      if (end <= start) {
        context.addIssue({
          code: "custom",
          message: t("validation.event.endAfterStart"),
          path: ["endDateLocal"],
        });
      }
    });

export type EventFormInput = z.input<ReturnType<typeof createEventFormSchema>>;
export type EventFormOutput = z.output<
  ReturnType<typeof createEventFormSchema>
>;
