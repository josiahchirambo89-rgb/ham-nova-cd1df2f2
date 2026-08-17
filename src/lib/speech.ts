export type VoicePrefs = { gender: string; rate: number };

export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(gender: string) {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = en.length ? en : voices;
  const female = /female|zira|samantha|karen|victoria|serena|google uk english female/i;
  const male = /male|david|daniel|alex|fred|google uk english male/i;
  const wanted = gender === "male" ? male : gender === "female" ? female : null;
  if (wanted) {
    const match = pool.find((v) => wanted.test(v.name));
    if (match) return match;
  }
  return pool[0] ?? null;
}

export function speak(text: string, prefs: VoicePrefs, onEnd?: () => void) {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[*_`#>]/g, "").slice(0, 4000);
  const utterance = new SpeechSynthesisUtterance(clean);
  const voice = pickVoice(prefs.gender);
  if (voice) utterance.voice = voice;
  utterance.rate = prefs.rate || 1;
  utterance.pitch = prefs.gender === "male" ? 0.9 : prefs.gender === "female" ? 1.15 : 1;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function createRecognition(): RecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec: RecognitionLike = new Ctor();
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.continuous = false;
  return rec;
}
