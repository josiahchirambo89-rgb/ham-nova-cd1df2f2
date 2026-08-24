import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Save, Send, Square, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { hamChat } from "@/lib/ai.functions";
import { useAuth, useVoicePrefs } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { createRecognition, speak, speechSupported, stopSpeaking } from "@/lib/speech";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/app/tutor")({
  component: Tutor,
});

type Msg = { role: "user" | "assistant"; content: string };

const starters = [
  "Explain photosynthesis with a simple example",
  "How do I solve quadratic equations?",
  "Summarise Ohm's law for an exam",
  "Give me a worked example of moles in chemistry",
];

function Tutor() {
  const { profile, user } = useAuth();
  const prefs = useVoicePrefs();
  const chat = useServerFn(hamChat);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const recRef = useRef<ReturnType<typeof createRecognition>>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => () => stopSpeaking(), []);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const result = await chat({
        data: {
          level: profile?.level ?? "secondary",
          displayName: profile?.display_name ?? undefined,
          messages: next.slice(-12),
        },
      });
      setMessages((m) => [...m, { role: "assistant", content: result.text }]);
      if (autoSpeak) speak(result.text, prefs);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "HAM could not answer right now");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I couldn't reach the AI service just now. Check your connection and try again — labs, syllabus and offline tests still work." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const toggleMic = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = createRecognition();
    if (!rec) {
      toast.error("Voice input isn't supported in this browser. Try Chrome on Android or desktop.");
      return;
    }
    recRef.current = rec;
    rec.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const said = event?.results?.[0]?.[0]?.transcript ?? "";
      if (said) void send(said);
    };
    rec.onerror = () => {
      setListening(false);
      toast.error("Microphone unavailable. Allow mic access and try again.");
    };
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  };

  const saveNote = async (content: string) => {
    if (!user) return;
    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      title: content.slice(0, 60).replace(/\n/g, " "),
      content,
      source: "tutor",
    });
    if (error) toast.error("Could not save note");
    else toast.success("Saved to your notebook");
  };

  const toggleSpeak = (index: number, content: string) => {
    if (!speechSupported()) {
      toast.error("Speech output isn't supported in this browser.");
      return;
    }
    if (speakingIndex === index) {
      stopSpeaking();
      setSpeakingIndex(null);
      return;
    }
    setSpeakingIndex(index);
    speak(content, prefs, () => setSpeakingIndex(null));
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <PageHeader
        title="HAM tutor"
        subtitle="Ask by text or voice. HAM adapts to your level and can read answers aloud."
        action={
          <label className="hairline flex items-center gap-2 rounded-full px-4 py-2 text-sm">
            <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} />
            Read replies aloud
          </label>
        }
      />

      <div className="min-h-[45vh] space-y-4">
        {messages.length === 0 && (
          <div className="hairline rounded-3xl p-6">
            <p className="text-sm text-muted-foreground">Try one of these:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {starters.map((s) => (
                <button key={s} onClick={() => void send(s)} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-accent/60">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
            <div className={`${m.role === "user" ? "chrome-fill max-w-[85%] rounded-3xl rounded-br-lg" : "surface w-full rounded-3xl rounded-bl-lg"} px-5 py-4`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
              {m.role === "assistant" && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => toggleSpeak(i, m.content)} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent/60">
                    {speakingIndex === i ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    {speakingIndex === i ? "Stop" : "Listen"}
                  </button>
                  <button onClick={() => void saveNote(m.content)} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent/60">
                    <Save className="h-3.5 w-3.5" /> Save note
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {busy && (
          <div className="surface w-fit rounded-3xl px-5 py-4 text-sm text-muted-foreground" aria-live="polite">
            HAM is thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="sticky bottom-4 mt-6 flex items-center gap-2 rounded-full border border-border bg-background/90 p-2 backdrop-blur"
      >
        <button
          type="button"
          onClick={toggleMic}
          aria-label={listening ? "Stop listening" : "Speak your question"}
          className={`rounded-full p-3 ${listening ? "chrome-fill" : "hover:bg-accent/60"}`}
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? "Listening…" : "Ask HAM anything…"}
          aria-label="Your question"
          className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
        />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="chrome-fill rounded-full p-3 disabled:opacity-40">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
