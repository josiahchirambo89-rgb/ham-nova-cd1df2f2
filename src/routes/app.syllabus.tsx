import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { curricula } from "@/lib/syllabus";
import { EmptyState, PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/app/syllabus")({
  component: SyllabusPage,
});

function SyllabusPage() {
  const [curriculumId, setCurriculumId] = useState(curricula[0]?.id ?? "");
  const [levelIndex, setLevelIndex] = useState(0);
  const [query, setQuery] = useState("");

  const curriculum = curricula.find((c) => c.id === curriculumId) ?? curricula[0]!;
  const level = curriculum.levels[Math.min(levelIndex, curriculum.levels.length - 1)]!;

  const subjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return level.subjects;
    return level.subjects
      .map((s) => ({
        ...s,
        topics: s.topics.filter((t) =>
          `${t.title} ${t.outcomes.join(" ")}`.toLowerCase().includes(q),
        ),
      }))
      .filter((s) => s.subject.toLowerCase().includes(q) || s.topics.length > 0);
  }, [level, query]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader title="Syllabus library" subtitle="Outlines and learning outcomes from primary school to first-year university." />

      <div className="mb-5 flex flex-wrap gap-2">
        {curricula.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setCurriculumId(c.id);
              setLevelIndex(0);
            }}
            className={`rounded-full px-4 py-1.5 text-sm ${c.id === curriculum.id ? "chrome-fill font-semibold" : "border border-border text-muted-foreground hover:text-foreground"}`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">{curriculum.region}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {curriculum.levels.map((l, i) => (
          <button
            key={l.label}
            onClick={() => setLevelIndex(i)}
            className={`rounded-full px-4 py-1.5 text-xs ${i === levelIndex ? "bg-accent text-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search topics and outcomes…"
        aria-label="Search syllabus"
        className="mb-6 w-full rounded-full border border-border bg-input px-5 py-3 text-sm outline-none focus:border-ring"
      />

      {subjects.length === 0 ? (
        <EmptyState title="Nothing found" body="No topic in this level matches your search." />
      ) : (
        <div className="space-y-4">
          {subjects.map((s) => (
            <section key={s.subject} className="surface rounded-3xl p-5">
              <h2 className="text-lg">{s.subject}</h2>
              <div className="mt-3 space-y-2">
                {s.topics.map((t) => (
                  <details key={t.title} className="rounded-2xl border border-border px-4 py-3">
                    <summary className="cursor-pointer text-sm font-medium">{t.title}</summary>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {t.outcomes.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
