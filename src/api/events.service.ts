import { z, ZodError } from "zod";
import {
  EventSchema,
  CreateEventSchema,
  UpdateEventSchema,
  type Event,
  type CreateEventInput,
  type UpdateEventInput,
} from "../domain/event/event.schema";
import { http, type ApiError } from "./http";

const EventsListSchema = z.array(EventSchema);
const BASE_URL = "/api/events";

function toInvalidResponseError(): ApiError {
  return {
    status: 502,
    message: "Resposta inválida do servidor.",
  };
}

export const EventsService = {
  async list(): Promise<Event[]> {
    const data = await http(BASE_URL);
    try {
      return EventsListSchema.parse(data);
    } catch (err) {
      if (err instanceof ZodError) throw toInvalidResponseError();
      throw err;
    }
  },

  async create(input: CreateEventInput): Promise<Event> {
    const payload = CreateEventSchema.parse(input);

    const data = await http(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    try {
      return EventSchema.parse(data);
    } catch (err) {
      if (err instanceof ZodError) throw toInvalidResponseError();
      throw err;
    }
  },

  async update(id: number, input: UpdateEventInput): Promise<Event> {
    const payload = UpdateEventSchema.parse(input);

    const data = await http(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    try {
      return EventSchema.parse(data);
    } catch (err) {
      if (err instanceof ZodError) throw toInvalidResponseError();
      throw err;
    }
  },

  async remove(id: number): Promise<void> {
    await http(`${BASE_URL}/${id}`, { method: "DELETE" });
  },
};
