import { useEffect, useRef } from "react";
import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";
import { useIsDesktop } from "@/hooks/useMedia";

const VERT = `#version 300 es
const vec2 c[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));
void main(){ gl_Position = vec4(c[gl_VertexID], 0., 1.); }`;

/**
 * Silk ribbon. Each ribbon is a band around a centre line made of two summed
 * sines; a slow cosine "twist" narrows the band and flips which face shows, so
 * it reads as cloth folding over rather than a flat stripe. Everything is
 * phase-driven by scroll progress, with only a faint drift from time.
 */
const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uProg;
uniform float uFreq;
out vec4 outColor;

const vec3 SAGE = vec3(0.333, 0.498, 0.396);
const vec3 FOREST = vec3(0.212, 0.361, 0.271);
const vec3 SOFT = vec3(0.659, 0.725, 0.659);
const vec3 CHAMP = vec3(0.769, 0.710, 0.541);
const vec3 PEARL = vec3(0.93, 0.90, 0.80);

vec4 over(vec4 dst, vec4 src){ return src + dst * (1.0 - src.a); }

vec4 ribbon(vec2 p, float seed, float w0, vec3 front, vec3 frontHi, vec3 back){
  float x = p.x * uFreq + seed * 2.7;
  float ph = uProg * 3.4 + uTime * 0.12 + seed;
  float a1 = x * 1.25 + ph, a2 = x * 2.7 - ph * 1.6 + seed * 2.0;
  float yc = 0.17 * sin(a1) + 0.065 * sin(a2) + (seed - 0.6) * 0.05;
  float dy = (0.17 * 1.25 * cos(a1) + 0.065 * 2.7 * cos(a2)) * uFreq;
  float tw = cos(x * 0.95 - ph * 0.85 + seed * 4.0);
  float w = w0 * (0.14 + 0.86 * abs(tw));
  float d = (p.y - yc) / sqrt(1.0 + dy * dy);
  float v = d / w;
  float aa = fwidth(v) * 1.5;
  float alpha = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, abs(v));

  // soft contact shadow on the paper below the cloth
  float sd = max(abs(d + 0.012) - w, 0.0);
  float shadow = 0.16 * exp(-sd * sd / 0.0009);

  float face = smoothstep(-0.12, 0.12, tw);
  vec3 n = normalize(vec3(-dy * 0.7, v * 1.05 * sign(tw + 1e-4), 1.0));
  vec3 L = normalize(vec3(0.35, 0.65, 0.68));
  float diff = dot(n, L);
  float sheen = 0.5 + 0.5 * sin(v * 2.6 + x * 1.9 + ph * 1.2);
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 22.0);
  vec3 base = mix(back, mix(front, frontHi, sheen * 0.55), face);
  float fold = mix(0.74, 1.0, smoothstep(0.0, 0.45, abs(tw)));
  vec3 col = base * (0.66 + 0.46 * diff) * fold + PEARL * spec * (0.25 + 0.4 * face);
  col = mix(col, col * 0.86, smoothstep(0.55, 1.0, abs(v)));

  vec4 outc = vec4(FOREST * shadow, shadow) * (1.0 - alpha);
  return over(outc, vec4(col * alpha, alpha));
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  p.x += uProg * 0.9;
  vec4 c = vec4(0.0);
  c = over(c, ribbon(p + vec2(0.0, 0.05), 1.9, 0.034, CHAMP, PEARL, CHAMP * 0.78));
  c = over(c, ribbon(p, 0.0, 0.088, SAGE, SOFT, FOREST));
  float edge = smoothstep(0.0, 0.14, gl_FragCoord.x / uRes.x) * smoothstep(0.0, 0.14, 1.0 - gl_FragCoord.x / uRes.x);
  outColor = c * edge;
}`;

/** Canvas-2D fallback: the same sine ribbons as soft round strokes. */
function draw2d(ctx: CanvasRenderingContext2D, w: number, h: number, prog: number, time: number) {
  ctx.clearRect(0, 0, w, h);
  const bands = [
    { color: "#C4B58A", width: h * 0.035, seed: 1.9, off: 0.05 },
    { color: "#557F65", width: h * 0.11, seed: 0, off: 0 },
    { color: "rgba(168,185,168,.7)", width: h * 0.03, seed: 0, off: -0.012 },
  ];
  for (const b of bands) {
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const x = ((u - 0.5) * w) / h + prog * 0.9 + b.seed * 2.7;
      const ph = prog * 3.4 + time * 0.12 + b.seed;
      const y = 0.17 * Math.sin(x * 1.25 + ph) + 0.065 * Math.sin(x * 2.7 - ph * 1.6 + b.seed * 2);
      const px = u * w;
      const py = h / 2 - (y - b.off) * h;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = b.color;
    ctx.lineWidth = b.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }
}

export function RibbonTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const desktop = useIsDesktop();

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maxRatio = desktop ? 1.5 : 1;
    let raf = 0;
    let visible = false;
    let disposed = false;
    const start = performance.now();

    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    let program: WebGLProgram | null = null;
    let vao: WebGLVertexArrayObject | null = null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};

    if (gl) {
      const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
      };
      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG);
      if (vs && fs) {
        const p = gl.createProgram()!;
        gl.attachShader(p, vs);
        gl.attachShader(p, fs);
        gl.linkProgram(p);
        if (gl.getProgramParameter(p, gl.LINK_STATUS)) {
          program = p;
          vao = gl.createVertexArray();
          for (const name of ["uRes", "uTime", "uProg", "uFreq"]) uniforms[name] = gl.getUniformLocation(p, name);
        }
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    }
    const ctx2d = !program ? canvas.getContext("2d") : null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, maxRatio);
      const w = Math.max(1, Math.round(rect.width * ratio));
      const h = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      return Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
    };

    const render = () => {
      const time = reduced ? 0 : (performance.now() - start) / 1000;
      const prog = progress();
      if (gl && program) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindVertexArray(vao);
        gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
        gl.uniform1f(uniforms.uTime, time);
        gl.uniform1f(uniforms.uProg, prog);
        gl.uniform1f(uniforms.uFreq, canvas.width < canvas.height ? 2.4 : 1.0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      } else if (ctx2d) {
        draw2d(ctx2d, canvas.width, canvas.height, prog, time);
      }
    };

    const loop = () => {
      raf = 0;
      if (!visible || disposed || document.hidden) return;
      render();
      if (!reduced) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf && visible && !disposed) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      wake();
    });
    io.observe(section);
    const ro = new ResizeObserver(() => {
      resize();
      wake();
    });
    ro.observe(canvas);
    // under reduced motion the ribbon only follows the scroll position
    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", wake);
    resize();
    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", wake);
      if (gl) {
        if (program) gl.deleteProgram(program);
        if (vao) gl.deleteVertexArray(vao);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    };
  }, [desktop]);

  return (
    <section
      ref={sectionRef}
      aria-label="Together with love"
      // desktop: a short, restrained pin · mobile: plain scrolling band
      className="relative bg-ivory lg:h-[170vh]"
    >
      <div className="relative flex h-[68svh] items-center justify-center overflow-hidden lg:sticky lg:top-0 lg:h-screen">
        <canvas
          // remount when the breakpoint flips so the context matches its resolution cap
          key={desktop ? "d" : "m"}
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full"
        />
        <div className="relative px-6 text-center">
          <Reveal variant="heading">
            <p
              className="font-script text-forest"
              style={{
                fontSize: "clamp(3rem, 11vw, 8rem)",
                lineHeight: 1,
                textShadow: "0 0 24px #F8F7F3, 0 0 48px #F8F7F3, 0 0 6px #F8F7F3",
              }}
            >
              Together with love
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p
              className="eyebrow mt-5 inline-block rounded-full bg-ivory/85 px-4 py-2"
              style={{ backdropFilter: "blur(6px)" }}
            >
              {wedding.groom} <span className="text-champagne">&amp;</span> {wedding.bride}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
