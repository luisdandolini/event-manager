import type { Event } from "../domain/event/event.schema";

export type SortBy =
  | "START_DATE_ASC"
  | "START_DATE_DESC"
  | "PRICE_ASC"
  | "PRICE_DESC";

export type StatusFilter = "ALL" | Event["status"];

function getStartTime(event: Event): number {
  return new Date(event.startDate).getTime();
}

export function sortEvents(events: Event[], sortBy: SortBy): Event[] {
  const sorted = [...events];

  switch (sortBy) {
    case "START_DATE_ASC":
      return sorted.sort(
        (left, right) => getStartTime(left) - getStartTime(right)
      );

    case "START_DATE_DESC":
      return sorted.sort(
        (left, right) => getStartTime(right) - getStartTime(left)
      );

    case "PRICE_ASC":
      return sorted.sort((left, right) => left.price - right.price);

    case "PRICE_DESC":
      return sorted.sort((left, right) => right.price - left.price);

    default:
      return sorted;
  }
}

export function filterEventsByStatus(
  events: Event[],
  status: StatusFilter
): Event[] {
  if (status === "ALL") return events;
  return events.filter((event) => event.status === status);
}
