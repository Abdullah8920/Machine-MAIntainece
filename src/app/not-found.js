"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="page" style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "24px" }}>
      <h1 style={{ fontSize: "60px", color: "var(--ink-3)" }}>404</h1>
      <p style={{ color: "var(--paper-dim)", marginBottom: "24px" }}>
        This page doesn't exist.
      </p>
      <div style={{ width: "100%", maxWidth: "260px" }}>
        <Button onClick={() => router.push("/")}>Back to Start</Button>
      </div>
    </div>
  );
}
