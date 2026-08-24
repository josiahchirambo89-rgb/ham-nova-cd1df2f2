import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { labs } from "@/lib/labs";
import { EmptyState, PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/app/labs/")({
  component: LabCatalogue,
});

const subjects = ["All", ...Array.from(new Set(labs.map((l) => l.subject)))];
const levels = ["All", "primary", "secondary", "university"];

function LabCatalogue() {
  const [subject, setSubject] = useState("All");
  const [level, setLevel] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      labs.filter(
        (l) =>
          (subject === "All" || l.subject === subject) &&
          (level === "All" || l.level === level) &&
          (query.trim() === "" ||
            `${l.title} ${l.summary} ${l.subject}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [subject, level, query],
  );

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader title="Interactive labs" subtitle={`${labs.length} simulations that run entirely on your device — no internet needed.`} />

      <div className="mb-6 space-y-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search labs…"
          aria-label="Search labs"
          className="w-full rounded-full border border-border bg-input px-5 py-3 text-sm outline-none focus:border-ring"
        />
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`rounded-full px-4 py-1.5 text-sm ${subject === s ? "chrome-fill font-semibold" : "border border-border text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-full px-4 py-1.5 text-xs capitalize ${level === l ? "bg-accent text-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No labs match" body="Try a different subject, level or search term." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lab) => (
            <Link
              key={lab.slug}
              to="/app/labs/$slug"
              params={{ slug: lab.slug }}
              className="hairline rounded-3xl p-5 transition-transform hover:-translate-y-0.5"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {lab.subject} · {lab.level}
              </p>
              <p className="mt-2 font-semibold">{lab.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{lab.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
