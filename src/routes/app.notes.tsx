import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Download, Pencil, Trash2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useVoicePrefs } from "@/hooks/useAuth";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";
import { EmptyState, PageHeader, Spinner } from "@/components/PageHeader";

export const Route = createFileRoute("/app/notes")({
  component: NotesPage,
});

type Note = {
  id: string;
  title: string;
  content: string;
  subject: string | null;
  source: string;
  created_at: string;
};

function NotesPage() {
  const { user } = useAuth();
  const prefs = useVoicePrefs();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Note | null>(null);
  const [draft, setDraft] = useState({ title: "", content: "" });

  const notes = useQuery({
    queryKey: ["notes", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id,title,content,subject,source,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Note[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      const { error } = await supabase
        .from("notes")
        .update({ title: draft.title, content: draft.content })
        .eq("id", editing.id);
      if (error) throw error;
    },
    onSuccess: () => {
      setEditing(null);
      toast.success("Note updated");
      void qc.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => toast.error("Could not update note"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Note deleted");
      void qc.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => toast.error("Could not delete note"),
  });

  const filtered = (notes.data ?? []).filter((n) =>
    `${n.title} ${n.content} ${n.subject ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  );

  const download = (note: Note) => {
    const blob = new Blob([`# ${note.title}\n\n${note.content}\n`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/[^\w-]+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title="Notebook" subtitle="Everything you saved from the tutor, labs and photo notes." />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your notes…"
        aria-label="Search notes"
        className="mb-6 w-full rounded-full border border-border bg-input px-5 py-3 text-sm outline-none focus:border-ring"
      />

      {notes.isLoading ? (
        <Spinner />
      ) : notes.isError ? (
        <EmptyState title="Couldn't load notes" body="Check your connection and refresh the page." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={query ? "No matching notes" : "Your notebook is empty"}
          body={query ? "Try a different search." : "Save a tutor answer, a lab result or a photo note and it will appear here."}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((note) => (
            <article key={note.id} className="surface rounded-3xl p-5">
              {editing?.id === note.id ? (
                <div className="space-y-3">
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    aria-label="Note title"
                    className="w-full rounded-2xl border border-border bg-input px-4 py-2 text-sm outline-none focus:border-ring"
                  />
                  <textarea
                    value={draft.content}
                    onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                    rows={10}
                    aria-label="Note content"
                    className="w-full rounded-2xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-ring"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => save.mutate()} disabled={save.isPending} className="chrome-fill rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-50">
                      Save
                    </button>
                    <button onClick={() => setEditing(null)} className="rounded-full border border-border px-5 py-2 text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {note.subject ?? note.source} · {new Date(note.created_at).toLocaleDateString()}
                  </p>
                  <h2 className="mt-1 text-lg">{note.title}</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{note.content}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setEditing(note);
                        setDraft({ title: note.title, content: note.content });
                      }}
                      className="flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs hover:bg-accent/60"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (!speechSupported()) {
                          toast.error("Speech isn't supported in this browser");
                          return;
                        }
                        stopSpeaking();
                        speak(`${note.title}. ${note.content}`, prefs);
                      }}
                      className="flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs hover:bg-accent/60"
                    >
                      <Volume2 className="h-3.5 w-3.5" /> Listen
                    </button>
                    <button onClick={() => download(note)} className="flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs hover:bg-accent/60">
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this note?")) remove.mutate(note.id);
                      }}
                      className="flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs text-destructive hover:bg-accent/60"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
