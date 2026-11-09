import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Music2, Palette, Trophy, Users, Wrench, BookOpen, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard, FeatureMark, PublicFrame, SectionEyebrow } from "@/components/event-ui";
import { eventService } from "@/services/eventService";
import { mockEvents } from "@/data/mockEvents";
import type { Event } from "@/types/event";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EventEase — Discover Events Worth Experiencing" },
      { name: "description", content: "Find and register for thoughtful local events, creative workshops, music and more with EventEase." },
      { property: "og:title", content: "EventEase — Discover Events Worth Experiencing" },
      { property: "og:description", content: "Find and register for thoughtful local events, creative workshops, music and more with EventEase." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const categories = [
  { label: "Technology", icon: Sparkles },
  { label: "Music", icon: Music2 },
  { label: "Sports", icon: Trophy },
  { label: "Education", icon: BookOpen },
  { label: "Workshops", icon: Wrench },
  { label: "Cultural Events", icon: Palette },
];

function HomePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [search, setSearch] = useState("");
  useEffect(() => {
    eventService.listPublic().then(setEvents).catch(() => setEvents(mockEvents));
  }, []);
  const upcoming = [...events].filter((event) => event.status === "Upcoming").sort((a, b) => a.event_date.localeCompare(b.event_date));
  const featured = upcoming.slice(0, 3);
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    void navigate({ to: "/events", search: { q: search } });
  };

  return (
    <PublicFrame>
      <main className="home-main">
        <section className="home-hero">
          <div className="hero-copy">
            <SectionEyebrow icon={<span className="hero-eyebrow-dot" />}>Good things happen together</SectionEyebrow>
            <h1>Discover events<br />worth <em>experiencing.</em></h1>
            <p>From big ideas to little local gems, find the moments that make your city feel a little more alive.</p>
            <form className="hero-search" onSubmit={handleSearch}>
              <label><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search events" placeholder="What are you in the mood for?" /></label>
              <Button type="submit">Explore <ArrowRight size={16} /><span className="sr-only">events</span></Button>
            </form>
            <div className="hero-trust"><div className="avatar-stack"><span>JL</span><span>AM</span><span>RK</span></div><span><strong>1,200+</strong> people finding their next favorite thing</span></div>
          </div>
          <div className="hero-visual" aria-label="People enjoying a speaker event, live music and a community run">
            <div className="hero-photo hero-photo-main"><img src={mockEvents[0]?.image_url} alt="Speaker sharing ideas at a bright city summit" width={1536} height={1024} /><div className="hero-date-chip"><strong>12</strong><span>Dec</span></div><div className="hero-image-caption"><small>Featured experience</small><strong>The Future of Work Summit</strong></div></div>
            <div className="hero-photo hero-photo-top"><img src={mockEvents[1]?.image_url} alt="Live music at a golden-hour park gathering" loading="lazy" width={1536} height={1024} /></div>
            <div className="hero-photo hero-photo-bottom"><img src={mockEvents[2]?.image_url} alt="Runners gathering along the city waterfront" loading="lazy" width={1536} height={1024} /></div>
          </div>
        </section>

        <section className="home-section home-section-alt">
          <div className="section-wrap">
            <div className="section-heading"><div><SectionEyebrow icon={<FeatureMark />}>Picked for you</SectionEyebrow><h2>Worth putting on the calendar</h2><p>A few standout ways to spend your next free day.</p></div><Link to="/events" className="text-link">See all events <ArrowRight size={16} /></Link></div>
            {featured.length > 0 ? <div className="featured-layout">{featured.map((event, index) => <EventCard key={event.id} event={event} featured={index === 0} />)}</div> : <div className="home-empty"><CalendarDays size={20} />New events are on their way.</div>}
          </div>
        </section>

        <section className="home-section">
          <div className="section-wrap">
            <div className="section-heading"><div><SectionEyebrow>Find your kind of thing</SectionEyebrow><h2>A little something for everyone</h2><p>Follow a feeling. See where it takes you.</p></div></div>
            <div className="category-grid">{categories.map(({ label, icon: Icon }) => <button className="category-tile" key={label} onClick={() => void navigate({ to: "/events", search: { category: label } })}><span className="category-symbol"><Icon size={17} /></span><span>{label}</span></button>)}</div>
          </div>
        </section>

        <section className="home-section home-section-alt">
          <div className="section-wrap">
            <div className="section-heading"><div><SectionEyebrow icon={<CalendarDays size={14} />}>Coming up next</SectionEyebrow><h2>Make a plan out of it</h2><p>Good ideas deserve a spot in your calendar.</p></div><Link to="/events" className="text-link">Browse the calendar <ArrowRight size={16} /></Link></div>
            <div className="event-grid">{upcoming.slice(0, 3).map((event) => <EventCard key={event.id} event={event} />)}</div>
          </div>
        </section>
      </main>
    </PublicFrame>
  );
}