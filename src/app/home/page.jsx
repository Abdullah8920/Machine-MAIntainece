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
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="page">
      <Header title="Home" />
      <div className="page-content">
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
