import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Brain, Camera, FlaskConical, GraduationCap, MessagesSquare, NotebookPen, Timer } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { labs } from "@/lib/labs";
import { curricula } from "@/lib/syllabus";
import { PageHeader, Spinner } from "@/components/PageHeader";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const levelTheme: Record<string, { label: string; blurb: string; tint: string }> = {
  primary: {
    label: "Primary",
    blurb: "Bright, playful explanations with lots of pictures and simple words.",
    tint: "from-white/25",
  },
  secondary: {
    label: "Secondary",
    blurb: "Exam-focused steps, worked examples and past-paper style practice.",
    tint: "from-white/15",
  },
  university: {
    label: "University",
    blurb: "Rigorous derivations, references and deeper problem sets.",
    tint: "from-white/10",
  },
};

const tiles = [
  { to: "/app/tutor", icon: Brain, title: "Ask HAM", body: "Voice or text tutoring, any subject." },
  { to: "/app/labs", icon: FlaskConical, title: `${labs.length} labs`, body: "Run interactive simulations." },
  { to: "/app/snap", icon: Camera, title: "Snap to notes", body: "Photograph anything, get notes." },
  { to: "/app/syllabus", icon: GraduationCap, title: "Syllabus", body: `${curricula.length} curricula outlined.` },
  { to: "/app/tests", icon: Timer, title: "Take a test", body: "Timed papers, marked instantly." },
  { to: "/app/notes", icon: NotebookPen, title: "Notebook", body: "Everything you saved." },
  { to: "/app/groups", icon: MessagesSquare, title: "Study groups", body: "Learn together in real time." },
] as const;

function Dashboard() {
  const { user, profile } = useAuth();
  const level = profile?.level ?? "secondary";
  const theme = levelTheme[level] ?? levelTheme["secondary"]!;

  const stats = useQuery({
    queryKey: ["dashboard", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [notes, attempts, progress] = await Promise.all([
        supabase.from("notes").select("id,title,created_at").order("created_at", { ascending: false }).limit(4),
        supabase.from("test_attempts").select("id,subject,score,question_count,created_at").order("created_at", { ascending: false }).limit(4),
        supabase.from("lab_progress").select("id", { count: "exact", head: true }),
      ]);
      return {
        notes: notes.data ?? [],
        attempts: attempts.data ?? [],
        labsRun: progress.count ?? 0,
      };
    },
  });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        title={`Hi ${profile?.display_name?.split(" ")[0] ?? "there"} 👋`}
        subtitle="Pick up where you left off, or start something new."
      />

      <div className={`surface mb-8 rounded-3xl bg-gradient-to-br ${theme.tint} to-transparent p-6`}>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{theme.label} level</p>
        <p className="mt-2 max-w-xl text-lg">{theme.blurb}</p>
        <Link to="/app/settings" className="mt-4 inline-block text-sm text-muted-foreground underline hover:text-foreground">
          Change level or voice
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.to} to={tile.to} className="hairline group rounded-3xl p-5 transition-transform hover:-translate-y-0.5">
            <tile.icon className="h-5 w-5" aria-hidden />
            <p className="mt-3 font-semibold">{tile.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{tile.body}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <section className="surface rounded-3xl p-5">
          <h2 className="text-lg">Recent notes</h2>
          {stats.isLoading ? (
            <Spinner />
          ) : stats.data?.notes.length ? (
            <ul className="mt-3 space-y-2">
              {stats.data.notes.map((note) => (
                <li key={note.id}>
                  <Link to="/app/notes" className="block truncate rounded-2xl px-3 py-2 text-sm hover:bg-accent/60">
                    {note.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No notes yet — try Snap to notes or save a tutor answer.</p>
          )}
        </section>

        <section className="surface rounded-3xl p-5">
          <h2 className="text-lg">Recent tests</h2>
          {stats.isLoading ? (
            <Spinner />
          ) : stats.data?.attempts.length ? (
            <ul className="mt-3 space-y-2">
              {stats.data.attempts.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm">
                  <span>{a.subject}</span>
                  <span className="text-muted-foreground">
                    {a.score}/{a.question_count}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No attempts yet — take a quick five-question test.</p>
          )}
        </section>
      </div>
    </div>
  );
}
