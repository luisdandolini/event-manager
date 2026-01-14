import { z } from "zod";
import {
  EventSchema,
  CreateEventSchema,
  UpdateEventSchema,
  type Event,
  type CreateEventInput,
  type UpdateEventInput,
} from "../domain/event/event.schema";
import { http } from "./http";

const EventsListSchema = z.array(EventSchema);

const BASE_URL = "/api/events";

export const EventsService = {
  async list(): Promise<Event[]> {
    const data = await http<unknown>(BASE_URL);
    return EventsListSchema.parse(data);
  },

  async create(input: CreateEventInput): Promise<Event> {
    const payload = CreateEventSchema.parse(input);

    const data = await http<unknown>(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return EventSchema.parse(data);
  },

  async update(id: number, input: UpdateEventInput): Promise<Event> {
    const payload = UpdateEventSchema.parse(input);

    const data = await http<unknown>(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return EventSchema.parse(data);
  },

  async remove(id: number): Promise<void> {
    await http<void>(`${BASE_URL}/${id}`, { method: "DELETE" });
  },
};
