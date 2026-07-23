"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

const FLOATING_TOOLS = [
  { icon: "🔧", top: "8%", left: "14%", delay: "0s", size: "20px" },
  { icon: "⚙️", top: "12%", left: "78%", delay: "0.6s", size: "18px" },
  { icon: "🛠️", top: "28%", left: "22%", delay: "1.1s", size: "16px" },
  { icon: "🔩", top: "34%", left: "84%", delay: "0.3s", size: "18px" },
  { icon: "🪛", top: "48%", left: "10%", delay: "1.4s", size: "18px" },
  { icon: "🔧", top: "58%", left: "88%", delay: "0.8s", size: "16px" },
  { icon: "⚙️", top: "68%", left: "18%", delay: "0.2s", size: "20px" },
  { icon: "🛠️", top: "78%", left: "80%", delay: "1.2s", size: "16px" },
  { icon: "🔩", top: "90%", left: "30%", delay: "0.5s", size: "18px" },
];

export default function GetStarted() {
  const router = useRouter();

  return (
    <div
      className="page blueprint-bg"
      style={{
        position: "relative",
        overflow: "hidden",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        padding: "60px 24px 40px",
      }}
    >
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
            opacity: 0.35,
            animationDelay: tool.delay,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {tool.icon}
        </span>
      ))}

      <div style={{ position: "relative", zIndex: 1 }} />

      <div className="fade-in-up" style={{ position: "relative", zIndex: 1 }}>
        <div
          className="floating"
          style={{
            width: "72px",
            height: "72px",
            margin: "0 auto 20px",
            borderRadius: "16px",
            background: "var(--ink-2)",
            border: "1px solid var(--ink-3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "34px",
            color: "var(--amber)",
          }}
        >
          <span className="spin-slow" style={{ display: "inline-block" }}>⚙</span>
        </div>
        <h1 style={{ fontSize: "34px", color: "var(--paper)", lineHeight: 1.1 }}>
          Machine
          <br />
          Maintenance
        </h1>
        <p style={{ color: "var(--paper-dim)", marginTop: "10px", fontSize: "15px" }}>
          Track repairs, costs, and service history
          <br />
          for every client machine.
        </p>
      </div>

      <div className="fade-in-up" style={{ position: "relative", zIndex: 1, width: "100%", animationDelay: "0.2s" }}>
        <Button onClick={() => router.push("/home")}>Get Started</Button>
      </div>
    </div>
  );
}
