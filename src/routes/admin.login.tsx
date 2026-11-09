
import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "@/components/event-ui";
import { mockEvents } from "@/data/mockEvents";
import { apiMode } from "@/services/api";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin login | EventEase" },
      {
        name: "description",
        content: "Sign in to manage EventEase events and registrations.",
      },
      { property: "og:title", content: "Admin login | EventEase" },
      {
        property: "og:description",
        content: "Manage EventEase events and registrations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email address and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (!apiMode) {
      setError("The EventEase API isn't connected. Please try again later.");
      return;
    }

    setLoading(true);

    try {
      await authService.login(email.trim(), password);
      void navigate({ to: "/admin" });
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "We couldn't sign you in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-visual">
        <img
          src={mockEvents[0]?.image_url}
          alt="A city event taking place in a bright venue"
          width={1536}
          height={1024}
        />
        <div className="admin-login-overlay">
          <Brand />
          <div className="login-quote">
            <h1>Make space for moments that matter.</h1>
            <p>Bring the right people together, one good event at a time.</p>
          </div>
          <span className="login-image-credit">
            EVENTEASE · EVENT MANAGEMENT
          </span>
        </div>
      </section>

      <section className="admin-login-form-side">
        <div className="login-form-wrap">
          <div className="admin-eyebrow">EVENTEASE WORKSPACE</div>

          <h2>Welcome back</h2>
          <p>Sign in to manage your events and registrations.</p>

          <form onSubmit={submit} noValidate>
            <div className="form-field">
              <label htmlFor="admin-email">Email address</label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="admin-password">Password</label>

              <div className="password-wrap">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-reveal"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="login-footnote">
             Authorized access for seamless event management.
          </p>

          <Link to="/" className="login-back">
            <ArrowLeft size={14} /> Back to discovering events
          </Link>
        </div>
      </section>
    </main>
  );
}
