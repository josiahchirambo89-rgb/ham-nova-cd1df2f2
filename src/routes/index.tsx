import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, FlaskConical, GraduationCap, ImageIcon, MessagesSquare, NotebookPen, Timer, WifiOff } from "lucide-react";
import chromeBlob from "@/assets/chrome-blob.jpg";
import { labs } from "@/lib/labs";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HAM PRO — AI tutor, labs and tests for every learner" },
      {
        name: "description",
        content:
          "HAM PRO is an AI study companion with a talking tutor, 69 interactive science labs, syllabus tracking, timed tests and study groups.",
      },
      { property: "og:title", content: "HAM PRO — AI tutor, labs and tests for every learner" },
      {
        property: "og:description",
        content:
          "Learn with a voice-enabled AI tutor, interactive labs, syllabus tracking and offline tests.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Brain, title: "HAM AI tutor", body: "Ask anything by text or voice. HAM answers step by step and can read replies aloud in your chosen voice." },
  { icon: FlaskConical, title: `${labs.length} interactive labs`, body: "Physics, chemistry, biology, maths, computing and geography simulations with live maths and animated visuals." },
  { icon: GraduationCap, title: "Syllabus explorer", body: "Zambian ECZ, Cambridge, IB and university outlines from primary to first year, topic by topic." },
  { icon: Timer, title: "Adaptive tests", body: "AI-generated papers or the built-in bank, timed, marked instantly with explanations for every answer." },
  { icon: ImageIcon, title: "Snap to notes", body: "Photograph an object, diagram or page and HAM identifies it and writes structured study notes." },
  { icon: NotebookPen, title: "Notebook", body: "Every explanation, lab result and photo note saved, searchable and editable in one place." },
  { icon: MessagesSquare, title: "Study groups", body: "Public or private rooms with join codes and real-time messaging with classmates." },
  { icon: WifiOff, title: "Works offline", body: "Installable as an app, with an offline question bank and labs that run entirely on your device." },
];

const subjects = Array.from(new Set(labs.map((l) => l.subject)));

function Landing() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl [background:var(--gradient-chrome)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <span className="text-lg font-extrabold tracking-tight">
          HAM<span className="chrome-text"> PRO</span>
        </span>
        <nav className="flex items-center gap-2">
          <Link
            to="/app"
            className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Open app
          </Link>
          <Link
            to={user ? "/app" : "/auth"}
            className="chrome-fill rounded-full px-4 py-2 text-sm font-semibold"
          >
            {user ? "Continue" : "Get started"}
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-8 lg:grid-cols-2 lg:pt-16">
        <div>
          <span className="hairline inline-flex rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
            Primary · Secondary · University
          </span>
          <h1 className="mt-5 text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
            Your whole
            <br />
            syllabus, <span className="chrome-text">taught</span>
            <br />
            out loud.
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            HAM PRO pairs a voice-enabled AI tutor with {labs.length} interactive labs, full syllabus
            outlines, instant tests and study groups — online or off.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth" className="chrome-fill rounded-full px-6 py-3 text-sm font-semibold">
              Start learning free
            </Link>
            <Link
              to="/app/labs"
              className="hairline rounded-full px-6 py-3 text-sm font-semibold text-foreground"
            >
              Explore the labs
            </Link>
          </div>
          <dl className="mt-10 flex gap-8">
            {[
              [`${labs.length}`, "live labs"],
              ["4", "curricula"],
              ["24/7", "AI tutor"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-2xl font-extrabold">{value}</dt>
                <dd className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <img
            src={chromeBlob}
            alt="Liquid chrome sculpture representing HAM PRO"
            className="animate-drift mx-auto w-full max-w-lg rounded-[2.5rem]"
            loading="eager"
          />
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20">
        <h2 className="text-3xl sm:text-4xl">Everything a student needs</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="hairline rounded-3xl p-5">
              <f.icon className="h-5 w-5 text-foreground" />
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="surface rounded-[2rem] p-8 text-center">
          <h2 className="text-3xl sm:text-4xl">Labs across every science</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Drag a slider, watch the simulation respond and read the maths update in real time.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {subjects.map((s) => (
              <span key={s} className="hairline rounded-full px-4 py-2 text-sm">
                {s} · {labs.filter((l) => l.subject === s).length}
              </span>
            ))}
          </div>
          <Link
            to="/auth"
            className="chrome-fill mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
          >
            Create your account
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border py-8 text-center text-xs text-muted-foreground">
        HAM PRO — built for learners in Zambia and beyond.
      </footer>
    </div>
  );
}
