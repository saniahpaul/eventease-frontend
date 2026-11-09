import { useEffect, useMemo, useState } from "react";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { CalendarDays, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { AdminFrame, AdminPageHeading, BreadcrumbBack, formatEventDate, useAdminGuard } from "@/components/event-ui";

import { EVENT_CATEGORIES, type Event, type EventInput, type EventStatus } from "@/types/event";

import { eventService } from "@/services/eventService";

import { mockEvents } from "@/data/mockEvents";

import { apiMode } from "@/services/api";

import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



type EventsSearch = { create?: boolean };



export const Route = createFileRoute("/admin/events")({

  validateSearch: (search: Record<string, unknown>): EventsSearch => ({ create: search["create"] === true }),

  head: () => ({ meta: [

    { title: "Manage events | EventEase" },

    { name: "description", content: "Create, update, search and manage EventEase events." },

    { property: "og:title", content: "Manage events | EventEase" },

    { property: "og:description", content: "Create and manage EventEase events." },

    { property: "og:type", content: "website" },

    { name: "twitter:card", content: "summary_large_image" },

  ] }),

  component: AdminEventsPage,

});



const categoryImages = {
  technology: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900",
  music: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900",
  education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900",
  workshops: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900",
  cultural: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=900",
  default: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900",
};

function getCategoryImage(category: string): string {
  const normalized = category.toLowerCase();

  if (normalized.includes("technology")) return categoryImages.technology;
  if (normalized.includes("music")) return categoryImages.music;
  if (normalized.includes("sports")) return categoryImages.sports;
  if (normalized.includes("education")) return categoryImages.education;
  if (normalized.includes("workshop")) return categoryImages.workshops;
  if (normalized.includes("cultural")) return categoryImages.cultural;

  return categoryImages.default;
}



const blankForm: EventInput = { title: "", description: "", category: "Technology", venue: "", event_date: "", start_time: "09:00", end_time: "17:00", image_url: getCategoryImage("Technology"), capacity: null, status: "Upcoming" };



function AdminEventsPage() {

  const allowed = useAdminGuard();

  const navigate = useNavigate();

  const searchParams = Route.useSearch();

  const [events, setEvents] = useState<Event[]>([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editing, setEditing] = useState<Event | null>(null);

  const [form, setForm] = useState<EventInput>(blankForm);

  const [formError, setFormError] = useState("");

  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState("");

  const [loadError, setLoadError] = useState("");



  const load = async () => {

    setLoadError("");

    try { setEvents(await eventService.listAdmin()); }

    catch (issue) { setLoadError(issue instanceof Error ? issue.message : "Events could not be loaded."); }

  };

  useEffect(() => { if (allowed) void load(); }, [allowed]);

  useEffect(() => {

    if (searchParams.create && allowed) { openCreate(); void navigate({ to: "/admin/events", search: { create: false }, replace: true }); }

  }, [allowed, searchParams.create]);

  const filtered = useMemo(() => events.filter((event) => event.title.toLowerCase().includes(search.toLowerCase().trim()) && (category === "all" || event.category === category)), [events, search, category]);



  const openCreate = () => { setEditing(null); setForm({ ...blankForm, event_date: "2027-01-01" }); setFormError(""); setDialogOpen(true); };

  const openEdit = (event: Event) => { setEditing(event); setForm({ title: event.title, description: event.description, category: event.category, venue: event.venue, event_date: event.event_date, start_time: event.start_time, end_time: event.end_time, image_url: event.image_url, capacity: event.capacity ?? null, status: event.status }); setFormError(""); setDialogOpen(true); };

  const updateField = <K extends keyof EventInput>(key: K, value: EventInput[K]) => setForm((current) => ({ ...current, [key]: value }));

  const updateCategory = (value: string) => {

  setForm((current) => ({

    ...current,

    category: value as EventInput["category"],

    image_url: getCategoryImage(value),

  }));

};



  const save = async (event: React.FormEvent) => {

    event.preventDefault(); setFormError("");

    if (!form.title.trim() || !form.description.trim() || !form.venue.trim() || !form.event_date || !form.start_time || !form.end_time) { setFormError("Complete all required fields before saving."); return; }

    if (form.end_time <= form.start_time) { setFormError("End time must be later than start time."); return; }

    if (form.image_url &&!/^https?:\/\//i.test(form.image_url) &&!form.image_url.startsWith("/")) {

  setFormError("Enter a valid image URL.");

  return;

}

    setSaving(true);

    try {

      if (editing) await eventService.update(editing.id, form);

      else await eventService.create(form);

      setDialogOpen(false); setToast(editing ? "Event updated successfully." : "Event created successfully.");

      await load();

    } catch (issue) { setFormError(issue instanceof Error ? issue.message : "The event could not be saved."); }

    finally { setSaving(false); }

  };

  const remove = async (event: Event) => {

    if (!window.confirm(`Delete “${event.title}”? This cannot be undone.`)) return;

    try { await eventService.remove(event.id); setToast("Event deleted."); await load(); }

    catch (issue) { setToast(issue instanceof Error ? issue.message : "The event could not be deleted."); }

  };

  if (!allowed) return null;



  return <AdminFrame><AdminPageHeading eyebrow="Workspace" title="Manage events" description="Create and keep track of every event in one place." action={<Button onClick={openCreate}><Plus size={16} /> Add event</Button>} />{!apiMode && <div className="admin-demo-note"><span className="status-dot" /><span><strong>Sample data</strong> — changes are saved in this browser only; no backend is connected.</span></div>}{toast && <div className="page-toast" role="status">{toast}</div>}<div className="admin-toolbar"><label className="filter-search"><Search size={16} /><Input aria-label="Search managed events" placeholder="Search events" value={search} onChange={(event) => setSearch(event.target.value)} /></label><Select value={category} onValueChange={setCategory}><SelectTrigger aria-label="Filter managed events by category" className="filter-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{EVENT_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>{loadError && <div className="error-box"><p>{loadError}</p><Button variant="outline" onClick={() => void load()}>Try again</Button></div>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>EVENT</th><th>DATE</th><th>VENUE</th><th>STATUS</th><th>CAPACITY</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map((event) => <tr key={event.id}><td data-label="Event"><div className="table-event-name"><img src={event.image_url} alt="" width={1536} height={1024} /><div><strong>{event.title}</strong><small>{event.category}</small></div></div></td><td data-label="Date">{formatEventDate(event.event_date, { month: "short", day: "numeric", year: "numeric" })}</td><td data-label="Venue">{event.venue}</td><td data-label="Status"><span className={cn("status-badge", event.status === "Completed" && "status-completed", event.status === "Cancelled" && "status-cancelled")}>{event.status}</span></td><td data-label="Capacity">{event.capacity ?? "—"}</td><td><div className="table-actions"><Button variant="ghost" size="icon" asChild aria-label={`View ${event.title}`}><Link to="/events/$id" params={{ id: event.id }}><Eye size={15} /></Link></Button><Button variant="ghost" size="icon" aria-label={`Edit ${event.title}`} onClick={() => openEdit(event)}><Pencil size={15} /></Button><Button variant="ghost" size="icon" className="delete-action" aria-label={`Delete ${event.title}`} onClick={() => void remove(event)}><Trash2 size={15} /></Button></div></td></tr>)}</tbody></table>{!loadError && filtered.length === 0 && <div className="admin-empty">No events match your search.</div>}</div><EventFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} form={form} updateField={updateField} updateCategory={updateCategory} onSubmit={save} error={formError} saving={saving} /></AdminFrame>;

}



function EventFormDialog({ open, onOpenChange, editing, form, updateField, updateCategory, onSubmit, error, saving }: { open: boolean; onOpenChange: (open: boolean) => void; editing: Event | null; form: EventInput; updateField: <K extends keyof EventInput>(key: K, value: EventInput[K]) => void; updateCategory: (value: string) => void; onSubmit: (event: React.FormEvent) => void; error: string; saving: boolean }) {

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-2xl"><DialogHeader className="dialog-title"><DialogTitle>{editing ? "Edit event" : "Create an event"}</DialogTitle><DialogDescription>Share the details so guests know what to expect.</DialogDescription></DialogHeader><form className="admin-dialog-form" onSubmit={onSubmit} noValidate><div className="admin-form-grid"><Field label="Event title" required><Input value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="e.g. Ideas in Practice" /></Field><Field label="Category" required><Select value={form.category} onValueChange={updateCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{EVENT_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></Field><Field label="Description" required full><Textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="What makes this event special?" /></Field><Field label="Venue" required full><Input value={form.venue} onChange={(event) => updateField("venue", event.target.value)} placeholder="Venue and neighborhood" /></Field><Field label="Event date" required><Input type="date" value={form.event_date} onChange={(event) => updateField("event_date", event.target.value)} /></Field><Field label="Maximum capacity"><Input type="number" min="1" value={form.capacity ?? ""} onChange={(event) => updateField("capacity", event.target.value ? Number(event.target.value) : null)} placeholder="Optional" /></Field><Field label="Start time" required><Input type="time" value={form.start_time} onChange={(event) => updateField("start_time", event.target.value)} /></Field><Field label="End time" required><Input type="time" value={form.end_time} onChange={(event) => updateField("end_time", event.target.value)} /></Field><Field label="Image URL" full><Input type="url" value={form.image_url} onChange={(event) => updateField("image_url", event.target.value)} placeholder="https://example.com/image.jpg" />{form.image_url && (
  <div className="admin-form-full">
    <label>Image Preview</label>
    <img
      src={form.image_url}
      alt="Event preview"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
      onLoad={(event) => {
        event.currentTarget.style.display = "block";
      }}
      style={{
        width: "100%",
        height: "180px",
        objectFit: "cover",
        borderRadius: "10px",
        marginTop: "8px",
      }}
    />
  </div>
)}</Field><Field label="Event status" required><Select value={form.status} onValueChange={(value) => updateField("status", value as EventStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Upcoming">Upcoming</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent></Select></Field></div>{error && <div className="form-error" role="alert">{error}</div>}<div className="admin-dialog-actions"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Create event"}</Button></div></form></DialogContent></Dialog>;

}



function Field({ label, required, full, children }: { label: string; required?: boolean; full?: boolean; children: React.ReactNode }) {

  return <div className={cn("form-field", full && "admin-form-full")}><label>{label}{required && <span aria-hidden="true"> \*</span>}</label>{children}</div>;

}