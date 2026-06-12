// ============================================================
// Omsingh Rajput — Full Stack Portfolio
// React.js + Chart.js + Leaflet.js + PWA
// ES6+ | Responsive | Dark Futuristic Theme
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ─── DESIGN TOKENS ────────────────────────────────────────────
const T = {
  void: "#050813",
  navy: "#0A0F2E",
  panel: "#0D1440",
  blue: "#00D4FF",
  purple: "#8B5CF6",
  coral: "#FF6B6B",
  green: "#10B981",
  text: "#E2E8F0",
  muted: "#8892B0",
};

// ─── GLOBAL STYLES (injected once) ────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:#050813;color:#E2E8F0;font-family:'Inter',sans-serif;overflow-x:hidden;cursor:none}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:#050813}
  ::-webkit-scrollbar-thumb{background:linear-gradient(#00D4FF,#8B5CF6);border-radius:4px}
  #cursor{position:fixed;top:0;left:0;width:12px;height:12px;border-radius:50%;background:#00D4FF;
    pointer-events:none;z-index:9999;transform:translate(-50%,-50%);
    transition:transform .15s,background .2s,box-shadow .2s;
    box-shadow:0 0 24px rgba(0,212,255,.6)}
  #cursor.hov{transform:translate(-50%,-50%) scale(2.8);background:#8B5CF6;box-shadow:0 0 32px rgba(139,92,246,.7)}
  #cursor-ring{position:fixed;top:0;left:0;width:38px;height:38px;border-radius:50%;
    border:1.5px solid rgba(0,212,255,.45);pointer-events:none;z-index:9998;
    transform:translate(-50%,-50%);transition:transform .42s cubic-bezier(.23,1,.32,1)}
  #cursor-ring.hov{transform:translate(-50%,-50%) scale(1.9);border-color:rgba(139,92,246,.55)}
  .reveal{opacity:0;transform:translateY(36px);transition:opacity .85s cubic-bezier(.23,1,.32,1),transform .85s cubic-bezier(.23,1,.32,1)}
  .reveal.vis{opacity:1;transform:none}
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes barIn{from{width:0}to{width:var(--w)}}
  @keyframes scrollLine{0%,100%{transform:scaleY(1);opacity:1}50%{transform:scaleY(.4);opacity:.3}}
  @media(prefers-reduced-motion:reduce){
    *{animation-duration:.01ms!important;transition-duration:.01ms!important}
    .reveal{opacity:1;transform:none}
    #cursor,#cursor-ring{display:none!important}
    body{cursor:auto}
    canvas{display:none}
  }
