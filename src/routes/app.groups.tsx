import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Lock, Pencil, Plus, Send, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState, PageHeader, Spinner } from "@/components/PageHeader";

export const Route = createFileRoute("/app/groups")({
  component: GroupsPage,
});

type Group = { id: string; name: string; topic: string | null; is_private: boolean; join_code: string; owner_id: string };
type Message = { id: string; content: string; user_id: string; created_at: string; edited: boolean };

function GroupsPage() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", topic: "", is_private: false });
  const [joinCode, setJoinCode] = useState("");
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<{ id: string; content: string } | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const groups = useQuery({
    queryKey: ["groups", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("study_groups")
        .select("id,name,topic,is_private,join_code,owner_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Group[];
    },
  });

  useEffect(() => {
    if (!activeId && groups.data?.length) setActiveId(groups.data[0]!.id);
  }, [groups.data, activeId]);

  const messages = useQuery({
    queryKey: ["group-messages", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_messages")
        .select("id,content,user_id,created_at,edited")
        .eq("group_id", activeId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });

  useEffect(() => {
    if (!activeId) return;
    const channel = supabase
      .channel(`group-${activeId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_messages", filter: `group_id=eq.${activeId}` },
        () => void qc.invalidateQueries({ queryKey: ["group-messages", activeId] }),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [activeId, qc]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.data]);

  const createGroup = async () => {
    if (!user || !form.name.trim()) return;
    const { data, error } = await supabase
      .from("study_groups")
      .insert({ name: form.name.trim(), topic: form.topic.trim() || null, is_private: form.is_private, owner_id: user.id })
      .select("id")
      .single();
    if (error || !data) {
      toast.error("Could not create the group");
      return;
    }
    await supabase.from("group_members").insert({ group_id: data.id, user_id: user.id });
    setCreating(false);
    setForm({ name: "", topic: "", is_private: false });
    setActiveId(data.id);
    toast.success("Study group created");
    void qc.invalidateQueries({ queryKey: ["groups"] });
  };

  const join = async () => {
    if (!user || !joinCode.trim()) return;
    const { data, error } = await supabase
      .from("study_groups")
      .select("id")
      .eq("join_code", joinCode.trim().toUpperCase())
      .maybeSingle();
    if (error || !data) {
      toast.error("No group matches that code");
      return;
    }
    const { error: joinError } = await supabase.from("group_members").insert({ group_id: data.id, user_id: user.id });
    if (joinError && !joinError.message.includes("duplicate")) {
      toast.error("Could not join that group");
      return;
    }
    setJoinCode("");
    setActiveId(data.id);
    toast.success("You joined the group");
    void qc.invalidateQueries({ queryKey: ["groups"] });
  };

  const send = async () => {
    if (!user || !activeId || !draft.trim()) return;
    const content = draft.trim();
    setDraft("");
    const { error } = await supabase.from("group_messages").insert({ group_id: activeId, user_id: user.id, content });
    if (error) {
      toast.error("Message not sent");
      setDraft(content);
    } else void qc.invalidateQueries({ queryKey: ["group-messages", activeId] });
  };

  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await supabase
      .from("group_messages")
      .update({ content: editing.content, edited: true })
      .eq("id", editing.id);
    if (error) toast.error("Could not edit the message");
    else void qc.invalidateQueries({ queryKey: ["group-messages", activeId] });
    setEditing(null);
  };

  const removeMessage = async (id: string) => {
    const { error } = await supabase.from("group_messages").delete().eq("id", id);
    if (error) toast.error("Could not delete the message");
    else void qc.invalidateQueries({ queryKey: ["group-messages", activeId] });
  };

  const active = groups.data?.find((g) => g.id === activeId) ?? null;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Study groups"
        subtitle="Private rooms for you and your classmates. Share a join code — nobody else can see the room."
        action={
          <button onClick={() => setCreating((c) => !c)} className="chrome-fill flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
            <Plus className="h-4 w-4" /> New group
          </button>
        }
      />

      {creating && (
        <section className="surface mb-6 rounded-3xl p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Group name"
              aria-label="Group name"
              className="rounded-2xl border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-ring"
            />
            <input
              value={form.topic}
              onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
              placeholder="Topic (optional)"
              aria-label="Group topic"
              className="rounded-2xl border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-ring"
            />
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_private}
              onChange={(e) => setForm((f) => ({ ...f, is_private: e.target.checked }))}
              className="accent-white"
            />
            Private — join by code only
          </label>
          <button onClick={() => void createGroup()} className="chrome-fill mt-4 rounded-full px-5 py-2 text-sm font-semibold">
            Create group
          </button>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          <div className="surface rounded-3xl p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Join with a code</p>
            <div className="mt-2 flex gap-2">
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="ABC123"
                aria-label="Join code"
                className="min-w-0 flex-1 rounded-full border border-border bg-input px-4 py-2 text-sm uppercase outline-none focus:border-ring"
              />
              <button onClick={() => void join()} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-accent/60">
                Join
              </button>
            </div>
          </div>

          {groups.isLoading ? (
            <Spinner />
          ) : (groups.data ?? []).length === 0 ? (
            <EmptyState title="No groups yet" body="Create a room or join one with a code from a classmate." />
          ) : (
            <div className="space-y-2">
              {groups.data!.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveId(g.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                    g.id === activeId ? "border-foreground bg-accent" : "border-border hover:bg-accent/50"
                  }`}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    {g.is_private ? <Lock className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                    {g.name}
                  </span>
                  {g.topic ? <span className="mt-0.5 block text-xs text-muted-foreground">{g.topic}</span> : null}
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="surface flex min-h-[420px] flex-col rounded-3xl p-4">
          {!active ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">Pick a group to start chatting.</p>
            </div>
          ) : (
            <>
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h2 className="text-lg">{active.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {active.is_private ? "Private room" : "Open room"} · code {active.join_code}
                  </p>
                </div>
                <button
                  onClick={() => {
                    void navigator.clipboard.writeText(active.join_code);
                    toast.success("Join code copied");
                  }}
                  className="rounded-full border border-border px-4 py-1.5 text-xs hover:bg-accent/60"
                >
                  Copy code
                </button>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto py-4">
                {messages.isLoading ? (
                  <Spinner />
                ) : (messages.data ?? []).length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No messages yet — say hello to your group.
                  </p>
                ) : (
                  messages.data!.map((m) => {
                    const mine = m.user_id === user?.id;
                    return (
                      <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                            mine ? "chrome-fill" : "border border-border bg-card"
                          }`}
                        >
                          {editing?.id === m.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editing.content}
                                onChange={(e) => setEditing({ id: m.id, content: e.target.value })}
                                rows={3}
                                aria-label="Edit message"
                                className="w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none"
                              />
                              <div className="flex gap-2">
                                <button onClick={() => void saveEdit()} className="rounded-full border border-border px-3 py-1 text-xs">
                                  Save
                                </button>
                                <button onClick={() => setEditing(null)} className="rounded-full border border-border px-3 py-1 text-xs">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="whitespace-pre-wrap">{m.content}</p>
                              <p className="mt-1 text-[10px] opacity-70">
                                {mine ? profile?.display_name ?? "You" : "Member"} ·{" "}
                                {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                {m.edited ? " · edited" : ""}
                              </p>
                              {mine && (
                                <div className="mt-1 flex gap-2">
                                  <button
                                    onClick={() => setEditing({ id: m.id, content: m.content })}
                                    aria-label="Edit message"
                                    className="opacity-70 hover:opacity-100"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => void removeMessage(m.id)}
                                    aria-label="Delete message"
                                    className="opacity-70 hover:opacity-100"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={endRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void send();
                }}
                className="flex gap-2 border-t border-border pt-3"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Message your group…"
                  aria-label="Message"
                  className="min-w-0 flex-1 rounded-full border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-ring"
                />
                <button type="submit" disabled={!draft.trim()} className="chrome-fill rounded-full px-4 py-2.5 disabled:opacity-40" aria-label="Send">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
