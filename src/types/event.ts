export const EVENT_CATEGORIES = [
  "Technology",
  "Music",
  "Sports",
  "Education",
  "Workshops",
  "Cultural Events",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
export type EventStatus = "Upcoming" | "Completed" | "Cancelled";

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  venue: string;
  event_date: string;
  start_time: string;
  end_time: string;
  image_url: string;
  capacity?: number | null;
  status: EventStatus;
  created_at: string;
}

export type EventInput = Omit<Event, "id" | "created_at">;