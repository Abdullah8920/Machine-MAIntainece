import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";

export default function HistoryTable({ records }) {
  if (!records || records.length === 0) {
    return (
      <EmptyState
        title="No history yet"
        message="Repair visits for this machine will show up here."
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {records.map((r, i) => (
        <div
          key={r.id || i}
          style={{
            background: "var(--ink-2)",
            border: "1px solid var(--ink-3)",
            borderRadius: "10px",
            padding: "12px 14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--steel)",
                fontSize: "12px",
              }}
            >
              #{String(i + 1).padStart(2, "0")} · {r.date}
            </span>
            <StatusBadge status={r.status} />
          </div>

          <p style={{ margin: "8px 0 4px", fontSize: "15px", color: "var(--paper)" }}>
            {r.defect}
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span style={{ color: "var(--paper-dim)" }}>{r.remarks}</span>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--amber)" }}>
              Rs {r.cost}
            </span>
          </div>

          {Number(r.advance) > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                marginTop: "4px",
                paddingTop: "4px",
                borderTop: "1px dashed var(--ink-3)",
                color: "var(--paper-dim)",
              }}
            >
              <span>Advance: Rs {r.advance}</span>
              <span>Balance: Rs {(Number(r.cost) || 0) - (Number(r.advance) || 0)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}