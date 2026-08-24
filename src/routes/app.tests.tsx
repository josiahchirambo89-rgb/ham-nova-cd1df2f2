import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { CheckCircle2, RefreshCw, WifiOff, XCircle } from "lucide-react";
import { toast } from "sonner";
import { generateTest } from "@/lib/ai.functions";
import { bankSubjects, pickOfflineQuestions, type Question } from "@/lib/question-bank";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/app/tests")({
  component: TestsPage,
});

type Item = { question: string; options: string[]; answer: number; explanation: string };

function TestsPage() {
  const { user, profile } = useAuth();
  const makeTest = useServerFn(generateTest);
  const [subject, setSubject] = useState(bankSubjects[0] ?? "Mathematics");
  const [count, setCount] = useState(8);
  const [items, setItems] = useState<Item[] | null>(null);
  const [offline, setOffline] = useState(false);
  const [busy, setBusy] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const level = profile?.level ?? "secondary";

  const useOfflineBank = (reason?: string) => {
    const bank = pickOfflineQuestions(count, subject, level);
    setItems(bank.map(({ question, options, answer, explanation }: Question) => ({ question, options, answer, explanation })));
    setOffline(true);
    if (reason) toast.message("Using the offline question bank", { description: reason });
  };

  const start = async () => {
    setBusy(true);
    setAnswers({});
    setSubmitted(false);
    setItems(null);
    if (!online) {
      useOfflineBank("You're offline right now.");
      setBusy(false);
      return;
    }
    try {
      const res = await makeTest({ data: { subject, level, count } });
      setItems(res.questions.map((q) => ({ ...q, explanation: q.explanation ?? "" })));
      setOffline(false);
    } catch (error) {
      useOfflineBank(error instanceof Error ? error.message : "The AI test writer is unavailable.");
    } finally {
      setBusy(false);
    }
  };

  const score = items ? items.filter((q, i) => answers[i] === q.answer).length : 0;

  const submit = async () => {
    if (!items) return;
    setSubmitted(true);
    const correct = items.filter((q, i) => answers[i] === q.answer).length;
    if (user) {
      await supabase.from("test_attempts").insert({
        user_id: user.id,
        subject,
        level,
        offline,
        question_count: items.length,
        score: correct,
        details: items.map((q, i) => ({ question: q.question, chosen: answers[i] ?? null, answer: q.answer })),
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageHeader
        title="Tests"
        subtitle="Sit a fresh AI-written test, or fall back to the built-in bank when you're offline."
      />

      <section className="surface rounded-3xl p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm">
            Subject
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-ring"
            >
              {bankSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Questions
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-ring"
            >
              {[5, 8, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              onClick={() => void start()}
              disabled={busy}
              className="chrome-fill flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
              {busy ? "Writing…" : "Start test"}
            </button>
          </div>
        </div>
        {!online && (
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <WifiOff className="h-3.5 w-3.5" /> You're offline — tests will use the saved question bank.
          </p>
        )}
      </section>

      {items && (
        <section className="mt-6 space-y-3">
          {offline && (
            <p className="hairline rounded-2xl px-4 py-3 text-xs text-muted-foreground">
              Offline question bank — {items.length} questions from the built-in {subject} set.
            </p>
          )}
          {items.map((q, i) => (
            <article key={`${i}-${q.question.slice(0, 12)}`} className="surface rounded-3xl p-5">
              <p className="text-sm font-semibold">
                {i + 1}. {q.question}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const chosen = answers[i] === oi;
                  const right = submitted && oi === q.answer;
                  const wrong = submitted && chosen && oi !== q.answer;
                  return (
                    <button
                      key={oi}
                      onClick={() => !submitted && setAnswers((a) => ({ ...a, [i]: oi }))}
                      disabled={submitted}
                      className={`flex w-full items-center gap-2 rounded-2xl border px-4 py-2.5 text-left text-sm transition-colors ${
                        right
                          ? "border-foreground bg-accent"
                          : wrong
                            ? "border-destructive"
                            : chosen
                              ? "border-foreground"
                              : "border-border hover:bg-accent/50"
                      }`}
                    >
                      {right ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : wrong ? <XCircle className="h-4 w-4 shrink-0 text-destructive" /> : null}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && q.explanation ? (
                <p className="mt-3 text-xs text-muted-foreground">{q.explanation}</p>
              ) : null}
            </article>
          ))}

          {submitted ? (
            <div className="surface rounded-3xl p-6 text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Your score</p>
              <p className="chrome-text mt-2 text-5xl font-bold">
                {score}/{items.length}
              </p>
              <button onClick={() => void start()} className="chrome-fill mt-5 rounded-full px-6 py-2.5 text-sm font-semibold">
                Try another test
              </button>
            </div>
          ) : (
            <button
              onClick={() => void submit()}
              disabled={Object.keys(answers).length !== items.length}
              className="chrome-fill w-full rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-40"
            >
              {Object.keys(answers).length !== items.length
                ? `Answer all ${items.length} questions to submit`
                : "Submit test"}
            </button>
          )}
        </section>
      )}
    </div>
  );
}
