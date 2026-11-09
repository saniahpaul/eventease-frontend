import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  createFileRoute,
  useRouterState,
} from "@tanstack/react-router";
import { ArrowRight, CalendarDays, CirclePlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminFrame, AdminPageHeading, EmptyEvents, formatEventDate, useAdminGuard } from "@/components/event-ui";
import { eventService } from "@/services/eventService";
import { registrationService } from "@/services/registrationService";
import { authService } from "@/services/authService";
import { apiMode } from "@/services/api";
import { mockEvents } from "@/data/mockEvents";
import type { Event } from "@/types/event";
import type { Registration } from "@/types/registration";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Admin overview | EventEase" },
    { name: "description", content: "Review upcoming EventEase events and participant registrations." },
    { property: "og:title", content: "Admin overview | EventEase" },
    { property: "og:description", content: "Review EventEase events and participant registrations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AdminRoute,
});
function AdminRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname !== "/admin") {
    return <Outlet />;
  }

  return <AdminDashboard />;
}
function AdminDashboard() {
  const allowed = useAdminGuard();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!allowed) return;
    let active = true;
    void eventService.listAdmin().then(async (allEvents) => {
      const registrations = await registrationService.listAll(allEvents.map((event) => event.id));
      if (active) { setEvents(allEvents); setRegistrations(registrations); }
    }).catch((issue: unknown) => {
      if (active) setError(issue instanceof Error ? issue.message : "The workspace could not be loaded.");
    });
    return () => { active = false; };
  }, [allowed]);
  if (!allowed) return null;
  const upcoming = events.filter((event) => event.status === "Upcoming");
  const recentEvents = [...events].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 4);
  const recentRegistrations = registrations.slice(0, 4);

  return <AdminFrame><AdminPageHeading eyebrow="Your workspace" title="Overview" description="A quick look at what’s happening across your events." action={<Button asChild><Link to="/admin/events" search={{ create: true }}> <CirclePlus size={16} /> Create event</Link></Button>} />{authService.isDemo() && <div className="admin-demo-note"><span className="status-dot" /><span><strong>Demo workspace</strong> — Changes stay in this browser. No real service or sign-in is connected.{!apiMode ? "" : ""}</span></div>}{error && <div className="page-toast" role="alert">{error}</div>}<section className="admin-cards"><StatCard label="Total events" value={events.length} icon={<CalendarDays size={18} />} /><StatCard label="Upcoming events" value={upcoming.length} icon={<CalendarDays size={18} />} /><StatCard label="Total registrations" value={registrations.length} icon={<Users size={18} />} /></section><div className="admin-two-col"><section className="admin-section"><div className="admin-section-head"><h2>Recent events</h2><Link to="/admin/events">Manage events <ArrowRight size={13} /></Link></div>{recentEvents.length ? recentEvents.map((event) => <div className="recent-event" key={event.id}><div className="recent-event-main"><img className="recent-event-thumb" src={event.image_url} alt="" width={1536} height={1024} /><div><strong>{event.title}</strong><small>{event.category} · {event.status}</small></div></div><time className="recent-event-date">{formatEventDate(event.event_date, { month: "short", day: "numeric" })}</time></div>) : <EmptyEvents title="No events yet" description="Create your first event to get started." />}</section><section className="admin-section"><div className="admin-section-head"><h2>Recent registrations</h2><Link to="/admin/registrations">View all <ArrowRight size={13} /></Link></div>{recentRegistrations.length ? recentRegistrations.map((registration) => <div className="recent-registration" key={registration.id}><strong>{registration.participant_name}</strong><span>{registration.email}</span><time>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(registration.created_at))}</time></div>) : <div className="admin-empty">No registrations to show yet.</div>}</section></div></AdminFrame>;
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <article className="admin-stat"><div><div className="admin-stat-label">{label}</div><div className="admin-stat-value">{value}</div></div><span className="admin-stat-icon">{icon}</span></article>;
}