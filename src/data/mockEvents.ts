import techImage from "@/assets/event-tech.jpg";
import musicImage from "@/assets/event-music.jpg";
import runImage from "@/assets/event-run.jpg";
import workshopImage from "@/assets/event-workshop.jpg";
import type { Event } from "@/types/event";
import type { Registration } from "@/types/registration";

export const mockEvents: Event[] = [
  {
    id: "evt-001",
    title: "The Future of Work Summit",
    description:
      "A day of big ideas, practical conversations and fresh perspectives on how technology is reshaping the way we work. Hear from thoughtful founders, researchers and creative leaders, then meet the people building what comes next.",
    category: "Technology",
    venue: "The Glasshouse, Brooklyn",
    event_date: "2026-12-12",
    start_time: "09:30",
    end_time: "17:00",
    image_url: techImage,
    capacity: 280,
    status: "Upcoming",
    created_at: "2026-10-14T10:00:00.000Z",
  },
  {
    id: "evt-002",
    title: "Afterglow Sessions",
    description:
      "An open-air evening of live music, good company and the last light of the day. Discover independent artists in an intimate park setting with food from neighborhood favorites.",
    category: "Music",
    venue: "Pier 6, Brooklyn Bridge Park",
    event_date: "2026-12-19",
    start_time: "16:00",
    end_time: "21:30",
    image_url: musicImage,
    capacity: 600,
    status: "Upcoming",
    created_at: "2026-10-20T11:30:00.000Z",
  },
  {
    id: "evt-003",
    title: "Cityside 10K & Community Run",
    description:
      "Start your morning with a welcoming waterfront run for every pace. Meet local running clubs, enjoy a lively route through the city and stay after for coffee and a little celebration.",
    category: "Sports",
    venue: "Brooklyn Bridge Park, Pier 2",
    event_date: "2027-01-10",
    start_time: "08:00",
    end_time: "11:30",
    image_url: runImage,
    capacity: 450,
    status: "Upcoming",
    created_at: "2026-10-22T09:00:00.000Z",
  },
  {
    id: "evt-004",
    title: "Make Space: Creative Workshop",
    description:
      "A hands-on afternoon for curious minds. Experiment with new materials, share ideas around the table and leave with a small piece of work and a fresh point of view.",
    category: "Workshops",
    venue: "Northlight Studio, Williamsburg",
    event_date: "2027-01-17",
    start_time: "13:00",
    end_time: "16:30",
    image_url: workshopImage,
    capacity: 36,
    status: "Upcoming",
    created_at: "2026-10-28T14:00:00.000Z",
  },
  {
    id: "evt-005",
    title: "Ideas in Practice: Learning Forum",
    description:
      "Educators, makers and community organizers come together for a generous exchange of tools and ideas that make learning more relevant, inclusive and joyful.",
    category: "Education",
    venue: "The New School, University Center",
    event_date: "2027-01-24",
    start_time: "10:00",
    end_time: "15:00",
    image_url: techImage,
    capacity: 180,
    status: "Upcoming",
    created_at: "2026-10-30T12:15:00.000Z",
  },
  {
    id: "evt-006",
    title: "Winter Lights & Local Stories",
    description:
      "A neighborhood celebration of light, music and the stories that bring us together. Wander the installation, catch a short performance and find a new favorite local maker.",
    category: "Cultural Events",
    venue: "Domino Park, Williamsburg",
    event_date: "2027-02-06",
    start_time: "17:30",
    end_time: "21:00",
    image_url: musicImage,
    capacity: null,
    status: "Upcoming",
    created_at: "2026-11-01T08:30:00.000Z",
  },
];

export const mockRegistrations: Registration[] = [
  {
    id: "reg-001",
    event_id: "evt-001",
    participant_name: "Jordan Lee",
    email: "jordan.lee@example.com",
    created_at: "2026-11-02T14:20:00.000Z",
  },
  {
    id: "reg-002",
    event_id: "evt-002",
    participant_name: "Alex Morgan",
    email: "alex.morgan@example.com",
    created_at: "2026-11-03T09:15:00.000Z",
  },
  {
    id: "reg-003",
    event_id: "evt-001",
    participant_name: "Sam Rivera",
    email: "sam.rivera@example.com",
    created_at: "2026-11-03T17:05:00.000Z",
  },
  {
    id: "reg-004",
    event_id: "evt-004",
    participant_name: "Taylor Kim",
    email: "taylor.kim@example.com",
    created_at: "2026-11-04T11:40:00.000Z",
  },
  {
    id: "reg-005",
    event_id: "evt-003",
    participant_name: "Morgan Ellis",
    email: "morgan.ellis@example.com",
    created_at: "2026-11-04T16:10:00.000Z",
  },
];