`;

// ─── DATA ──────────────────────────────────────────────────────
const SKILLS_RADAR = [
  { skill: "React.js", value: 90 },
  { skill: "Node.js", value: 88 },
  { skill: "MongoDB", value: 85 },
  { skill: "Java", value: 82 },
  { skill: "REST APIs", value: 92 },
  { skill: "JWT/Auth", value: 85 },
  { skill: "Express.js", value: 88 },
  { skill: "DevOps", value: 78 },
];

const SKILL_BARS = [
  { name: "React.js / Frontend", pct: 90, color: "#00D4FF" },
  { name: "Node.js / Express.js", pct: 88, color: "#8B5CF6" },
  { name: "MongoDB / Atlas", pct: 85, color: "#10B981" },
  { name: "Java (Core + OOP)", pct: 82, color: "#F59E0B" },
  { name: "REST API Design", pct: 92, color: "#00D4FF" },
  { name: "JWT / RBAC", pct: 85, color: "#8B5CF6" },
  { name: "Leaflet.js / Maps", pct: 80, color: "#10B981" },
  { name: "Chart.js / Data Viz", pct: 82, color: "#F59E0B" },
];

const TECH_STACK = [
  { label: "Java", icon: "☕", color: "#F59E0B" },
  { label: "JavaScript ES6+", icon: "⚡", color: "#F7DF1E" },
  { label: "React.js", icon: "⚛️", color: "#00D4FF" },
  { label: "HTML5", icon: "🌐", color: "#E34C26" },
  { label: "CSS3", icon: "🎨", color: "#264DE4" },
  { label: "Leaflet.js", icon: "🗺️", color: "#199900" },
  { label: "Chart.js", icon: "📊", color: "#FF6384" },
  { label: "PWA", icon: "📱", color: "#5A0FC8" },
  { label: "Node.js", icon: "🟢", color: "#68A063" },
  { label: "Express.js", icon: "🚀", color: "#8B5CF6" },
  { label: "REST APIs", icon: "🔗", color: "#00D4FF" },
  { label: "JWT Auth", icon: "🔐", color: "#FF6B6B" },
  { label: "RBAC", icon: "🛡️", color: "#8B5CF6" },
  { label: "MongoDB", icon: "🍃", color: "#47A248" },
  { label: "MongoDB Atlas", icon: "☁️", color: "#47A248" },
  { label: "Git / GitHub", icon: "🐙", color: "#F0F0F0" },
  { label: "Netlify", icon: "🌊", color: "#00C7B7" },
  { label: "Render", icon: "🎯", color: "#46E3B7" },
  { label: "Postman", icon: "📮", color: "#FF6C37" },
];

const PROJECTS = [
  {
    id: 1,
    num: "01",
    title: "QuickBite",
    subtitle: "Full Stack Food Delivery Platform",
    desc: "Production-grade MERN food delivery app with 20+ REST API endpoints, JWT-based auth, role-based access control for customers/riders/admins, real-time GPS tracking via Leaflet.js, Chart.js admin analytics, coupon engine, loyalty points, multi-mode payments, AI food recommendations, and PWA support.",
    stack: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "JWT",
      "RBAC",
      "Leaflet.js",
      "Chart.js",
      "PWA",
      "REST APIs",
    ],
    accent: "#00D4FF",
    icon: "🍔",
    bg: "linear-gradient(135deg,#0A2540,#1A3A6A)",
    live: "#",
    github: "#",
    highlight: true,
    features: [
      "20+ REST Endpoints",
      "Real-time GPS Tracking",
      "JWT + RBAC Auth",
      "Admin Analytics Dashboard",
      "PWA + Dark/Light Mode",
    ],
  },
  {
    id: 2,
    num: "02",
    title: "Smart Healthcare Management",
    subtitle: "Digital Healthcare Platform",
    desc: "Digital healthcare platform managing patient records, appointment scheduling, and doctor profiles. Secure JWT authentication, optimised MongoDB Atlas schema for efficient patient data retrieval, RESTful API integration, and modular React component architecture.",
    stack: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "JWT",
      "REST APIs",
      "HTML5",
      "CSS3",
    ],
    accent: "#10B981",
    icon: "🏥",
    bg: "linear-gradient(135deg,#0D2515,#1A4D2E)",
    live: "#",
    github: "#",
    features: [
      "Patient Record Management",
      "JWT Secured Endpoints",
      "Appointment Scheduling",
      "Optimised DB Schema",
      "Modular React Components",
    ],
  },
];

// ─── LEAFLET MAP COMPONENT ─────────────────────────────────────
function LeafletMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => {
      const L = window.L;
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([18.5204, 73.8567], 11);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { attribution: "© OpenStreetMap © CARTO", maxZoom: 19 },
      ).addTo(map);

      const svgIcon = L.divIcon({
        html: `<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#00D4FF,#8B5CF6);display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 20px rgba(0,212,255,.6);border:2px solid rgba(0,212,255,.4)">📍</div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([18.5204, 73.8567], { icon: svgIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:'Space Grotesk',sans-serif;font-size:13px;color:#0A0F2E;font-weight:600">
          📍 Omsingh Rajput<br/>
          <span style="font-size:11px;color:#666">Pune, Maharashtra · Open to Relocate Pan-India</span>
        </div>`,
        )
        .openPopup();

      mapInstance.current = map;
    };
    document.head.appendChild(script);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "320px",
        borderRadius: "14px",
        border: "1px solid rgba(0,212,255,.2)",
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0,212,255,.1)",
      }}
    />
  );
}

// ─── CHART.JS SKILL DOUGHNUT ───────────────────────────────────
function ChartJsSkills() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
    script.onload = () => {
      if (!canvasRef.current) return;
      if (chartRef.current) chartRef.current.destroy();
      const ctx = canvasRef.current.getContext("2d");
      chartRef.current = new window.Chart(ctx, {
        type: "polarArea",
        data: {
          labels: [
            "React.js",
            "Node.js",
            "MongoDB",
            "Java",
            "REST API",
            "JWT/RBAC",
            "Leaflet.js",
            "Chart.js",
          ],
          datasets: [
            {
              data: [90, 88, 85, 82, 92, 85, 80, 82],
              backgroundColor: [
                "rgba(0,212,255,.35)",
                "rgba(139,92,246,.35)",
                "rgba(16,185,129,.35)",
                "rgba(245,158,11,.35)",
                "rgba(0,212,255,.5)",
                "rgba(139,92,246,.5)",
                "rgba(16,185,129,.5)",
                "rgba(255,99,132,.35)",
              ],
              borderColor: [
                "#00D4FF",
                "#8B5CF6",
                "#10B981",
                "#F59E0B",
                "#00D4FF",
                "#8B5CF6",
                "#10B981",
                "#FF6384",
              ],
              borderWidth: 1.5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#8892B0",
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                boxWidth: 12,
                padding: 14,
              },
            },
            tooltip: {
              callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}%` },
              backgroundColor: "rgba(13,20,64,.95)",
              borderColor: "rgba(0,212,255,.3)",
              borderWidth: 1,
              titleColor: "#00D4FF",
              bodyColor: "#E2E8F0",
              titleFont: { family: "'Space Grotesk',sans-serif" },
            },
          },
          scales: {
            r: {
              grid: { color: "rgba(255,255,255,.06)" },
              ticks: { display: false },
              min: 0,
              max: 100,
            },
          },
          animation: { duration: 1400, easing: "easeInOutQuart" },
        },
      });
    };
    document.head.appendChild(script);
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  return (
    <div style={{ height: "340px", position: "relative" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

// ─── CANVAS CODE RAIN ─────────────────────────────────────────
function CodeRainCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, cols, drops, raf;
    const CHARS = "01アイウエJavaReactNodeMERN{}[]()=>const let async await";
    function init() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      cols = Math.floor(W / 14);
      drops = Array.from({ length: cols }, () => (Math.random() * -H) / 14);
    }
    function draw() {
      ctx.fillStyle = "rgba(5,8,19,.07)";
      ctx.fillRect(0, 0, W, H);
      drops.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const alpha = Math.max(0, 1 - (y / (H / 14)) * 0.55);
        ctx.fillStyle = `rgba(0,212,255,${alpha * 0.75})`;
        ctx.font = `12px 'JetBrains Mono',monospace`;
        ctx.fillText(ch, i * 14, y * 14);
        if (y * 14 > H && Math.random() > 0.965) drops[i] = 0;
        else drops[i] += 0.38 + Math.random() * 0.3;
      });
      raf = requestAnimationFrame(draw);
    }
    init();
    draw();
    const ro = new ResizeObserver(init);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.5,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ─── ANIMATED SKILL BAR ────────────────────────────────────────
function SkillBar({ name, pct, color, visible }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 7,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: "0.78rem",
            color: T.muted,
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: "0.78rem",
            color,
          }}
        >
          {pct}%
        </span>
      </div>
      <div
        style={{
          background: "rgba(255,255,255,.06)",
          borderRadius: 4,
          height: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 4,
            background: `linear-gradient(90deg,${color},${color}99)`,
            width: visible ? `${pct}%` : "0%",
            transition: "width 1.3s cubic-bezier(.23,1,.32,1)",
          }}
        />
      </div>
    </div>
  );
}

