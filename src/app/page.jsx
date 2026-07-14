"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function GetStarted() {
  const router = useRouter();

  return (
    <div
      className="page blueprint-bg"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        padding: "60px 24px 40px",
      }}
    >
      <div />

      <div>
        <div
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
          ⚙
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

      <div style={{ width: "100%" }}>
        <Button onClick={() => router.push("/home")}>Get Started</Button>
      </div>
    </div>
  );
}
