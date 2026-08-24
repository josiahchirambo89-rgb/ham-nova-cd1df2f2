import { useEffect, useRef } from "react";
import type { LabVisual } from "@/lib/labs";

type Output = { label: string; unit?: string | undefined; value: number };

/**
 * Animated, dependency-free visualisation for a lab. Every mode is driven by
 * the current parameter values so the picture always matches the readings.
 */
export function LabCanvas({
  visual,
  values,
  outputs,
}: {
  visual: LabVisual;
  values: Record<string, number>;
  outputs: Output[];
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const state = useRef({ visual, values, outputs });
  state.current = { visual, values, outputs };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      frame += 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const t = frame / 60;
      const { visual: mode, values: v, outputs: out } = state.current;
      const nums = Object.values(v);
      const first = out[0]?.value ?? nums[0] ?? 1;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 2;

      // faint grid
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      if (mode === "wave" || mode === "pulse") {
        const amp = clamp((nums[0] ?? 1) * 4, 8, h / 3);
        const freq = clamp(Math.abs(first) / 4 + 0.5, 0.5, 8);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const phase = (x / w) * Math.PI * 2 * freq + (mode === "pulse" ? t * 4 : t * 2);
          const decay = mode === "pulse" ? Math.exp(-x / (w * 0.8)) : 1;
          ctx.lineTo(x, h / 2 - Math.sin(phase) * amp * decay);
        }
        ctx.stroke();
      } else if (mode === "projectile") {
        const speed = clamp(nums[0] ?? 20, 1, 100);
        const angle = ((nums[1] ?? 45) * Math.PI) / 180;
        const g = 9.81;
        const range = (speed * speed * Math.sin(2 * angle)) / g;
        const scale = clamp((w - 40) / Math.max(range, 1), 0.2, 40);
        ctx.beginPath();
        ctx.moveTo(20, h - 20);
        for (let x = 0; x <= range; x += range / 200) {
          const y = x * Math.tan(angle) - (g * x * x) / (2 * speed * speed * Math.cos(angle) ** 2);
          ctx.lineTo(20 + x * scale, h - 20 - Math.max(y, 0) * scale);
        }
        ctx.stroke();
        const tt = (t % 2) / 2;
        const bx = range * tt;
        const by = bx * Math.tan(angle) - (g * bx * bx) / (2 * speed * speed * Math.cos(angle) ** 2);
        ctx.beginPath();
        ctx.arc(20 + bx * scale, h - 20 - Math.max(by, 0) * scale, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === "orbit") {
        const r = clamp(Math.min(w, h) / 3, 30, 200);
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 10, 0, Math.PI * 2);
        ctx.fill();
        const speed = clamp(Math.abs(first) / 20 + 0.4, 0.2, 4);
        ctx.beginPath();
        ctx.arc(w / 2 + Math.cos(t * speed) * r, h / 2 + Math.sin(t * speed) * r, 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === "bar") {
        const items = out.slice(0, 5);
        const max = Math.max(...items.map((o) => Math.abs(o.value) || 0), 1);
        const bw = (w - 40) / Math.max(items.length, 1);
        items.forEach((o, i) => {
          const barH = (Math.abs(o.value) / max) * (h - 60);
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.fillRect(20 + i * bw + 8, h - 30 - barH, bw - 16, barH);
          ctx.fillStyle = "rgba(255,255,255,0.55)";
          ctx.font = "11px sans-serif";
          ctx.fillText(o.label.slice(0, 12), 20 + i * bw + 8, h - 12);
        });
      } else if (mode === "circuit") {
        const pad = 30;
        ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
        const speed = clamp(Math.abs(first) / 5 + 0.5, 0.3, 6);
        const perimeter = 2 * (w - pad * 2) + 2 * (h - pad * 2);
        for (let i = 0; i < 8; i++) {
          const d = ((t * speed * 100 + (i * perimeter) / 8) % perimeter);
          const pt = pointOnRect(d, pad, pad, w - pad * 2, h - pad * 2);
          ctx.beginPath();
          ctx.arc(pt[0], pt[1], 4, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // grid: heat/field style visual
        const cols = 16;
        const rows = 10;
        const cw = w / cols;
        const ch = h / rows;
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const intensity =
              (Math.sin(i / 2 + t * clamp(Math.abs(first) / 10, 0.2, 3)) + Math.cos(j / 2 - t)) / 4 + 0.5;
            ctx.fillStyle = `rgba(255,255,255,${(intensity * 0.5).toFixed(3)})`;
            ctx.fillRect(i * cw + 1, j * ch + 1, cw - 2, ch - 2);
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="h-[280px] w-full rounded-2xl bg-black sm:h-[360px]"
      role="img"
      aria-label={`Animated ${visual} visualisation of the current lab settings`}
    />
  );
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function pointOnRect(d: number, x: number, y: number, w: number, h: number): [number, number] {
  if (d < w) return [x + d, y];
  d -= w;
  if (d < h) return [x + w, y + d];
  d -= h;
  if (d < w) return [x + w - d, y + h];
  d -= w;
  return [x, y + h - d];
}