// ─── REVEAL WRAPPER ────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(36px)",
        transition: `opacity .85s cubic-bezier(.23,1,.32,1) ${delay}ms, transform .85s cubic-bezier(.23,1,.32,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── TILT CARD ─────────────────────────────────────────────────
function TiltCard({ children, accent = T.blue }) {
  const ref = useRef(null);
  const glowRef = useRef(null);
  const handleMove = useCallback((e) => {
    const card = ref.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 11}deg) rotateX(${-y * 9}deg) translateZ(6px)`;
    if (glowRef.current) {
      glowRef.current.style.left = e.clientX - r.left - 80 + "px";
      glowRef.current.style.top = e.clientY - r.top - 80 + "px";
      glowRef.current.style.opacity = "0.4";
    }
  }, []);
  const handleLeave = useCallback(() => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }, []);
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        background: T.panel,
        border: `1px solid rgba(0,212,255,.13)`,
        borderRadius: 16,
        padding: "32px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "border-color .3s, box-shadow .3s",
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent + "66";
        e.currentTarget.style.boxShadow = `0 20px 60px ${accent}1A, 0 0 0 1px ${accent}22`;
      }}
    >
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: accent,
          filter: "blur(55px)",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity .4s",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ─── CONTACT FORM ──────────────────────────────────────────────
