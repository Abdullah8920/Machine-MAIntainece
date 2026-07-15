"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/Card";


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
