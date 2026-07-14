"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/Card";
import HistoryTable from "@/components/HistoryTable";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import { getClientById, getClientHistory, updateMachineStatus } from "@/services/machineService";
import { downloadClientReport } from "@/utils/pdfreport";

export default function ClientDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [client, setClient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [clientData, historyData] = await Promise.all([
        getClientById(id),
        getClientHistory(id),
      ]);
      if (!cancelled) {
        setClient(clientData);
        setHistory(historyData);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const current = history[0];

  const handleStatusChange = async (newStatus) => {
    if (!current) return;
    setUpdating(true);
    try {
      await updateMachineStatus(id, current.id, newStatus);
      const [clientData, historyData] = await Promise.all([
        getClientById(id),
        getClientHistory(id),
      ]);
      setClient(clientData);
      setHistory(historyData);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Header title="Client Detail" back />
        <div className="page-content">
          <EmptyState icon="⋯" title="Loading" message="Fetching this client's record." />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="page">
        <Header title="Client Detail" back />
        <div className="page-content">
          <EmptyState
            title="Client not found"
            message="This record may have been removed."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Header title="Client Detail" back />
      <div className="page-content">
        {/* Top card */}
        <Card style={{ marginBottom: "18px" }}>
          <h2 style={{ fontSize: "21px", color: "var(--paper)" }}>{client.clientName}</h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--paper-dim)" }}>
            {client.companyName}
          </p>
          {current && (
            <p style={{ margin: "10px 0 0", fontSize: "15px", color: "var(--steel)" }}>
              {current.machineName}
            </p>
          )}
        </Card>

        {/* Current status */}
        {current && (
          <Card style={{ marginBottom: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--paper-dim)",
                  fontWeight: 600,
                }}
              >
                Current Status
              </span>
              <select
                value={current.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                style={{
                  background: "var(--ink-3)",
                  color: "var(--paper)",
                  border: "1px solid var(--steel)",
                  borderRadius: "20px",
                  padding: "3px 10px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  cursor: updating ? "not-allowed" : "pointer",
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {current.image && (
              <img
                src={current.image}
                alt={current.machineName}
                style={{
                  width: "100%",
                  maxHeight: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "12px",
                }}
              />
            )}

            <DetailRow label="Date" value={current.date} />
            <DetailRow label="Defect" value={current.defect} />
            <DetailRow label="Cost" value={`Rs ${current.cost}`} />
            {current.remarks && <DetailRow label="Remarks" value={current.remarks} last />}
          </Card>
        )}

        {/* History section */}
        <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ fontSize: "17px", color: "var(--paper)" }}>History</h3>
          <span style={{ fontSize: "12px", color: "var(--paper-dim)" }}>{history.length} record(s)</span>
        </div>

        <HistoryTable records={history} />

        <div style={{ marginTop: "16px" }}>
          <Button variant="secondary" onClick={() => downloadClientReport(client, history)}>
            ⬇ Download Report (PDF)
          </Button>
        </div>

        <div style={{ marginTop: "12px" }}>
          <Button variant="secondary" onClick={() => router.push("/add-machine")}>
            + Add Another Visit
          </Button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, last = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: last ? "none" : "1px solid var(--ink-3)",
        fontSize: "14px",
      }}
    >
      <span style={{ color: "var(--paper-dim)" }}>{label}</span>
      <span style={{ color: "var(--paper)", textAlign: "right", maxWidth: "65%" }}>{value}</span>
    </div>
  );
}