function ContactForm() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!fields.name.trim()) e.name = "Name is required.";
    if (
      !fields.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)
    )
      e.email = "Valid email required.";
    if (!fields.subject.trim()) e.subject = "Subject is required.";
    if (fields.message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleChange = (f, v) => {
    setFields((prev) => ({ ...prev, [f]: v }));
    if (errors[f]) setErrors((prev) => ({ ...prev, [f]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  const inputStyle = (f) => ({
    width: "100%",
    background: "rgba(255,255,255,.04)",
    border: `1.5px solid ${errors[f] ? T.coral : "rgba(0,212,255,.15)"}`,
    borderRadius: 8,
    padding: "13px 16px",
    color: T.text,
    fontFamily: "'Inter',sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    resize: "none",
    transition: "border-color .2s, box-shadow .2s",
  });

  if (sent)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 32px",
          background: "rgba(16,185,129,.07)",
          border: "1px solid rgba(16,185,129,.25)",
          borderRadius: 14,
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>✅</div>
        <h4
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "1.3rem",
            color: T.green,
            marginBottom: 8,
          }}
        >
          Message received!
        </h4>
        <p style={{ color: T.muted, fontSize: ".9rem" }}>
          Thanks for reaching out — I'll reply within 24 hours.
        </p>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {[
        { f: "name", label: "NAME", type: "text", ph: "Your name" },
        { f: "email", label: "EMAIL", type: "email", ph: "your@email.com" },
        {
          f: "subject",
          label: "SUBJECT",
          type: "text",
          ph: "Job opportunity / Collaboration...",
        },
      ].map(({ f, label, type, ph }) => (
        <div key={f} style={{ marginBottom: 18 }}>
          <label
            style={{
              display: "block",
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: ".73rem",
              letterSpacing: ".12em",
              color: T.muted,
              marginBottom: 7,
            }}
          >
            {label}
          </label>
          <input
            type={type}
            placeholder={ph}
            value={fields[f]}
            onChange={(e) => handleChange(f, e.target.value)}
            style={inputStyle(f)}
            onFocus={(e) => {
              e.target.style.borderColor = T.blue;
              e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,.08)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors[f]
                ? T.coral
                : "rgba(0,212,255,.15)";
              e.target.style.boxShadow = "none";
            }}
          />
          {errors[f] && (
            <div
              style={{
                fontSize: ".73rem",
                color: T.coral,
                marginTop: 5,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {errors[f]}
            </div>
          )}
        </div>
      ))}
      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            display: "block",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: ".73rem",
            letterSpacing: ".12em",
            color: T.muted,
            marginBottom: 7,
          }}
        >
          MESSAGE
        </label>
        <textarea
          rows={5}
          placeholder="Tell me about the project or role..."
          value={fields.message}
          onChange={(e) => handleChange("message", e.target.value)}
          style={{ ...inputStyle("message") }}
          onFocus={(e) => {
            e.target.style.borderColor = T.blue;
            e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,.08)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.message
              ? T.coral
              : "rgba(0,212,255,.15)";
            e.target.style.boxShadow = "none";
          }}
        />
        {errors.message && (
          <div
            style={{
              fontSize: ".73rem",
              color: T.coral,
              marginTop: 5,
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {errors.message}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: 8,
          border: "none",
          background: loading
            ? "rgba(0,212,255,.3)"
            : "linear-gradient(135deg,#00D4FF,#8B5CF6)",
          color: "#fff",
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: ".95rem",
          fontWeight: 700,
          letterSpacing: ".04em",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "transform .2s, box-shadow .2s, background .2s",
          boxShadow: loading ? "none" : "0 4px 32px rgba(0,212,255,.3)",
        }}
      >
        {loading ? "Sending..." : "Send Message →"}
      </button>
    </form>
  );
}

// ─── BACKEND SHOWCASE ─────────────────────────────────────────
// This section visually demonstrates the Node.js/Express/JWT/RBAC
// backend architecture that powers the portfolio projects
function BackendShowcase() {
  const [activeTab, setActiveTab] = useState("routes");
  const tabs = {
    routes: {
      label: "REST Routes",
      code: `// Express.js REST API — QuickBite Backend
// Node.js + Express + JWT + RBAC + MongoDB Atlas

import express from 'express';
import { authenticate, authorize } from './middleware/auth.js';

const router = express.Router();

// ── PUBLIC ROUTES ──────────────────────────────
// GET  /api/v1/menu          — browse restaurant menu
// POST /api/v1/auth/register — create account
// POST /api/v1/auth/login    — returns signed JWT

// ── CUSTOMER ROUTES (JWT required) ─────────────
router.get('/orders',        authenticate,                    getMyOrders);
router.post('/orders',       authenticate,                    placeOrder);
router.get('/orders/:id/track', authenticate,                trackOrder);  // Leaflet.js GPS

// ── RIDER ROUTES (JWT + role: rider) ───────────
router.get('/deliveries',    authenticate, authorize('rider'), getAssigned);
router.put('/deliveries/:id/location', authenticate, authorize('rider'), updateGPS);

// ── ADMIN ROUTES (JWT + role: admin) ───────────
router.get('/analytics',     authenticate, authorize('admin'), getDashboard);
router.get('/users',         authenticate, authorize('admin'), getAllUsers);
router.post('/menu',         authenticate, authorize('admin'), createMenuItem);
router.put('/menu/:id',      authenticate, authorize('admin'), updateMenuItem);
router.delete('/menu/:id',   authenticate, authorize('admin'), deleteMenuItem);
router.get('/export/csv',    authenticate, authorize('admin'), exportCSV);

export default router;`,
    },
    auth: {
      label: "JWT + RBAC",
      code: `// middleware/auth.js — JWT Authentication + Role-Based Access Control

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token from Authorization header
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Access denied. No token.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ error: 'User not found.' });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Role-Based Access Control — pass allowed roles
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: \`Access forbidden: requires role [\${roles.join(', ')}]\`
    });
  }
  next();
};

// Usage: router.get('/admin/stats', authenticate, authorize('admin'), handler);
// Roles: 'customer' | 'rider' | 'admin'`,
    },
    schema: {
      label: "MongoDB Schema",
      code: `// models/Order.js — MongoDB Atlas Schema (Mongoose)

import mongoose from 'mongoose';

const gpsCoordSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  riderId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name:       String,
    qty:        Number,
    price:      Number,
  }],
  status:   { type: String, enum: ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'], default: 'pending' },
  payment:  { type: String, enum: ['upi','card','cash'], required: true },
  couponCode:     String,
  discountAmount: { type: Number, default: 0 },
  loyaltyPoints:  { type: Number, default: 0 },
  riderLocation:  gpsCoordSchema,        // Leaflet.js polls this every 15s
  deliveryAddress: {
    street: String, city: String, pincode: String,
    coordinates: gpsCoordSchema,
  },
  scheduledAt: Date,
  totalAmount: { type: Number, required: true },
  createdAt:   { type: Date, default: Date.now },
}, { timestamps: true });

orderSchema.index({ customerId: 1, createdAt: -1 }); // optimised retrieval
orderSchema.index({ riderId: 1, status: 1 });

export default mongoose.model('Order', orderSchema);`,
    },
  };

  return (
    <div
      style={{
        background: T.panel,
        border: "1px solid rgba(0,212,255,.15)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Tab Bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(0,212,255,.1)",
          background: "rgba(0,0,0,.3)",
        }}
      >
        <div style={{ display: "flex", gap: 0, padding: "0 16px" }}>
          {Object.entries(tabs).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: "14px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: ".78rem",
                letterSpacing: ".06em",
                color: activeTab === key ? T.blue : T.muted,
                borderBottom:
                  activeTab === key
                    ? `2px solid ${T.blue}`
                    : "2px solid transparent",
                transition: "color .2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 6,
          }}
        >
          {["#FF5F56", "#FFBD2E", "#27C93F"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>
      </div>
      {/* Code */}
      <pre
        style={{
          padding: "28px 32px",
          overflowX: "auto",
          margin: 0,
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: ".78rem",
          lineHeight: 1.75,
          color: "#CDD6F4",
          background: "transparent",
          maxHeight: 400,
        }}
      >
        <code
          dangerouslySetInnerHTML={{
            __html: syntaxHighlight(tabs[activeTab].code),
          }}
        />
      </pre>
    </div>
  );
}

function syntaxHighlight(code) {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /(\/\/.*)/g,
      '<span style="color:#6272A4;font-style:italic">$1</span>',
    )
    .replace(
      /('(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
      '<span style="color:#F1FA8C">$1</span>',
    )
    .replace(
      /\b(import|export|from|const|let|var|async|await|return|if|else|try|catch|new|default)\b/g,
      '<span style="color:#FF79C6">$1</span>',
    )
    .replace(
      /\b(router|mongoose|jwt|User|Order)\b/g,
      '<span style="color:#8BE9FD">$1</span>',
    )
    .replace(
      /\.(get|post|put|delete|json|findById|verify|index|select)\b/g,
      '.<span style="color:#50FA7B">$1</span>',
    )
    .replace(
      /\b(true|false|null|undefined)\b/g,
      '<span style="color:#BD93F9">$1</span>',
    )
    .replace(/\b(\d+)\b/g, '<span style="color:#BD93F9">$1</span>');
}

// ─── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroVis, setHeroVis] = useState(false);
  const [barsVis, setBarsVis] = useState(false);
  const barsRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const mx = useRef(0),
    my = useRef(0),
    rx = useRef(0),
    ry = useRef(0);

  // Inject global CSS
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    // PWA manifest
    const manifest = {
      name: "Omsingh Rajput Portfolio",
      short_name: "OR Portfolio",
      start_url: "/",
      display: "standalone",
      background_color: "#050813",
      theme_color: "#00D4FF",
      icons: [
        {
          src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
          sizes: "512x512",
          type: "image/svg+xml",
        },
      ],
    };
    const blob = new Blob([JSON.stringify(manifest)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = url;
    document.head.appendChild(link);
    // meta theme-color
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#00D4FF";
    document.head.appendChild(meta);
    setTimeout(() => setHeroVis(true), 100);
    return () => {
      el.remove();
    };
  }, []);

  // Cursor
  useEffect(() => {
    const cur = document.getElementById("cursor");
    const ring = document.getElementById("cursor-ring");
    let rafId;
    const move = (e) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      if (cur) {
        cur.style.left = e.clientX + "px";
        cur.style.top = e.clientY + "px";
      }
    };
    const animate = () => {
      rx.current += (mx.current - rx.current) * 0.13;
      ry.current += (my.current - ry.current) * 0.13;
      if (ring) {
        ring.style.left = rx.current + "px";
        ring.style.top = ry.current + "px";
      }
      rafId = requestAnimationFrame(animate);
    };
    document.addEventListener("mousemove", move);
    animate();
    return () => {
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Hover class on cursor
  const addHov = useCallback(() => {
    document.getElementById("cursor")?.classList.add("hov");
    document.getElementById("cursor-ring")?.classList.add("hov");
  }, []);
  const remHov = useCallback(() => {
    document.getElementById("cursor")?.classList.remove("hov");
    document.getElementById("cursor-ring")?.classList.remove("hov");
  }, []);

  // Scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bars observer
  useEffect(() => {
    if (!barsRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setBarsVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(barsRef.current);
    return () => obs.disconnect();
  }, []);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#backend", label: "Backend" },
    { href: "#contact", label: "Contact" },
  ];

  // Shared styles
  const S = {
    section: { maxWidth: 1200, margin: "0 auto", padding: "100px 40px" },
    sectionLabel: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: ".75rem",
      color: T.blue,
      letterSpacing: ".2em",
      textTransform: "uppercase",
      marginBottom: 12,
    },
    sectionTitle: (size = "clamp(2rem,4vw,3rem)") => ({
      fontFamily: "'Space Grotesk',sans-serif",
      fontSize: size,
      fontWeight: 700,
      letterSpacing: "-.02em",
      marginBottom: 48,
      lineHeight: 1.15,
    }),
    gradText: {
      background: "linear-gradient(135deg,#00D4FF,#8B5CF6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    panel: {
      background: T.panel,
      border: "1px solid rgba(0,212,255,.13)",
      borderRadius: 16,
      padding: 32,
    },
    mono: { fontFamily: "'JetBrains Mono',monospace" },
    divider: { borderTop: "1px solid rgba(0,212,255,.1)", margin: "0 40px" },
    btnPrimary: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "14px 32px",
      borderRadius: 8,
      background: "linear-gradient(135deg,#00D4FF,#8B5CF6)",
      color: "#fff",
      fontFamily: "'Space Grotesk',sans-serif",
      fontSize: ".95rem",
      fontWeight: 700,
      letterSpacing: ".04em",
      textDecoration: "none",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 4px 32px rgba(0,212,255,.3)",
      transition: "transform .2s, box-shadow .3s",
    },
    btnOutline: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "14px 32px",
      borderRadius: 8,
      background: "transparent",
      color: T.text,
      fontFamily: "'Space Grotesk',sans-serif",
      fontSize: ".95rem",
      fontWeight: 700,
      letterSpacing: ".04em",
      textDecoration: "none",
      border: "1.5px solid rgba(0,212,255,.2)",
      cursor: "pointer",
      transition: "border-color .2s, color .2s, transform .2s",
    },
  };

  return (
    <div style={{ minHeight: "100vh", background: T.void }}>
      {/* Cursor Divs */}
      <div id="cursor" />
      <div id="cursor-ring" />

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "18px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrolled ? "rgba(5,8,19,.75)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(0,212,255,.12)"
            : "1px solid transparent",
          transition: "all .4s",
        }}
      >
        <div
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            ...S.gradText,
          }}
        >
          OR.
        </div>
        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: 28, listStyle: "none" }}>
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onMouseEnter={addHov}
              onMouseLeave={remHov}
              style={{
                fontSize: ".875rem",
                fontWeight: 500,
                color: T.muted,
                textDecoration: "none",
                letterSpacing: ".05em",
                transition: "color .2s",
              }}
              onMouseOver={(e) => (e.target.style.color = T.blue)}
              onMouseOut={(e) => (e.target.style.color = T.muted)}
            >
              {label}
            </a>
          ))}
        </nav>
        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            flexDirection: "column",
            gap: 5,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
          }}
          className="hamburger-btn"
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 24,
                height: 2,
                background: T.text,
                borderRadius: 2,
                display: "block",
              }}
            />
          ))}
        </button>
      </header>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: 260,
            height: "100vh",
            background: "rgba(10,15,46,.97)",
            backdropFilter: "blur(20px)",
            zIndex: 99,
            padding: "80px 32px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: T.text,
                textDecoration: "none",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,.06) 0%, transparent 70%)`,
        }}
      >
        <CodeRainCanvas />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: 880,
            padding: "0 24px",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#00D4FF,#8B5CF6)",
              padding: 3,
              margin: "0 auto 36px",
              opacity: heroVis ? 1 : 0,
              transform: heroVis ? "none" : "translateY(28px)",
              transition: "all .9s cubic-bezier(.23,1,.32,1) .4s",
              animation: heroVis
                ? "float 4s ease-in-out infinite 1.5s"
                : "none",
            }}
          >
            {/* ── PROFILE PICTURE ──────────────────────────────────
                To add your photo:
                  1. Place your image at: frontend/public/profile.jpg
                     (or .png / .webp — any format works)
                  2. Replace the `src` below with "/profile.jpg"
                  3. The <img> will fill the circle automatically.
                  4. Remove the fallback <div> showing "OR" once you
                     have a real photo.
            ─────────────────────────────────────────────────────── */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: T.panel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "2.5rem",
                fontWeight: 700,
                color: T.blue,
              }}
            >
              {/* OPTION A — no photo yet (shows initials) */}

              {/* OPTION B — uncomment below and set your photo path: */}
              {
                <img
                  src="/profile.jpg"
                  alt="Omsingh Rajput"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              }
            </div>
          </div>

          <p
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: ".78rem",
              color: T.blue,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              marginBottom: 18,
              opacity: heroVis ? 1 : 0,
              transform: heroVis ? "none" : "translateY(28px)",
              transition: "all .9s .5s",
            }}
          >
            // Java Full Stack Developer
          </p>
          <h1
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "clamp(3rem,8vw,6.5rem)",
              fontWeight: 700,
              letterSpacing: "-.02em",
              lineHeight: 1.05,
              opacity: heroVis ? 1 : 0,
              transform: heroVis ? "none" : "translateY(28px)",
              transition: "all .9s .65s",
            }}
          >
            Omsingh <span style={S.gradText}>Rajput</span>
          </h1>
          <p
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "clamp(1rem,2.2vw,1.45rem)",
              color: T.muted,
              margin: "12px 0 24px",
              letterSpacing: ".01em",
              opacity: heroVis ? 1 : 0,
              transform: heroVis ? "none" : "translateY(28px)",
              transition: "all .9s .8s",
            }}
          >
            React.js · Node.js · Express.js · MongoDB Atlas · JWT · REST APIs
          </p>
          <p
            style={{
              fontSize: "clamp(.9rem,1.4vw,1.05rem)",
              color: T.muted,
              maxWidth: 580,
              margin: "0 auto 42px",
              lineHeight: 1.75,
              opacity: heroVis ? 1 : 0,
              transform: heroVis ? "none" : "translateY(28px)",
              transition: "all .9s .95s",
            }}
          >
            I build production-grade web applications — from pixel-perfect React
            UIs and real-time Leaflet.js maps to scalable Express APIs secured
            with JWT & RBAC. Immediate joiner, open pan-India.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
              opacity: heroVis ? 1 : 0,
              transform: heroVis ? "none" : "translateY(28px)",
              transition: "all .9s 1.1s",
            }}
          >
            <a
              href="#projects"
              style={S.btnPrimary}
              onMouseEnter={addHov}
              onMouseLeave={remHov}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "translateY(-3px)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
            >
              View Work →
            </a>
            <a
              href="#contact"
              style={S.btnOutline}
              onMouseEnter={addHov}
              onMouseLeave={remHov}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = T.blue;
                e.currentTarget.style.color = T.blue;
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,.2)";
                e.currentTarget.style.color = T.text;
                e.currentTarget.style.transform = "none";
              }}
            >
              Contact Me
            </a>
            {/* ── DOWNLOAD RESUME BUTTON ── */}
            <a
              href="/Omsingh_Rajput_Resume.pdf"
              download="Omsingh_Rajput_Resume.pdf"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 8,
                background: "transparent",
                color: T.green,
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: ".95rem",
                fontWeight: 700,
                letterSpacing: ".04em",
                textDecoration: "none",
                border: `1.5px solid ${T.green}55`,
                cursor: "pointer",
                transition:
                  "border-color .2s, color .2s, transform .2s, box-shadow .2s",
              }}
              onMouseEnter={addHov}
              onMouseLeave={remHov}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = T.green;
                e.currentTarget.style.boxShadow = `0 0 24px ${T.green}40`;
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = `${T.green}55`;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              ↓ Resume
            </a>
          </div>
        </div>
        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: heroVis ? 1 : 0,
            transition: "opacity 1s 1.6s",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: ".68rem",
              letterSpacing: ".15em",
              color: T.muted,
              textTransform: "uppercase",
            }}
          ></span>
          <div
            style={{
              width: 1,
              height: 48,
              background: `linear-gradient(${T.blue},transparent)`,
              animation: "scrollLine 2s infinite",
            }}
          />
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────── */}
      <div style={S.divider} />
      <section id="about" style={S.section}>
        <Reveal>
          <p style={S.sectionLabel}>// About</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 style={S.sectionTitle()}>
            Crafting code that <span style={S.gradText}>ships & scales</span>
          </h2>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "start",
          }}
        >
          <Reveal delay={120} style={{}}>
            <h3
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1.3rem",
                marginBottom: 18,
              }}
            >
              Who I am
            </h3>
            {[
              "I'm a Computer Science graduate (B.E., 2025) who builds end-to-end web products. My sweet spot is where a clean React UI meets a well-architected Express.js backend — where real product decisions happen.",
              "I shipped QuickBite, a full-stack MERN food delivery platform with 20+ REST endpoints, JWT-based authentication, role-based access control, real-time GPS tracking with Leaflet.js, Chart.js admin analytics, and AI food recommendations — zero to production on Netlify + Render.",
              "When I'm not writing code, you'll find me on a volleyball court, thinking three moves ahead in chess, or editing video.",
            ].map((p, i) => (
              <p
                key={i}
                style={{
                  color: T.muted,
                  lineHeight: 1.8,
                  marginBottom: 16,
                  fontSize: ".975rem",
                }}
              >
                {p}
              </p>
            ))}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 9,
                marginTop: 28,
              }}
            >
              {TECH_STACK.map(({ label, icon, color }) => (
                <span
                  key={label}
                  onMouseEnter={addHov}
                  onMouseLeave={remHov}
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: ".72rem",
                    padding: "5px 12px",
                    borderRadius: 20,
                    border: "1px solid rgba(0,212,255,.15)",
                    color: T.muted,
                    cursor: "default",
                    transition: "border-color .2s, color .2s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = color;
                    e.target.style.color = color;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = "rgba(0,212,255,.15)";
                    e.target.style.color = T.muted;
                  }}
                >
                  {icon} {label}
                </span>
              ))}
            </div>
          </Reveal>
          {/* Leaflet Map */}
          <Reveal delay={200}>
            <h3
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1.1rem",
                marginBottom: 16,
                color: T.muted,
              }}
            >
              📍 Based in Pune · Open Pan-India
            </h3>
            <LeafletMap />
            <div
              style={{
                marginTop: 20,
                padding: "16px 20px",
                background: "rgba(0,212,255,.05)",
                borderRadius: 10,
                border: "1px solid rgba(0,212,255,.12)",
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: ".75rem",
                  color: T.muted,
                }}
              >
                <span style={{ color: T.blue }}>Status:</span> Immediate Joiner
                &nbsp;·&nbsp;
                <span style={{ color: T.green }}>●</span> Available Now
                &nbsp;·&nbsp; Open to Relocate
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SKILLS ──────────────────────────────────────────── */}
      <div style={S.divider} />
      <section id="skills" style={S.section}>
        <Reveal>
          <p style={S.sectionLabel}>// Skills & Expertise</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 style={S.sectionTitle()}>
            Full Stack <span style={S.gradText}>Toolbelt</span>
          </h2>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          {/* Skill bars */}
          <Reveal delay={100}>
            <div ref={barsRef} style={{ ...S.panel }}>
              <h3
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "1.1rem",
                  marginBottom: 28,
                }}
              >
                Proficiency Levels
              </h3>
              {SKILL_BARS.map((s) => (
                <SkillBar key={s.name} {...s} visible={barsVis} />
              ))}
            </div>
          </Reveal>
          {/* Chart.js polar area */}
          <Reveal delay={180}>
            <div style={{ ...S.panel }}>
              <h3
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "1.1rem",
                  marginBottom: 24,
                }}
              >
                Skill Radar{" "}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: ".7rem",
                    color: T.muted,
                  }}
                >
                  (Chart.js · Polar Area)
                </span>
              </h3>
              <ChartJsSkills />
            </div>
          </Reveal>
        </div>
        {/* Recharts Radar (bonus — shows React charting skill) */}
        <Reveal delay={240} style={{ marginTop: 28 }}>
          <div style={{ ...S.panel }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1.1rem",
                marginBottom: 8,
              }}
            >
              Full Stack Balance{" "}
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: ".7rem",
                  color: T.muted,
                }}
              >
                (Recharts · Radar)
              </span>
            </h3>
            <p style={{ fontSize: ".82rem", color: T.muted, marginBottom: 24 }}>
              Frontend ↔ Backend ↔ Database depth across the stack
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={SKILLS_RADAR} outerRadius={110}>
                <PolarGrid stroke="rgba(255,255,255,.07)" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11,
                    fill: T.muted,
                  }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Proficiency"
                  dataKey="value"
                  stroke="#00D4FF"
                  fill="#00D4FF"
                  fillOpacity={0.18}
                  strokeWidth={2}
                  dot={{ fill: "#00D4FF", r: 4 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(13,20,64,.95)",
                    border: "1px solid rgba(0,212,255,.3)",
                    borderRadius: 8,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: ".8rem",
                  }}
                  itemStyle={{ color: T.blue }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>
      </section>

      {/* ── PROJECTS ────────────────────────────────────────── */}
      <div style={S.divider} />
      <section id="projects" style={S.section}>
        <Reveal>
          <p style={S.sectionLabel}>// Projects</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 style={S.sectionTitle()}>
            Built to <span style={S.gradText}>impress</span>
          </h2>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
            gap: 28,
          }}
        >
          {PROJECTS.map((proj, idx) => (
            <Reveal key={proj.id} delay={idx * 140}>
              <TiltCard accent={proj.accent}>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: ".73rem",
                    color: proj.accent,
                    letterSpacing: ".14em",
                    marginBottom: 18,
                    opacity: 0.65,
                  }}
                >
                  {proj.num} {proj.highlight ? "/ Featured" : "/ Full Stack"}
                </div>
                {/* Thumbnail */}
                <div
                  style={{
                    height: 170,
                    borderRadius: 10,
                    background: proj.bg,
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3.5rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ animation: "float 3s ease-in-out infinite" }}>
                    {proj.icon}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {proj.title}
                </h3>
                <p
                  style={{
                    fontSize: ".8rem",
                    color: proj.accent,
                    fontFamily: "'JetBrains Mono',monospace",
                    marginBottom: 12,
                  }}
                >
                  {proj.subtitle}
                </p>
                <p
                  style={{
                    fontSize: ".875rem",
                    color: T.muted,
                    lineHeight: 1.7,
                    marginBottom: 20,
                  }}
                >
                  {proj.desc}
                </p>
                {/* Feature list */}
                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                    marginBottom: 22,
                  }}
                >
                  {proj.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: ".82rem",
                        color: T.muted,
                      }}
                    >
                      <span style={{ color: proj.accent, fontSize: ".7rem" }}>
                        ▸
                      </span>{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                {/* Stack tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 7,
                    marginBottom: 24,
                  }}
                >
                  {proj.stack.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: ".68rem",
                        padding: "4px 11px",
                        borderRadius: 20,
                        background: `${proj.accent}14`,
                        border: `1px solid ${proj.accent}33`,
                        color: proj.accent,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <a
                    href={proj.live}
                    onMouseEnter={addHov}
                    onMouseLeave={remHov}
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: ".85rem",
                      fontWeight: 700,
                      color: proj.accent,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      transition: "gap .2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.gap = "10px")}
                    onMouseOut={(e) => (e.currentTarget.style.gap = "5px")}
                  >
                    Live Demo →
                  </a>
                  <a
                    href={proj.github}
                    onMouseEnter={addHov}
                    onMouseLeave={remHov}
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: ".85rem",
                      fontWeight: 600,
                      color: T.muted,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      transition: "color .2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = T.text)}
                    onMouseOut={(e) => (e.currentTarget.style.color = T.muted)}
                  >
                    GitHub ↗
                  </a>
                </div>
              </TiltCard>
            </Reveal>
          ))}
          {/* Coming soon card */}
          <Reveal delay={280}>
            <div
              style={{
                ...S.panel,
                border: "1px dashed rgba(0,212,255,.15)",
                opacity: 0.65,
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: ".73rem",
                  color: T.muted,
                  letterSpacing: ".14em",
                  marginBottom: 18,
                }}
              >
                03 / Coming Soon
              </div>
              <div
                style={{
                  height: 170,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#1a0a2e,#2d1055)",
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                }}
              >
                ⏳
              </div>
              <h3
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "1.2rem",
                  color: T.muted,
                  marginBottom: 8,
                }}
              >
                Next Project
              </h3>
              <p
                style={{ fontSize: ".875rem", color: T.muted, lineHeight: 1.7 }}
              >
                Currently building something new with Java Spring Boot + React.
                Check back soon or reach out to collaborate.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BACKEND SHOWCASE ────────────────────────────────── */}
      <div style={S.divider} />
      <section id="backend" style={S.section}>
        <Reveal>
          <p style={S.sectionLabel}>// Backend Architecture</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 style={S.sectionTitle()}>
            Node.js · Express ·{" "}
            <span style={S.gradText}>JWT · RBAC · MongoDB</span>
          </h2>
        </Reveal>
        <p
          style={{
            color: T.muted,
            fontSize: ".975rem",
            lineHeight: 1.75,
            maxWidth: 700,
            marginBottom: 48,
          }}
        >
          Every project I build has a production-grade backend. Here's the
          actual architecture powering QuickBite — REST routes, JWT
          authentication middleware, role-based access control, and optimised
          MongoDB Atlas schemas.
        </p>
        <Reveal delay={120}>
          <BackendShowcase />
        </Reveal>
        {/* Backend tech grid */}
        <Reveal delay={200} style={{ marginTop: 32 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 16,
            }}
          >
            {[
              {
                icon: "🚀",
                title: "Express.js",
                desc: "RESTful API with middleware chains, error handling, and rate limiting.",
              },
              {
                icon: "🔐",
                title: "JWT Auth",
                desc: "Stateless authentication with access & refresh token rotation.",
              },
              {
                icon: "🛡️",
                title: "RBAC",
                desc: "Role-based guards for Customer · Rider · Admin access layers.",
              },
              {
                icon: "🍃",
                title: "MongoDB Atlas",
                desc: "Cloud-native NoSQL with optimised indexes and aggregation pipelines.",
              },
            ].map(({ icon, title, desc }) => (
              <TiltCard key={title} accent={T.purple}>
                <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>
                  {icon}
                </div>
                <h4
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {title}
                </h4>
                <p
                  style={{
                    fontSize: ".82rem",
                    color: T.muted,
                    lineHeight: 1.6,
                  }}
                >
                  {desc}
                </p>
              </TiltCard>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────── */}
      <div style={S.divider} />
      <section id="contact" style={{ ...S.section, maxWidth: 960 }}>
        <Reveal>
          <p style={S.sectionLabel}>// Contact</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 style={S.sectionTitle()}>
            Let's <span style={S.gradText}>build</span> together
          </h2>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 64,
            alignItems: "start",
          }}
        >
          <Reveal delay={100}>
            <h3
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1.25rem",
                marginBottom: 14,
              }}
            >
              Get in touch
            </h3>
            <p
              style={{
                color: T.muted,
                fontSize: ".925rem",
                lineHeight: 1.75,
                marginBottom: 32,
              }}
            >
              I'm actively seeking full-time roles as a Java / Full Stack
              Developer. Whether you have an open position, a freelance project,
              or just want to talk code — my inbox is open.
            </p>
            {[
              {
                icon: "✉️",
                label: "omsingrajput05@gmail.com",
                href: "mailto:omsingrajput05@gmail.com",
              },
              {
                icon: "📞",
                label: "+91 70387 06978",
                href: "tel:+917038706978",
              },
              {
                icon: "📍",
                label: "Pune, Maharashtra · Open Pan-India",
                href: null,
              },
            ].map(({ icon, label, href }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                  fontSize: ".875rem",
                  color: T.muted,
                }}
              >
                <span style={{ fontSize: "1rem" }}>{icon}</span>
                {href ? (
                  <a
                    href={href}
                    onMouseEnter={addHov}
                    onMouseLeave={remHov}
                    style={{
                      color: T.muted,
                      textDecoration: "none",
                      transition: "color .2s",
                    }}
                    onMouseOver={(e) => (e.target.style.color = T.blue)}
                    onMouseOut={(e) => (e.target.style.color = T.muted)}
                  >
                    {label}
                  </a>
                ) : (
                  <span>{label}</span>
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              {[
                {
                  icon: "💼",
                  label: "LinkedIn",
                  href: "https://linkedin.com/in/omsingh-rajput",
                },
                {
                  icon: "🐙",
                  label: "GitHub",
                  href: "https://github.com/Omsingh5",
                },
                {
                  icon: "✉️",
                  label: "Email",
                  href: "mailto:omsingrajput05@gmail.com",
                },
                {
                  icon: "📄",
                  label: "Resume",
                  href: "/Omsingh_Rajput_Resume.pdf",
                  download: "Omsingh_Rajput_Resume.pdf",
                },
              ].map(({ icon, label, href, download }) => (
                <a
                  key={label}
                  href={href}
                  download={download}
                  target={download ? undefined : "_blank"}
                  rel={download ? undefined : "noreferrer"}
                  onMouseEnter={addHov}
                  onMouseLeave={remHov}
                  title={label}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(0,212,255,.18)",
                    fontSize: "1.1rem",
                    textDecoration: "none",
                    transition:
                      "border-color .2s, box-shadow .2s, transform .2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = T.blue;
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(0,212,255,.3)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,212,255,.18)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div style={S.panel}>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <div style={S.divider} />
      <footer
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: ".73rem",
            color: T.muted,
          }}
        >
          © 2025 <span style={{ color: T.blue }}>Omsingh Rajput</span> · Built
          with React.js + Node.js + MongoDB · Deployed on Netlify
        </p>
        <nav style={{ display: "flex", gap: 24 }}>
          {["#about", "#skills", "#projects", "#backend", "#contact"].map(
            (href) => (
              <a
                key={href}
                href={href}
                onMouseEnter={addHov}
                onMouseLeave={remHov}
                style={{
                  fontSize: ".8rem",
                  color: T.muted,
                  textDecoration: "none",
                  transition: "color .2s",
                }}
                onMouseOver={(e) => (e.target.style.color = T.blue)}
                onMouseOut={(e) => (e.target.style.color = T.muted)}
              >
                {href.slice(1)}
              </a>
            ),
          )}
        </nav>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @media(max-width:900px){
          .two-col{grid-template-columns:1fr!important}
        }
        @media(max-width:700px){
          header{padding:14px 18px!important}
          header nav{display:none!important}
          header button.hamburger-btn{display:flex!important}
          section{padding:64px 18px!important}
          footer{padding:28px 18px!important;flex-direction:column;text-align:center}
        }
      `}</style>
    </div>
  );
}
