import { http, HttpResponse, delay } from "msw";
import { mockEvents } from "./data";
import {
  CreateEventSchema,
  UpdateEventSchema,
} from "../domain/event/event.schema";

const BASE_URL = "/api/events";

export const handlers = [
  http.get(BASE_URL, async () => {
    await delay(500);

    if (Math.random() < 0.05) {
      return HttpResponse.json(
        { message: "Network error occurred" },
        { status: 500 }
      );
    }

    return HttpResponse.json(mockEvents);
  }),

  http.get(`${BASE_URL}/:id`, async ({ params }) => {
    await delay(300);

    const id = Number(params.id);
    const event = mockEvents.find((e) => e.id === id);

    if (!event) {
      return HttpResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return HttpResponse.json(event);
  }),

  http.post(BASE_URL, async ({ request }) => {
    await delay(600);

    const body = await request.json();

    const validation = CreateEventSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return HttpResponse.json(
        {
          message: firstError.message,
          field: firstError.path.join("."),
        },
        { status: 400 }
      );
    }

    const newEvent = {
      id: Math.max(...mockEvents.map((e) => e.id), 0) + 1,
      ...validation.data,
    };

    mockEvents.push(newEvent);

    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.patch(`${BASE_URL}/:id`, async ({ params, request }) => {
    await delay(500);

    const id = Number(params.id);
    const body = await request.json();

    const eventIndex = mockEvents.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
      return HttpResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const validation = UpdateEventSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return HttpResponse.json(
        {
          message: firstError.message,
          field: firstError.path.join("."),
        },
        { status: 400 }
      );
    }

    const updatedEvent = {
      ...mockEvents[eventIndex],
      ...validation.data,
    };

    if (new Date(updatedEvent.endDate) <= new Date(updatedEvent.startDate)) {
      return HttpResponse.json(
        { message: "endDate deve ser posterior à startDate" },
        { status: 400 }
      );
    }

    mockEvents[eventIndex] = updatedEvent;

    return HttpResponse.json(updatedEvent);
  }),

  http.delete(`${BASE_URL}/:id`, async ({ params }) => {
    await delay(400);

    const id = Number(params.id);
    const eventIndex = mockEvents.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
      return HttpResponse.json({ message: "Event not found" }, { status: 404 });
    }

    mockEvents.splice(eventIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
