import { mockEvents } from "@/data/mockEvents";
import type { Event, EventInput } from "@/types/event";
import {
  apiMode,
  apiRequest,
  getStoredMock,
  saveStoredMock,
} from "@/services/api";

const EVENTS_KEY = "eventease_mock_events";
const mockList = () => getStoredMock(EVENTS_KEY, mockEvents);

export const eventService = {
  listPublic: async () => {
    if (apiMode) return apiRequest<Event[]>("/events");
    return mockList().filter((event) => event.status === "Upcoming");
  },

  getById: async (id: string) => {
    if (apiMode) return apiRequest<Event>(`/events/${encodeURIComponent(id)}`);
    return mockList().find((event) => event.id === id) ?? null;
  },

  listAdmin: async (): Promise<Event[]> => {
    if (apiMode) {
      const response = await apiRequest<
        Event[] | { events?: Event[] }
      >("/admin/events");

      if (Array.isArray(response)) return response;
      if (Array.isArray(response.events)) return response.events;

      throw new Error("Invalid events response from server.");
    }

    return [...mockList()].sort((a, b) =>
      a.event_date.localeCompare(b.event_date)
    );
  },

  create: async (input: EventInput) => {
    if (apiMode) {
      return apiRequest<Event>("/admin/events", {
        method: "POST",
        body: JSON.stringify(input),
      });
    }

    const events = mockList();
    const event: Event = {
      ...input,
      id: `evt-${crypto.randomUUID()}`,
      created_at: new Date().toISOString(),
    };

    saveStoredMock(EVENTS_KEY, [event, ...events]);
    return event;
  },

  update: async (id: string, input: EventInput) => {
    if (apiMode) {
      return apiRequest<Event>(`/admin/events/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(input),
      });
    }

    const events = mockList();
    const current = events.find((event) => event.id === id);

    if (!current) throw new Error("That event could not be found.");

    const updated = { ...current, ...input };

    saveStoredMock(
      EVENTS_KEY,
      events.map((event) => event.id === id ? updated : event)
    );

    return updated;
  },

  remove: async (id: string) => {
    if (apiMode) {
      return apiRequest<void>(`/admin/events/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    }

    saveStoredMock(
      EVENTS_KEY,
      mockList().filter((event) => event.id !== id)
    );
  },
};
