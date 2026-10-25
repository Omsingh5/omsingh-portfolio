// ============================================================
// Omsingh Rajput — Software Developer Portfolio
// React.js + Chart.js + Leaflet.js + PWA
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
  }
`;

// ─── DATA ──────────────────────────────────────────────────────
const SKILLS_RADAR = [
  { skill: "Java", value: 88 },
  { skill: "Spring Boot", value: 86 },
  { skill: "React.js", value: 84 },
  { skill: "Node.js", value: 82 },
  { skill: "REST APIs", value: 90 },
  { skill: "MySQL", value: 84 },
  { skill: "MongoDB", value: 80 },
  { skill: "JWT / Security", value: 86 },
];

const SKILL_BARS = [
  { name: "Java", pct: 88, color: "#F59E0B" },
  { name: "Spring Boot", pct: 86, color: "#10B981" },
  { name: "React.js", pct: 84, color: "#00D4FF" },
  { name: "Node.js / Express.js", pct: 82, color: "#8B5CF6" },
  { name: "REST APIs", pct: 90, color: "#00D4FF" },
  { name: "MySQL / JPA / Hibernate", pct: 84, color: "#10B981" },
  { name: "MongoDB", pct: 80, color: "#47A248" },
  { name: "JWT / Spring Security", pct: 86, color: "#8B5CF6" },
];

const SKILL_GROUPS = [
  {
    title: "Languages",
    items: ["Java", "JavaScript (ES6+)", "Python", "SQL"],
  },
  {
    title: "Web & Frontend",
    items: ["React.js", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    title: "Backend & Databases",
    items: [
      "Spring Boot",
      "Node.js",
      "Express.js",
      "REST APIs",
      "Spring Security",
      "Spring Data JPA",
      "Hibernate",
      "MongoDB",
      "MySQL",
    ],
  },
  {
    title: "Tools, Cloud & Practices",
    items: [
      "Git",
      "GitHub",
      "Postman",
      "Docker",
      "Kubernetes",
      "AWS",
      "Maven",
      "JWT",
      "RBAC",
    ],
  },
];

const EXPERIENCE = [
  {
    role: "Software Developer Intern",
    org: "SevenMentor & Training Pvt. Ltd.",
    place: "Pune",
    points: [
      "Contributed to ProofNexa AI, an AI-powered recruitment and career management system, on the development team.",
      "Developed backend features with Java, Spring Boot, Spring Security, Spring Data JPA, and Hibernate, and exposed REST APIs backed by MySQL and H2.",
      "Built React.js screens with JavaScript, HTML5, and CSS3 and connected them to the backend APIs.",
      "Applied JWT authentication and integrated the Google Gemini API for AI-assisted recruitment and career workflows.",
      "Used Apache Maven, Git, and GitHub for builds and version control.",
    ],
  },
  {
    role: "Software Developer Intern",
    org: "Triroop Techconsult Pvt. Ltd.",
    place: "",
    points: [
      "Completed a software developer internship, working on assigned development tasks through the program.",
      "The internship certificate notes technical proficiency, sound judgement, and consistent delivery.",
    ],
  },
];

const PROJECTS = [
  {
    id: 1,
    num: "01",
    period: "Mar 2026",
    title: "QuickBite",
    subtitle: "Food delivery platform",
    desc: "MERN food delivery platform with 20+ REST endpoints, JWT authentication, and role-based access for customers, riders, and admins. Real-time GPS tracking, an admin analytics dashboard, and the ordering extras that make the product usable end to end.",
    stack: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "JWT",
      "Leaflet.js",
      "Chart.js",
      "PWA",
    ],
    accent: "#00D4FF",
    mark: "QB",
    bg: "linear-gradient(145deg,#0B1C33 0%,#12304F 55%,#0E2438 100%)",
    live: "https://rajputsherr.github.io/QuickBite-Food-Delivery-App/",
    github: "https://github.com/Omsingh5/QuickBite-Food-Delivery-App",
    features: [
      "20+ REST endpoints with JWT and role-based access",
      "GPS tracking with animated rider movement and 15-second polling",
      "Admin dashboard: Chart.js, order status, menu CRUD, CSV export",
      "Coupons, loyalty points, payments, scheduled delivery, and PWA",
    ],
  },
  {
    id: 2,
    num: "02",
    period: "Apr 2025",
    title: "Smart Healthcare Management",
    subtitle: "Patient, appointment, and doctor records",
    desc: "Healthcare platform for patient records, appointment scheduling, and doctor profiles, with authentication and authorization. MongoDB schema and REST APIs for patient data, and a modular React.js frontend.",
    stack: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "JWT",
      "REST APIs",
    ],
    accent: "#10B981",
    mark: "HC",
    bg: "linear-gradient(145deg,#0C2418 0%,#134832 55%,#0E2A1C 100%)",
    live: "https://smart-healthcare-vert.vercel.app",
    github: "https://github.com/Omsingh5/Smart-Healthcare-",
    features: [
      "Patient records, appointments, and doctor profiles",
      "User authentication and authorization",
      "MongoDB schema and REST APIs for patient data",
      "Modular React.js frontend",
    ],
  },
  {
    id: 3,
    num: "03",
    period: "Internship",
    title: "Job Management System",
    subtitle: "ProofNexa AI · recruitment platform",
    desc: "Recruitment and career platform for posting roles, tracking applications, and reviewing candidates. Spring Boot REST APIs with Spring Security and JWT, React screens for the hiring workflow, and MySQL-backed job records, with Gemini assisting recruitment tasks.",
    stack: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "React.js",
      "MySQL",
      "Hibernate",
      "JWT",
      "Gemini",
    ],
    accent: "#A78BFA",
    mark: "JM",
    bg: "linear-gradient(145deg,#16102A 0%,#2A1B4A 55%,#120E24 100%)",
    live: "",
    github: "https://github.com/Omsingh5/ProofNexa-AI",
    features: [
      "Job posting, applications, and candidate review",
      "Java, Spring Boot, Spring Security, and Spring Data JPA",
      "REST APIs backed by MySQL and Hibernate",
      "React.js screens connected to those APIs",
      "JWT auth and Google Gemini for recruitment workflows",
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

      const esriAttr =
        "Tiles © Esri — Esri, HERE, Garmin, © OpenStreetMap contributors";
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        { attribution: esriAttr, maxZoom: 16 },
      ).addTo(map);
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        { attribution: esriAttr, maxZoom: 16 },
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
      const palette = [
        "#F59E0B",
        "#10B981",
        "#00D4FF",
        "#8B5CF6",
        "#38BDF8",
        "#34D399",
        "#47A248",
        "#A78BFA",
      ];
      chartRef.current = new window.Chart(ctx, {
        type: "polarArea",
        data: {
          labels: SKILLS_RADAR.map((s) => s.skill),
          datasets: [
            {
              data: SKILLS_RADAR.map((s) => s.value),
              backgroundColor: palette.map((c) => `${c}59`),
              borderColor: palette,
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

// ─── SCROLL-DRIVEN BACKGROUND ─────────────────────────────────
// The field is a function of scroll position, so moving back up
// restores the earlier palette, lattice, and light band.
function ScrollAtmosphere() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const COUNT = 56;
    const COLS = 8;
    const nodes = Array.from({ length: COUNT }, (_, i) => ({
      phase: (i * 2.399963) % (Math.PI * 2),
    }));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let progress = 0;
    let target = 0;
    let raf = 0;

    const hexToRgb = (hex) => {
      const n = parseInt(hex.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const mix = (a, b, t) => {
      const ca = hexToRgb(a);
      const cb = hexToRgb(b);
      const c = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
      return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    };
    const anchor = (i, mode) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const rows = Math.ceil(COUNT / COLS);
      if (mode === 0) {
        const ang = i * 2.399963;
        const rad = 0.06 + (i / COUNT) * 0.4;
        return {
          x: 0.5 + Math.cos(ang) * rad * 1.2,
          y: 0.48 + Math.sin(ang) * rad * 0.78,
        };
      }
      if (mode === 1) {
        return {
          x: (col + 0.5) / COLS,
          y: 0.14 + ((row + 0.5) / rows) * 0.72,
        };
      }
      return {
        x: (col + 0.5) / COLS + Math.sin(col * 0.85 + row) * 0.035,
        y: 0.16 + (row / Math.max(1, rows - 1)) * 0.68,
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const frame = (now) => {
      progress += (target - progress) * (reduce ? 1 : 0.07);
      const p = progress;
      const accent =
        p < 0.5 ? mix("#7DD3FC", "#A78BFA", p * 2) : mix("#A78BFA", "#6EE7B7", (p - 0.5) * 2);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, mix("#07111C", "#100C20", p));
      bg.addColorStop(0.55, mix("#0A1628", "#161028", p));
      bg.addColorStop(1, mix("#081420", "#1A1230", p));
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const orbs = [
        { x: 0.18 + p * 0.28, y: 0.22 + p * 0.15, r: 280, c: accent },
        { x: 0.82 - p * 0.2, y: 0.72 - p * 0.18, r: 340, c: p > 0.45 ? "#6EE7B7" : "#38BDF8" },
        { x: 0.55, y: 0.5 + (p - 0.5) * 0.25, r: 220, c: "#8B5CF6" },
      ];
      orbs.forEach((orb) => {
        const g = ctx.createRadialGradient(
          orb.x * width,
          orb.y * height,
          0,
          orb.x * width,
          orb.y * height,
          orb.r,
        );
        g.addColorStop(0, `${orb.c}24`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      });

      const bandY = height * (0.18 + p * 0.58);
      const band = ctx.createLinearGradient(0, bandY - 90, 0, bandY + 90);
      band.addColorStop(0, "rgba(0,0,0,0)");
      band.addColorStop(0.5, `${accent}14`);
      band.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = band;
      ctx.fillRect(0, bandY - 90, width, 180);

      const drift = reduce ? 0 : 1;
      const pts = nodes.map((node, i) => {
        const from = p < 0.5 ? anchor(i, 0) : anchor(i, 1);
        const to = p < 0.5 ? anchor(i, 1) : anchor(i, 2);
        const t = p < 0.5 ? p * 2 : (p - 0.5) * 2;
        const breathe = Math.sin(now / 1400 + node.phase) * 7 * drift;
        return {
          x: (from.x + (to.x - from.x) * t) * width + breathe,
          y: (from.y + (to.y - from.y) * t) * height + Math.cos(now / 1700 + node.phase) * 5 * drift,
        };
      });

      const reach = Math.min(width, height) * 0.16;
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > reach) continue;
          ctx.strokeStyle = `${accent}${Math.round((1 - dist / reach) * 70)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      pts.forEach((pt) => {
        ctx.fillStyle = `${accent}CC`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.7, 0, Math.PI * 2);
        ctx.fill();
      });

      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        height * 0.2,
        width * 0.5,
        height * 0.5,
        height * 0.78,
      );
      vignette.addColorStop(0, "rgba(5,8,19,0)");
      vignette.addColorStop(1, "rgba(5,8,19,.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    resize();
    readScroll();
    const onScroll = () => {
      readScroll();
      if (reduce) frame(0);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
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
  const [submitError, setSubmitError] = useState("");
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
    setSubmitError("");
    const name = fields.name.trim();
    const email = fields.email.trim();
    const subject = fields.subject.trim();
    const message = fields.message.trim();
    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/omsingrajput05@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            Name: name,
            Email: email,
            Subject: subject,
            Message: message,
            email,
            _replyto: email,
            _subject: `Portfolio message from ${name}: ${subject}`,
            _template: "table",
            _captcha: "false",
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      const needsActivation = /activat/i.test(data.message || "");
      if (
        !needsActivation &&
        (!res.ok || data.success === false || data.success === "false")
      ) {
        throw new Error(data.message || "Could not send the message.");
      }
      setSent(true);
    } catch (err) {
      setSubmitError(
        err.message ||
          "Could not send the message. Email omsingrajput05@gmail.com directly.",
      );
    } finally {
      setLoading(false);
    }
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
        <p style={{ color: T.muted, fontSize: ".9rem", lineHeight: 1.7 }}>
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
      {submitError && (
        <p
          style={{
            color: T.coral,
            fontSize: ".8rem",
            marginTop: 12,
            lineHeight: 1.6,
          }}
        >
          {submitError}
        </p>
      )}
    </form>
  );
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
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
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
    <div style={{ minHeight: "100vh", background: "transparent", position: "relative" }}>
      <ScrollAtmosphere />
      <div style={{ position: "relative", zIndex: 1 }}>
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
          background: "transparent",
        }}
      >
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
            // Software Developer
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
            Java · Spring Boot · Node.js · React.js · MySQL
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
            I build secure web applications and REST APIs with Java, Spring
            Boot, Node.js, and React. Based in Pune and open to software
            developer roles across India.
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
            Software developer, <span style={S.gradText}>backend first</span>
          </h2>
        </Reveal>
        <div
          className="two-col"
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
              "Backend-focused software developer with a B.E. in Computer Science and Engineering from P.R. Pote Patil College of Engineering, Amravati (May 2025).",
              "I build secure web applications and REST APIs with Java, Spring Boot, Node.js, and Express.js, using MongoDB, MySQL, JWT, and role-based access. Git, Docker, and AWS are how I ship that work and debug it.",
              "Recent work includes ProofNexa AI during a software developer internship at SevenMentor, plus QuickBite and a healthcare management system.",
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
            <div style={{ marginTop: 8 }}>
              <p
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: ".72rem",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: T.blue,
                  marginBottom: 10,
                }}
              >
                Education
              </p>
              <p style={{ color: T.text, fontSize: ".95rem", marginBottom: 4 }}>
                B.E. Computer Science and Engineering
              </p>
              <p style={{ color: T.muted, fontSize: ".85rem", lineHeight: 1.6 }}>
                P.R. Pote Patil College of Engineering, Amravati · May 2025
              </p>
              <p
                style={{
                  color: T.muted,
                  fontSize: ".82rem",
                  lineHeight: 1.6,
                  marginTop: 14,
                }}
              >
                Certifications: Java (NASSCOM), Data Analyst (Deloitte), Cyber
                Security Analyst (Forage).
              </p>
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
              Based in Pune · Open across India
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

      {/* ── EXPERIENCE ─────────────────────────────────────── */}
      <div style={S.divider} />
      <section id="experience" style={S.section}>
        <Reveal>
          <p style={S.sectionLabel}>// Experience</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 style={S.sectionTitle()}>
            Where I have <span style={S.gradText}>shipped</span>
          </h2>
        </Reveal>
        <div style={{ display: "grid", gap: 20 }}>
          {EXPERIENCE.map((job, idx) => (
            <Reveal key={job.org} delay={idx * 100}>
              <div style={{ ...S.panel, padding: "28px 32px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: 8,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                  >
                    {job.role}
                  </h3>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: ".75rem",
                      color: T.blue,
                    }}
                  >
                    Internship
                  </span>
                </div>
                <p
                  style={{
                    color: T.muted,
                    fontSize: ".9rem",
                    marginBottom: 16,
                  }}
                >
                  {job.org}
                  {job.place ? ` · ${job.place}` : ""}
                </p>
                <ul style={{ listStyle: "none", display: "grid", gap: 8 }}>
                  {job.points.map((point) => (
                    <li
                      key={point}
                      style={{
                        color: T.muted,
                        fontSize: ".9rem",
                        lineHeight: 1.65,
                        paddingLeft: 14,
                        borderLeft: `2px solid ${T.blue}55`,
                      }}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SKILLS ──────────────────────────────────────────── */}
      <div style={S.divider} />
      <section id="skills" style={S.section}>
        <Reveal>
          <p style={S.sectionLabel}>// Skills</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 style={S.sectionTitle()}>
            Tools I <span style={S.gradText}>use</span>
          </h2>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {SKILL_GROUPS.map((group) => (
            <Reveal key={group.title}>
              <div style={{ ...S.panel, padding: 22 }}>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: "1rem",
                    marginBottom: 14,
                  }}
                >
                  {group.title}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {group.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: ".7rem",
                        padding: "5px 10px",
                        borderRadius: 20,
                        border: "1px solid rgba(0,212,255,.18)",
                        color: T.muted,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div
          className="two-col"
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
              Stack balance{" "}
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
              Depth across languages, APIs, data, and security
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
            Selected <span style={S.gradText}>work</span>
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
                  {proj.num} / {proj.period}
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
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: "2.4rem",
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      color: proj.accent,
                    }}
                  >
                    {proj.mark}
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
                  {proj.live ? (
                    <a
                      href={proj.live}
                      target="_blank"
                      rel="noreferrer"
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
                  ) : null}
                  {proj.github ? (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
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
                  ) : null}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
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
          className="two-col"
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
              I'm looking for software developer roles. If you have an opening,
              a project, or a question about the work above, send a note.
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
          © 2026 <span style={{ color: T.blue }}>Omsingh Rajput</span> ·
          Software Developer
        </p>
        <nav style={{ display: "flex", gap: 24 }}>
          {["#about", "#experience", "#skills", "#projects", "#contact"].map(
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
    </div>
  );
}
