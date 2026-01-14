import { z } from "zod";

export const EventStatusSchema = z.enum(["STARTED", "PAUSED", "COMPLETED"]);

export const EventBaseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, "Título é obrigatório"),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  price: z.number().min(0, "Preço deve ser ≥ 0"),
  status: EventStatusSchema,
});

const endAfterStart = (e: { startDate: string; endDate: string }) =>
  new Date(e.endDate) > new Date(e.startDate);

export const EventSchema = EventBaseSchema.refine(endAfterStart, {
  message: "endDate deve ser posterior à startDate",
  path: ["endDate"],
});

export const CreateEventBaseSchema = EventBaseSchema.omit({ id: true });
export const CreateEventSchema = CreateEventBaseSchema.refine(endAfterStart, {
  message: "endDate deve ser posterior à startDate",
  path: ["endDate"],
});

export const UpdateEventSchema = CreateEventBaseSchema.partial();

export type Event = z.infer<typeof EventSchema>;
export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
