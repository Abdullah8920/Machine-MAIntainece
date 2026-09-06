"use client";

import { useRouter } from "next/navigation";

export default function Header({ title, back = false }) {
  const router = useRouter();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "18px",
        borderBottom: "1px solid var(--ink-3)",
        position: "sticky",
        top: 0,
        background: "var(--ink)",
        zIndex: 10,
      }}
    >
      {back && (
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          style={{
            background: "var(--ink-2)",
            border: "1px solid var(--ink-3)",
            borderRadius: "8px",
            width: "36px",
            height: "36px",
            color: "var(--paper)",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ‹
        </button>
      )}
      <h1 style={{ fontSize: "22px", color: "var(--paper)" }}>{title}</h1>
    </header>
  );
}
