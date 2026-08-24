import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Brain,
  Camera,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  NotebookPen,
  Settings,
  Timer,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/app")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your study space — HAM PRO" },
      { name: "description", content: "Dashboard for the HAM PRO AI tutor, labs, syllabus, tests, notes and study groups." },
      { property: "og:title", content: "Your study space — HAM PRO" },
      { property: "og:description", content: "Dashboard for the HAM PRO AI tutor, labs, syllabus, tests, notes and study groups." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

export const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/tutor", label: "HAM tutor", icon: Brain },
  { to: "/app/labs", label: "Labs", icon: FlaskConical },
  { to: "/app/snap", label: "Snap to notes", icon: Camera },
  { to: "/app/syllabus", label: "Syllabus", icon: GraduationCap },
  { to: "/app/tests", label: "Tests", icon: Timer },
  { to: "/app/notes", label: "Notebook", icon: NotebookPen },
  { to: "/app/groups", label: "Study groups", icon: MessagesSquare },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

function AppLayout() {
  const { user, loading, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-foreground" aria-label="Loading" />
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  const links = (
    <nav className="flex flex-col gap-1" aria-label="App sections">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            isActive(item.to, "exact" in item ? item.exact : false)
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          }`}
        >
          <item.icon className="h-4 w-4 shrink-0" aria-hidden />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen lg:flex">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/app" className="text-base font-extrabold tracking-tight">
          HAM<span className="chrome-text"> PRO</span>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="hairline rounded-full p-2"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {open && (
        <div className="sticky top-[57px] z-20 border-b border-border bg-background px-4 py-3 lg:hidden">{links}</div>
      )}

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-border px-4 py-6 lg:flex">
        <div>
          <Link to="/" className="px-3 text-lg font-extrabold tracking-tight">
            HAM<span className="chrome-text"> PRO</span>
          </Link>
          <div className="mt-6">{links}</div>
        </div>
        <div className="space-y-2">
          <div className="hairline rounded-2xl px-4 py-3">
            <p className="truncate text-sm font-semibold">{profile?.display_name ?? user.email}</p>
            <p className="text-xs capitalize text-muted-foreground">{profile?.level ?? "secondary"} level</p>
          </div>
          <button
            onClick={async () => {
              await signOut();
              void navigate({ to: "/auth", replace: true });
            }}
            className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
