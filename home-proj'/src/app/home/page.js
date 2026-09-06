"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/Card";

const OPTIONS = [
  {
    to: "/add-machine",
    icon: "＋",
    title: "Add Machine Detail",
    subtitle: "Log a new repair visit",
  },
  {
    to: "/search",
    icon: "⌕",
    title: "Search Client / Project",
    subtitle: "Look up service history",
  },
  {
    to: "/history",
    icon: "📋",
    title: "All History",
    subtitle: "Browse every client on record",
  },
];

const FLOATING_TOOLS = [
  { icon: "🔧", top: "6%", left: "82%", delay: "0s", size: "18px" },
  { icon: "⚙️", top: "18%", left: "10%", delay: "0.5s", size: "16px" },
  { icon: "🛠️", top: "34%", left: "88%", delay: "1s", size: "18px" },
  { icon: "🔩", top: "46%", left: "6%", delay: "0.3s", size: "16px" },
  { icon: "🪛", top: "58%", left: "80%", delay: "1.3s", size: "18px" },
  { icon: "🔧", top: "70%", left: "14%", delay: "0.8s", size: "16px" },
  { icon: "⚙️", top: "82%", left: "86%", delay: "0.2s", size: "18px" },
  { icon: "🛠️", top: "92%", left: "20%", delay: "1.1s", size: "16px" },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="page" style={{ position: "relative", overflow: "hidden" }}>
      {/* Scattered floating tool icons (decorative background) */}
      {FLOATING_TOOLS.map((tool, i) => (
        <span
          key={i}
          className="floating"
          style={{
            position: "absolute",
            top: tool.top,
            left: tool.left,
            fontSize: tool.size,
            opacity: 0.3,
            animationDelay: tool.delay,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {tool.icon}
        </span>
      ))}

      <div style={{ position: "relative", zIndex: 1 }}>
        <Header title="Home" />
      </div>
      <div className="page-content" style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--paper-dim)",
            marginBottom: "14px",
          }}
        >
          Choose an option
        </p>

        {OPTIONS.map((opt) => (
          <Card
            key={opt.to}
            onClick={() => router.push(opt.to)}
            style={{
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "var(--ink-3)",
                color: "var(--amber)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              {opt.icon}
            </div>
            <div>
              <h3 style={{ fontSize: "17px", color: "var(--paper)" }}>{opt.title}</h3>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "var(--paper-dim)" }}>
                {opt.subtitle}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
