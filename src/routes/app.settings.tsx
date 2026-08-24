import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { speak, speechSupported } from "@/lib/speech";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

const levels = [
  { value: "primary", label: "Primary", hint: "Grades 1–7 · bright, simple explanations" },
  { value: "secondary", label: "Secondary", hint: "Grades 8–12 · ECZ, IGCSE, IB" },
  { value: "university", label: "University", hint: "Foundation and degree level depth" },
];

function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({ display_name: "", level: "secondary", voice_gender: "female", voice_rate: 1 });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile)
      setForm({
        display_name: profile.display_name ?? "",
        level: profile.level ?? "secondary",
        voice_gender: profile.voice_gender ?? "female",
        voice_rate: profile.voice_rate ?? 1,
      });
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    setBusy(false);
    if (error) toast.error("Could not save your settings");
    else {
      await refreshProfile();
      toast.success("Settings saved");
    }
  };

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <PageHeader title="Settings" subtitle="Tune how HAM addresses you, what level it teaches at, and how it sounds." />

      <section className="surface rounded-3xl p-6">
        <label className="block text-sm">
          Display name
          <input
            value={form.display_name}
            onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
            className="mt-2 w-full rounded-2xl border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-ring"
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">Signed in as {user?.email}</p>
      </section>

      <section className="surface mt-4 rounded-3xl p-6">
        <h2 className="text-lg">Learning level</h2>
        <div className="mt-4 grid gap-2">
          {levels.map((l) => (
            <button
              key={l.value}
              onClick={() => setForm((f) => ({ ...f, level: l.value }))}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                form.level === l.value ? "border-foreground bg-accent" : "border-border hover:bg-accent/50"
              }`}
            >
              <span className="font-semibold">{l.label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{l.hint}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="surface mt-4 rounded-3xl p-6">
        <h2 className="text-lg">Voice</h2>
        <div className="mt-4 flex gap-2">
          {["female", "male", "system"].map((g) => (
            <button
              key={g}
              onClick={() => setForm((f) => ({ ...f, voice_gender: g }))}
              className={`flex-1 rounded-full border px-4 py-2 text-sm capitalize ${
                form.voice_gender === g ? "border-foreground bg-accent" : "border-border hover:bg-accent/50"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <label className="mt-5 block text-sm">
          <span className="flex justify-between">
            Speaking speed <span className="text-muted-foreground">{form.voice_rate.toFixed(2)}×</span>
          </span>
          <input
            type="range"
            min={0.6}
            max={1.6}
            step={0.05}
            value={form.voice_rate}
            onChange={(e) => setForm((f) => ({ ...f, voice_rate: Number(e.target.value) }))}
            className="mt-2 w-full accent-white"
          />
        </label>
        <button
          onClick={() => {
            if (!speechSupported()) {
              toast.error("Speech isn't supported in this browser");
              return;
            }
            speak("Hello, I am HAM. This is how I will read your notes aloud.", {
              gender: form.voice_gender,
              rate: form.voice_rate,
            });
          }}
          className="mt-4 flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm hover:bg-accent/60"
        >
          <Volume2 className="h-4 w-4" /> Test voice
        </button>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={() => void save()} disabled={busy} className="chrome-fill rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50">
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button onClick={() => void signOut()} className="rounded-full border border-border px-6 py-2.5 text-sm hover:bg-accent/60">
          Sign out
        </button>
      </div>

      <section className="surface mt-6 rounded-3xl p-6 text-sm text-muted-foreground">
        <h2 className="text-base text-foreground">About HAM PRO</h2>
        <p className="mt-2">
          HAM PRO is an offline-friendly study companion: a talking AI tutor, interactive science labs, photo-to-notes,
          syllabus tracking, timed tests and private study groups. Install it from your browser menu to use it like an app.
        </p>
      </section>
    </div>
  );
}
