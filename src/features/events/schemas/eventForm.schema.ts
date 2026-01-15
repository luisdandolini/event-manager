import { z } from "zod";

export const PriceSchema = z
  .union([z.string(), z.number()])
  .transform((value, context) => {
    const rawText = typeof value === "number" ? String(value) : value;
    const normalizedText = rawText.replace(",", ".").trim();
    const parsedNumber = Number(normalizedText);

    if (!Number.isFinite(parsedNumber)) {
      context.addIssue({ code: "custom", message: "Preço inválido" });
      return z.NEVER;
    }

    return parsedNumber;
  })
  .pipe(z.number().min(0, "Preço deve ser ≥ 0"));

export const EventFormSchema = z
  .object({
    title: z.string().min(1, "Título é obrigatório"),
    startDateLocal: z.string().min(1, "Data de início é obrigatória"),
    endDateLocal: z.string().min(1, "Data de fim é obrigatória"),
    price: PriceSchema,
    status: z.enum(["STARTED", "PAUSED", "COMPLETED"]),
  })
  .superRefine((formData, context) => {
    const startTimestampMs = new Date(formData.startDateLocal).getTime();
    const endTimestampMs = new Date(formData.endDateLocal).getTime();

    if (Number.isNaN(startTimestampMs)) {
      context.addIssue({
        code: "custom",
        message: "Data de início inválida",
        path: ["startDateLocal"],
      });
      return;
    }

    if (Number.isNaN(endTimestampMs)) {
      context.addIssue({
        code: "custom",
        message: "Data de fim inválida",
        path: ["endDateLocal"],
      });
      return;
    }

    if (endTimestampMs <= startTimestampMs) {
      context.addIssue({
        code: "custom",
        message: "Data de fim deve ser posterior à data de início",
        path: ["endDateLocal"],
      });
    }
  });

export type EventFormInput = z.input<typeof EventFormSchema>;
export type EventFormOutput = z.output<typeof EventFormSchema>;
