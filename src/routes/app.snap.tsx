import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Camera, Download, RefreshCw, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { identifyImage } from "@/lib/ai.functions";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/app/snap")({
  component: SnapPage,
});

type Result = { title: string; subject: string; notes: string };

function SnapPage() {
  const { user, profile } = useAuth();
  const identify = useServerFn(identifyImage);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => () => stopCamera(), []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  const startCamera = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Camera isn't available here. Upload a photo instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      setImage(null);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      toast.error("Camera access was blocked. Allow it in your browser, or upload a photo.");
    }
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/jpeg", 0.8));
    stopCamera();
  };

  const onFile = (file: File) => {
    if (file.size > 8_000_000) {
      toast.error("That image is too large — try one under 8 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const run = async () => {
    if (!image) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await identify({
        data: { imageDataUrl: image, level: profile?.level ?? "secondary", hint: hint || undefined },
      });
      setResult(res);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Identification failed");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!user || !result) return;
    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      title: result.title,
      subject: result.subject,
      content: result.notes,
      source: "snap",
    });
    if (error) toast.error("Could not save note");
    else toast.success("Saved to your notebook");
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([`# ${result.title}\n\nSubject: ${result.subject}\n\n${result.notes}\n`], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title.replace(/[^\w-]+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageHeader
        title="Snap to notes"
        subtitle="Photograph an object, diagram or page. HAM identifies it and writes structured study notes you can save or download."
      />

      <div className="surface overflow-hidden rounded-3xl p-4">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-black">
          {cameraOn ? (
            <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
          ) : image ? (
            <img src={image} alt="Captured subject" className="h-full w-full object-contain" />
          ) : (
            <p className="px-6 text-center text-sm text-muted-foreground">
              Start the camera or upload a photo to begin.
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {cameraOn ? (
            <>
              <button onClick={capture} className="chrome-fill flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
                <Camera className="h-4 w-4" /> Capture
              </button>
              <button onClick={stopCamera} className="rounded-full border border-border px-5 py-2.5 text-sm">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => void startCamera()} className="chrome-fill flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
              <Camera className="h-4 w-4" /> {image ? "Retake" : "Start camera"}
            </button>
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-accent/60">
            <Upload className="h-4 w-4" /> Upload photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFile(file);
              }}
            />
          </label>
        </div>

        <input
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Optional: add context, e.g. 'biology practical'"
          aria-label="Optional context"
          className="mt-4 w-full rounded-2xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-ring"
        />

        <button
          onClick={() => void run()}
          disabled={!image || busy}
          className="chrome-fill mt-3 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-40"
        >
          {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
          {busy ? "Identifying…" : "Identify and write notes"}
        </button>
      </div>

      {result && (
        <section className="surface mt-6 rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{result.subject}</p>
          <h2 className="mt-1 text-2xl">{result.title}</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{result.notes}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => void save()} className="flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm hover:bg-accent/60">
              <Save className="h-4 w-4" /> Save to notebook
            </button>
            <button onClick={download} className="flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm hover:bg-accent/60">
              <Download className="h-4 w-4" /> Download notes
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
