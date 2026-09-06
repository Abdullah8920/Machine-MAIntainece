import Card from "./Card";
import StatusBadge from "./StatusBadge";

export default function MachineCard({ machine, onClick }) {
  return (
    <Card
      onClick={onClick}
      style={{ marginBottom: "12px", cursor: onClick ? "pointer" : "default" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "19px", color: "var(--paper)" }}>{machine.machineName}</h3>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--paper-dim)" }}>
            {machine.clientName} · {machine.companyName}
          </p>
        </div>
        <StatusBadge status={machine.status} />
      </div>

      <div
        style={{
          marginTop: "12px",
          paddingTop: "12px",
          borderTop: "1px dashed var(--ink-3)",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "13px",
        }}
      >
        <span style={{ color: "var(--paper-dim)" }}>{machine.defect}</span>
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--amber)" }}>
          Rs {machine.cost}
        </span>
      </div>
    </Card>
  );
}
