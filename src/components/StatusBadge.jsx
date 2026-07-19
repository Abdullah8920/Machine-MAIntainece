const STATUS_COLORS = {
  Active: "var(--blue)",
  Pending: "var(--amber)",
  Completed: "var(--green)",
};

const STATUS_LABELS = {
  Active: "Under Process",
  Pending: "Pending",
  Completed: "Completed",
};

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || "var(--steel)";
  const label = STATUS_LABELS[status] || status;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color,
        border: `1px solid ${color}`,
        borderRadius: "20px",
        padding: "3px 10px",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: color,
        }}
      />
      {label}
    </span>
  );
}