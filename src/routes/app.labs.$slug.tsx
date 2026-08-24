import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { labs } from "@/lib/labs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState } from "@/components/PageHeader";
import { LabCanvas } from "@/components/LabCanvas";

export const Route = createFileRoute("/app/labs/$slug")({
  component: LabDetail,
});

function LabDetail() {
  const { slug } = useParams({ from: "/app/labs/$slug" });
  const { user } = useAuth();
  const lab = labs.find((l) => l.slug === slug);
  const [values, setValues] = useState<Record<string, number>>({});
  const saved = useRef(false);

  useEffect(() => {
    if (lab) setValues(Object.fromEntries(lab.params.map((p) => [p.key, p.value])));
    saved.current = false;
  }, [lab]);

  const outputs = useMemo(() => {
    if (!lab) return [];
    return lab.outputs.map((o) => {
      let value = Number.NaN;
      try {
        value = o.compute(values);
      } catch {
        value = Number.NaN;
      }
      return { label: o.label, unit: o.unit, value };
    });
  }, [lab, values]);

  useEffect(() => {
    if (!lab || !user || saved.current) return;
    saved.current = true;
    void supabase
      .from("lab_progress")
      .upsert(
        { user_id: user.id, lab_slug: lab.slug, opened_count: 1, completed: false },
        { onConflict: "user_id,lab_slug" },
      )
      .then(() => undefined);
  }, [lab, user]);

  if (!lab) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <EmptyState
          title="Lab not found"
          body="That simulation doesn't exist. Browse the catalogue to find another."
          action={
            <Link to="/app/labs" className="chrome-fill rounded-full px-5 py-2 text-sm font-semibold">
              Back to labs
            </Link>
          }
        />
      </div>
    );
  }

  const saveNote = async () => {
    if (!user) return;
    const content = [
      lab.theory,
      "",
      "Settings:",
      ...lab.params.map((p) => `- ${p.label}: ${values[p.key] ?? p.value}${p.unit ? ` ${p.unit}` : ""}`),
      "",
      "Results:",
      ...outputs.map((o) => `- ${o.label}: ${format(o.value)}${o.unit ? ` ${o.unit}` : ""}`),
    ].join("\n");
    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      title: `${lab.title} — lab result`,
      subject: lab.subject,
      content,
      source: "lab",
    });
    if (error) toast.error("Could not save");
    else toast.success("Lab result saved to your notebook");
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Link to="/app/labs" className="text-sm text-muted-foreground hover:text-foreground">
        ← All labs
      </Link>
      <h1 className="mt-4 text-3xl sm:text-4xl">{lab.title}</h1>
      <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
        {lab.subject} · {lab.level}
      </p>
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{lab.theory}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="surface overflow-hidden rounded-3xl p-4">
          <LabCanvas visual={lab.visual} values={values} outputs={outputs} />
        </div>

        <div className="space-y-4">
          <section className="surface rounded-3xl p-5">
            <h2 className="text-lg">Controls</h2>
            <div className="mt-4 space-y-4">
              {lab.params.map((p) => (
                <div key={p.key}>
                  <label htmlFor={p.key} className="flex justify-between text-sm">
                    <span>{p.label}</span>
                    <span className="text-muted-foreground">
                      {format(values[p.key] ?? p.value)}
                      {p.unit ? ` ${p.unit}` : ""}
                    </span>
                  </label>
                  <input
                    id={p.key}
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={values[p.key] ?? p.value}
                    onChange={(e) => setValues((v) => ({ ...v, [p.key]: Number(e.target.value) }))}
                    className="mt-2 w-full accent-white"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setValues(Object.fromEntries(lab.params.map((p) => [p.key, p.value])))}
              className="mt-5 w-full rounded-full border border-border px-4 py-2 text-sm hover:bg-accent/60"
            >
              Reset
            </button>
          </section>

          <section className="surface rounded-3xl p-5">
            <h2 className="text-lg">Readings</h2>
            <dl className="mt-3 space-y-2">
              {outputs.map((o) => (
                <div key={o.label} className="flex items-center justify-between text-sm">
                  <dt className="text-muted-foreground">{o.label}</dt>
                  <dd className="font-semibold">
                    {format(o.value)}
                    {o.unit ? ` ${o.unit}` : ""}
                  </dd>
                </div>
              ))}
            </dl>
            <button onClick={() => void saveNote()} className="chrome-fill mt-5 w-full rounded-full px-4 py-2 text-sm font-semibold">
              Save result to notebook
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function format(value: number) {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 0.01 || abs >= 1e6)) return value.toExponential(2);
  return Math.round(value * 1000) / 1000;
}
