import { useEffect, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventMeta, PublicFrame, SectionEyebrow, SuccessMark } from "@/components/event-ui";
import { eventService } from "@/services/eventService";
import { registrationService } from "@/services/registrationService";
import type { Event } from "@/types/event";

export const Route = createFileRoute("/events/$id")({
  loader: async ({ params }) => {
    const event = await eventService.getById(params.id);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData?.event ? `${loaderData.event.title} | EventEase` : "Event details | EventEase" },
    { name: "description", content: loaderData?.event?.description ?? "Event details and registration on EventEase." },
    { property: "og:title", content: loaderData?.event ? `${loaderData.event.title} | EventEase` : "Event details | EventEase" },
    { property: "og:description", content: loaderData?.event?.description ?? "Event details and registration on EventEase." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: EventDetailsPage,
});

function EventDetailsPage() {
  const { event: initialEvent } = Route.useLoaderData();
  const [event, setEvent] = useState<Event>(initialEvent);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  useEffect(() => { setEvent(initialEvent); }, [initialEvent]);
  const submitRegistration = async (formEvent: React.FormEvent) => {
    formEvent.preventDefault(); setIssue("");
    if (!name.trim() || !email.trim()) { setIssue("Please add your name and email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setIssue("Enter a valid email address."); return; }
    setSubmitting(true);
    try { await registrationService.register(event.id, { participant_name: name.trim(), email: email.trim() }); setRegistered(true); }
    catch (error) { setIssue(error instanceof Error ? error.message : "Registration could not be completed. Please try again."); }
    finally { setSubmitting(false); }
  };

  return <PublicFrame><main className="event-detail-page"><img className="event-detail-cover" src={event.image_url} alt="" width={1536} height={1024} /><div className="event-detail-wrap"><div className="event-detail-panel"><div className="event-detail-main"><SectionEyebrow><CalendarDays size={14} />{event.category}</SectionEyebrow><h1>{event.title}</h1><EventMeta event={event} /><p className="event-detail-description">{event.description}</p><div className="event-detail-note"><MapPin size={17} /><span>Hosted at <strong>{event.venue}</strong></span></div></div><aside className="registration-panel">{registered ? <div className="registration-success"><SuccessMark /><h3>You’re on the list.</h3><p>Thanks, {name}. Your place for <strong>{event.title}</strong> is noted. We’ve recorded this in the local demo data.</p></div> : <><h2>Come along</h2><p>Save your spot. It only takes a moment.</p><form onSubmit={submitRegistration} noValidate><div className="form-field"><label htmlFor="attendee-name">Full name</label><Input id="attendee-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required /></div><div className="form-field"><label htmlFor="attendee-email">Email address</label><Input id="attendee-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>{issue && <div className="form-error" role="alert">{issue}</div>}<Button type="submit" disabled={submitting}>{submitting ? "Saving your place…" : "Register now"}</Button></form><p className="registration-footnote">No account needed. Your details are used for this registration.</p></>}</aside></div></div></main></PublicFrame>;
}