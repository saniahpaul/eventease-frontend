import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Users } from "lucide-react";
import { AdminFrame, AdminPageHeading, formatEventDate, useAdminGuard } from "@/components/event-ui";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiMode } from "@/services/api";
import { eventService } from "@/services/eventService";
import { registrationService } from "@/services/registrationService";
import type { Event } from "@/types/event";
import type { Registration } from "@/types/registration";

export const Route = createFileRoute("/admin/registrations")({
  head: () => ({ meta: [
    { title: "Manage registrations | EventEase" },
    { name: "description", content: "Search EventEase participants and review event registrations." },
    { property: "og:title", content: "Manage registrations | EventEase" },
    { property: "og:description", content: "Review participants registered for EventEase events." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AdminRegistrationsPage,
});

function AdminRegistrationsPage() {
  const allowed = useAdminGuard();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [search, setSearch] = useState("");
  const [eventId, setEventId] = useState("all");
  const [error, setError] = useState("");
  const load = async () => {
    setError("");
    try {
      const allEvents = await eventService.listAdmin();
      const list = await registrationService.listAll(allEvents.map((event) => event.id));
      setEvents(allEvents); setRegistrations(list);
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Registrations could not be loaded."); }
  };
  useEffect(() => { if (allowed) void load(); }, [allowed]);
  const eventNames = useMemo(() => new Map(events.map((event) => [event.id, event.title])), [events]);
  const filtered = registrations.filter((registration) => {
    const text = `${registration.participant_name} ${registration.email} ${eventNames.get(registration.event_id) ?? ""}`.toLowerCase();
    return text.includes(search.toLowerCase().trim()) && (eventId === "all" || registration.event_id === eventId);
  });
  if (!allowed) return null;

  return <AdminFrame><AdminPageHeading eyebrow="Workspace" title="Registrations" description="See who’s coming and keep participant details close at hand." /><section className="admin-cards admin-cards-single"><article className="admin-stat"><div><div className="admin-stat-label">Total registrations</div><div className="admin-stat-value">{registrations.length}</div></div><span className="admin-stat-icon"><Users size={18} /></span></article><article className="admin-stat"><div><div className="admin-stat-label">Events with registrations</div><div className="admin-stat-value">{new Set(registrations.map((registration) => registration.event_id)).size}</div></div><span className="admin-stat-icon"><Users size={18} /></span></article></section>{!apiMode && <div className="admin-demo-note"><span className="status-dot" /><span><strong>Sample data</strong> — these example registrations are saved in this browser only.</span></div>}<div className="admin-toolbar"><label className="filter-search"><Search size={16} /><Input aria-label="Search registrations" placeholder="Search name, email or event" value={search} onChange={(event) => setSearch(event.target.value)} /></label><Select value={eventId} onValueChange={setEventId}><SelectTrigger aria-label="Filter registrations by event" className="filter-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All events</SelectItem>{events.map((event) => <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>)}</SelectContent></Select></div>{error && <div className="error-box"><p>{error}</p><button type="button" onClick={() => void load()}>Try again</button></div>}<p className="result-count"><strong>{filtered.length}</strong> {filtered.length === 1 ? "registration" : "registrations"}</p><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>PARTICIPANT</th><th>EMAIL</th><th>EVENT</th><th>REGISTERED</th></tr></thead><tbody>{filtered.map((registration) => <tr key={registration.id}><td data-label="Participant"><strong>{registration.participant_name}</strong></td><td data-label="Email">{registration.email}</td><td data-label="Event">{eventNames.get(registration.event_id) ?? "Event no longer available"}</td><td data-label="Registered">{formatEventDate(registration.created_at.slice(0, 10), { month: "short", day: "numeric", year: "numeric" })}</td></tr>)}</tbody></table>{!error && filtered.length === 0 && <div className="admin-empty">No registrations match this search.</div>}</div></AdminFrame>;
}