
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowDownWideNarrow,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  LayoutDashboard,
  ListFilter,
  LogOut,
  MapPin,
  Menu,
  Search,
  Sparkles,
  TicketCheck,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { EVENT_CATEGORIES, type Event } from "@/types/event";
import { authService } from "@/services/authService";

// BRAND
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2.5"
      aria-label="EventEase home"
    >
      <span className="brand-mark">
        <TicketCheck size={19} strokeWidth={2.3} />
      </span>
      {!compact && (
        <span className="brand-word">
          event<span>ease</span>
        </span>
      )}
    </Link>
  );
}

// PUBLIC HEADER
export function PublicHeader() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/" as const },
    { label: "Discover", to: "/events" as const },
    { label: "About", to: "/about" as const },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Brand />

        <nav
          className={cn(
            "public-nav",
            menuOpen && "public-nav-open"
          )}
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "nav-link",
                location.pathname === item.to && "nav-link-active"
              )}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/admin/login"
            className="nav-admin-mobile"
            onClick={() => setMenuOpen(false)}
          >
            Admin login
          </Link>
        </nav>

        <div className="header-actions">
          <Button variant="ghost" asChild className="admin-link">
            <Link to="/admin/login">
              Admin login <ArrowRight size={15} />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
    </header>
  );
}

// PUBLIC FOOTER
export function PublicFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <Brand />
          <p>
            Make room for the moments
            <br />
            that bring us together.
          </p>
        </div>

        <div className="footer-links">
          <span>EXPLORE</span>
          <Link to="/events">Discover events</Link>
          <Link to="/about">About EventEase</Link>
        </div>

        <div className="footer-links">
          <span>GET IN TOUCH</span>
          <a href="mailto:hello@eventease.example">
            hello@eventease.example
          </a>
          <span className="footer-note">
            A sample contact address
          </span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 EventEase</span>
        <span>Good things happen when we meet.</span>
      </div>
    </footer>
  );
}

// PUBLIC FRAME
export function PublicFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  );
}

// SECTION EYEBROW
export function SectionEyebrow({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="section-eyebrow">
      {icon}
      <span>{children}</span>
    </div>
  );
}

// SAFE EVENT DATE FORMATTER
export function formatEventDate(
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  }
) {
  if (!date) {
    return "Date unavailable";
  }

  let parsed: Date;

  if (date instanceof Date) {
    parsed = date;
  } else if (typeof date === "string") {
    const normalizedDate = date.trim();

    if (!normalizedDate) {
      return "Date unavailable";
    }

    parsed = normalizedDate.includes("T")
      ? new Date(normalizedDate)
      : new Date(`${normalizedDate}T12:00:00`);
  } else {
    return "Date unavailable";
  }

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  try {
    return new Intl.DateTimeFormat("en-US", options).format(parsed);
  } catch {
    return "Date unavailable";
  }
}

// SAFE TIME FORMATTER
export function formatTime(time: string) {
  if (!time || typeof time !== "string") {
    return "Time unavailable";
  }

  const [hour = "0", minute = "00"] = time.split(":");

  const hours = Number(hour);
  const minutes = Number(minute);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return "Time unavailable";
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

// EVENT CARD
export function EventCard({
  event,
  featured = false,
}: {
  event: Event;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "event-card",
        featured && "event-card-featured"
      )}
    >
      <Link
        to="/events/$id"
        params={{ id: String(event.id) }}
        className="event-card-image-link"
        aria-label={`View ${event.title}`}
      >
        <img
          className="event-card-image"
          src={event.image_url}
          alt=""
          loading="lazy"
          width={1536}
          height={1024}
        />

        <span className="event-category-pill">
          {event.category}
        </span>
      </Link>

      <div className="event-card-content">
        <div className="event-date-line">
          <CalendarDays size={14} />
          <span>{formatEventDate(event.event_date)}</span>
        </div>

        <h3 className="event-card-title">
          {event.title}
        </h3>

        <div className="event-card-meta">
          <span>
            <Clock3 size={14} />
            {formatTime(event.start_time)} –{" "}
            {formatTime(event.end_time)}
          </span>

          <span>
            <MapPin size={14} />
            {event.venue}
          </span>
        </div>

        <Button
          variant="ghost"
          asChild
          className="event-card-link"
        >
          <Link
            to="/events/$id"
            params={{ id: String(event.id) }}
          >
            View event <ArrowRight size={15} />
          </Link>
        </Button>
      </div>
    </article>
  );
}

