export default function EmptyState({ title, message, icon = "⚙" }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 20px",
        color: "var(--paper-dim)",
      }}
    >
      <div style={{ fontSize: "32px", marginBottom: "10px", color: "var(--ink-3)" }}>{icon}</div>
      <h3 style={{ fontSize: "17px", color: "var(--paper)", marginBottom: "6px" }}>{title}</h3>
      <p style={{ fontSize: "14px", margin: 0 }}>{message}</p>
    </div>
  );
}
