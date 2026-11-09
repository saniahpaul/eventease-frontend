import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Heart, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicFrame, SectionEyebrow } from "@/components/event-ui";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About EventEase | Find your next favorite thing" },
    { name: "description", content: "EventEase helps you find local moments, meet new people and make more of your city." },
    { property: "og:title", content: "About EventEase" },
    { property: "og:description", content: "A little more connection, one good event at a time." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AboutPage,
});

function AboutPage() {
  return <PublicFrame><main className="about-main"><section className="about-lead"><SectionEyebrow>Why we’re here</SectionEyebrow><h1>There’s more to a city than the places. <span>It’s the moments.</span></h1><p>EventEase makes it easier to find the gatherings, ideas and new experiences that turn an ordinary week into something worth remembering.</p><Button asChild className="about-cta"><Link to="/events">Find your next event <ArrowRight size={16} /></Link></Button></section><section className="about-values"><div className="about-values-inner"><div className="about-value"><MapPin size={20} className="about-value-icon" /><h2>Close to home</h2><p>Discover local events from familiar neighborhoods and new corners of the city.</p></div><div className="about-value"><Heart size={20} className="about-value-icon" /><h2>Made for real life</h2><p>Simple event details and easy registration make saying “I’m in” feel effortless.</p></div><div className="about-value"><Users size={20} className="about-value-icon" /><h2>Better together</h2><p>Find a shared interest, bring a friend or meet someone new along the way.</p></div></div></section></main></PublicFrame>;
}