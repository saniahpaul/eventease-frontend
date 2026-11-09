import { useEffect, useState } from "react";
import {
  createFileRoute,
  useNavigate,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  EmptyEvents,
  EventCard,
  EventFilters,
  PublicFrame,
  SectionEyebrow,
  useFilteredEvents,
} from "@/components/event-ui";

import { eventService } from "@/services/eventService";
import { mockEvents } from "@/data/mockEvents";
import type { Event } from "@/types/event";

type EventSearch = {
  q?: string;
  category?: string;
};

export const Route = createFileRoute("/events")({
  validateSearch: (search: Record<string, unknown>): EventSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
    category:
      typeof search["category"] === "string"
        ? search["category"]
        : "",
  }),

  head: () => ({
    meta: [
      { title: "Discover Events | EventEase" },
      {
        name: "description",
        content:
          "Browse upcoming technology, music, sports, education, workshop and cultural events on EventEase.",
      },
      { property: "og:title", content: "Discover Events | EventEase" },
      {
        property: "og:description",
        content:
          "Browse upcoming local events and find something worth experiencing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),

  component: EventsPage,
});

function EventsPage() {
  const navigate = useNavigate();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const searchParams = Route.useSearch();

  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [search, setSearch] = useState(searchParams.q ?? "");
  const [category, setCategory] = useState(
    searchParams.category ?? ""
  );
  const [sort, setSort] = useState("date");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filtered = useFilteredEvents(
    events,
    search,
    category,
    sort
  );

  const loadEvents = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await eventService.listPublic();
      setEvents(result);
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "Events could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEvents();
  }, []);

  useEffect(() => {
    setSearch(searchParams.q ?? "");
    setCategory(searchParams.category ?? "");
  }, [searchParams.q, searchParams.category]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");

    void navigate({
      to: "/events",
      search: {
        q: "",
        category: "",
      },
    });
  };

  if (pathname !== "/events") {
    return <Outlet />;
  }

  return (
    <PublicFrame>
      <main className="listing-main">
        <section className="listing-intro">
          <div className="listing-intro-inner">
            <SectionEyebrow>
              Find your next story
            </SectionEyebrow>

            <h1>Discover events</h1>

            <p>
              Good ideas, new faces, memorable nights. Find the next
              thing you’ll be glad you went to.
            </p>
          </div>
        </section>

        <section className="listing-content">
          <div className="listing-content-inner">
            <EventFilters
              search={search}
              onSearch={setSearch}
              category={category}
              onCategory={setCategory}
              onClear={clearFilters}
              sort={sort}
              onSort={setSort}
            />

            {!loading && !error && (
              <p className="result-count">
                <strong>{filtered.length}</strong> upcoming{" "}
                {filtered.length === 1 ? "event" : "events"}
              </p>
            )}

            {loading ? (
              <div className="loading-grid" role="status">
                Finding good things to do…
              </div>
            ) : error ? (
              <div className="error-box">
                <div>
                  <strong>We couldn’t load the events</strong>
                  <p>{error}</p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => void loadEvents()}
                >
                  Try again
                </Button>
              </div>
            ) : filtered.length ? (
              <div className="event-grid">
                {filtered.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                  />
                ))}
              </div>
            ) : (
              <EmptyEvents />
            )}
          </div>
        </section>
      </main>
    </PublicFrame>
  );
}