// EVENT FILTERS
export function EventFilters({
  search,
  onSearch,
  category,
  onCategory,
  onClear,
  sort,
  onSort,
}: {
  search: string;
  onSearch: (value: string) => void;
  category: string;
  onCategory: (value: string) => void;
  onClear: () => void;
  sort: string;
  onSort: (value: string) => void;
}) {
  return (
    <div className="event-filter-bar">
      <label className="filter-search">
        <Search size={18} />
        <Input
          aria-label="Search events"
          placeholder="Search events by name"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </label>

      <Select
        value={category || "all"}
        onValueChange={(value) =>
          onCategory(value === "all" ? "" : value)
        }
      >
        <SelectTrigger
          aria-label="Filter by category"
          className="filter-select"
        >
          <ListFilter size={16} />
          <SelectValue placeholder="All categories" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>

          {EVENT_CATEGORIES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={onSort}>
        <SelectTrigger
          aria-label="Sort events"
          className="filter-select"
        >
          <ArrowDownWideNarrow size={16} />
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="date">Soonest first</SelectItem>
          <SelectItem value="title">Event name</SelectItem>
        </SelectContent>
      </Select>

      {(search || category) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
        >
          Clear filters <X size={14} />
        </Button>
      )}
    </div>
  );
}

// FILTERED EVENTS
export function useFilteredEvents(
  events: Event[],
  search: string,
  category: string,
  sort: string
) {
  return useMemo(
    () =>
      events
        .filter((event) => event.status === "Upcoming")
        .filter((event) =>
          event.title
            .toLowerCase()
            .includes(search.toLowerCase().trim())
        )
        .filter(
          (event) => !category || event.category === category
        )
        .sort((a, b) =>
          sort === "title"
            ? a.title.localeCompare(b.title)
            : a.event_date.localeCompare(b.event_date)
        ),
    [events, search, category, sort]
  );
}

// ADMIN FRAME
export function AdminFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      label: "Overview",
      to: "/admin" as const,
      icon: LayoutDashboard,
    },
    {
      label: "Events",
      to: "/admin/events" as const,
      icon: CalendarDays,
    },
    {
      label: "Registrations",
      to: "/admin/registrations" as const,
      icon: Users,
    },
  ];

  return (
    <div className="admin-app">
      {mobileOpen && (
        <div
          className="admin-mobile-scrim"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "admin-sidebar",
          mobileOpen && "admin-sidebar-open"
        )}
      >
        <div className="admin-brand">
          <Brand />
          <span className="admin-label">EVENT MANAGER</span>
        </div>

        <div className="admin-menu-label">WORKSPACE</div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "admin-nav-link",
                location.pathname === item.to &&
                  "admin-nav-active"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="demo-status">
            <span className="status-dot" />

            <div>
              <strong>
                {authService.isDemo()
                  ? "Demo workspace"
                  : "Connected account"}
              </strong>

              <small>
                {authService.isDemo()
                  ? "Sample data · saved here"
                  : "EventEase admin"}
              </small>
            </div>
          </div>

          <Button
            variant="ghost"
            className="logout-button"
            onClick={() => {
              authService.logout();
              window.location.assign("/admin/login");
            }}
          >
            <LogOut size={17} />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <Button
            variant="ghost"
            size="icon"
            className="admin-menu-toggle"
            aria-label="Open admin menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </Button>

          <div className="admin-breadcrumb">
            <span>EventEase</span>
            <ChevronDown size={14} />

            <strong>
              {navItems.find(
                (item) => item.to === location.pathname
              )?.label ?? "Workspace"}
            </strong>
          </div>

          <div className="admin-user">
            <span className="admin-avatar">E</span>
            <span>Event manager</span>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

// ADMIN GUARD

export function useAdminGuard() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && !authService.hasSession()) {
      window.location.replace(
        `/admin/login?next=${encodeURIComponent(location.pathname)}`
      );
    }
  }, [location.pathname, isLoginPage]);

  return isLoginPage || authService.hasSession();
}

// ADMIN PAGE HEADING
export function AdminPageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-page-heading">
      <div>
        <div className="admin-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {action}
    </div>
  );
}

// EMPTY EVENTS
export function EmptyEvents({
  title = "No events found",
  description = "Try another search or clear your filters.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Compass size={22} />
      </span>

      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// FEATURE MARK
export function FeatureMark() {
  return (
    <span className="feature-mark">
      <Sparkles size={15} />
    </span>
  );
}

// EVENT META
export function EventMeta({
  event,
}: {
  event: Event;
}) {
  return (
    <div className="event-meta-row">
      <span>
        <CalendarDays size={17} />
        {formatEventDate(event.event_date, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </span>

      <span>
        <Clock3 size={17} />
        {formatTime(event.start_time)} –{" "}
        {formatTime(event.end_time)}
      </span>

      <span>
        <MapPin size={17} />
        {event.venue}
      </span>
    </div>
  );
}

// BREADCRUMB BACK
export function BreadcrumbBack({
  to,
  label,
}: {
  to: "/events" | "/admin/events";
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      asChild
      className="breadcrumb-back"
    >
      <Link to={to}>
        <ArrowLeft size={16} />
        {label}
      </Link>
    </Button>
  );
}

// SUCCESS MARK
export function SuccessMark() {
  return (
    <span className="success-mark">
      <Check size={18} />
    </span>
  );
}
