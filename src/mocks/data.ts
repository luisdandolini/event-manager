import type { Event } from "../domain/event/event.schema";

export let mockEvents: Event[] = [
  {
    id: 1,
    title: "React Conference 2026",
    startDate: "2026-03-15T09:00:00Z",
    endDate: "2026-03-17T18:00:00Z",
    price: 299.99,
    status: "STARTED",
  },
  {
    id: 2,
    title: "TypeScript Workshop",
    startDate: "2026-02-10T14:00:00Z",
    endDate: "2026-02-10T17:00:00Z",
    price: 0,
    status: "PAUSED",
  },
  {
    id: 3,
    title: "DevOps Summit 2026",
    startDate: "2026-04-20T08:00:00Z",
    endDate: "2026-04-22T20:00:00Z",
    price: 499.0,
    status: "COMPLETED",
  },
];

export const resetMockData = () => {
  mockEvents = [
    {
      id: 1,
      title: "React Conference 2026",
      startDate: "2026-03-15T09:00:00Z",
      endDate: "2026-03-17T18:00:00Z",
      price: 299.99,
      status: "STARTED",
    },
    {
      id: 2,
      title: "TypeScript Workshop",
      startDate: "2026-02-10T14:00:00Z",
      endDate: "2026-02-10T17:00:00Z",
      price: 0,
      status: "PAUSED",
    },
    {
      id: 3,
      title: "DevOps Summit 2026",
      startDate: "2026-04-20T08:00:00Z",
      endDate: "2026-04-22T20:00:00Z",
      price: 499.0,
      status: "COMPLETED",
    },
  ];
};
