"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { getClientById, getClientHistory } from "@/services/machineService";

export default function RecordDetail() {
  const { id, machineId } = useParams();
  const router = useRouter();

  const [client, setClient] = useState(null);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setRecord(historyData.find((r) => r.id === machineId) || null);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, machineId]);

  if (loading) {
    return (
      <div className="page">
        <Header title="Record Detail" back />
        <div className="page-content">
          <EmptyState icon="⋯" title="Loading" message="Fetching this record." />
        </div>
      </div>
    );
  }

  if (!client || !record) {
    return (
      <div className="page">
        <Header title="Record Detail" back />
        <div className="page-content">
          <EmptyState title="Record not found" message="This entry may have been removed." />
        </div>
      </div>
    );
  }

  const balance = (Number(record.cost) || 0) - (Number(record.advance) || 0);

  return (
    <div className="page">
      <Header title="Record Detail" back />
      <div className="page-content">
        <Card style={{ marginBottom: "18px" }}>
          <h2 style={{ fontSize: "21px", color: "var(--paper)" }}>{client.clientName}</h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--paper-dim)" }}>
            {client.companyName}
          </p>
          <p style={{ margin: "10px 0 0", fontSize: "15px", color: "var(--steel)" }}>
            {record.machineName}
          </p>
        </Card>

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
              Visit Details
            </span>
            <StatusBadge status={record.status} />
          </div>

          {record.image && (
            <img
              src={record.image}
              alt={record.machineName}
              style={{
                width: "100%",
                maxHeight: "180px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            />
          )}

          <DetailRow label="Date" value={record.date} />
          <DetailRow label="Delivery Date" value={record.deliveryDate || "-"} />
          <DetailRow label="Machine Type" value={record.machineType || "New"} />
          <DetailRow label="Defect" value={record.defect} />
          <DetailRow label="Total Cost" value={`Rs ${record.cost}`} />
          <DetailRow label="Advance Received" value={`Rs ${record.advance || 0}`} />
          <DetailRow label="Balance" value={`Rs ${balance}`} highlight />
          {record.remarks && <DetailRow label="Remarks" value={record.remarks} last />}
        </Card>

        <button
          onClick={() => router.push(`/client/${id}/record/${machineId}/edit`)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid var(--amber)",
            background: "var(--ink-3)",
            color: "var(--amber)",
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "12px",
          }}
        >
          ✎ Edit This Record
        </button>

        <button
          onClick={() => router.push(`/client/${id}`)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid var(--steel)",
            background: "var(--ink-3)",
            color: "var(--paper)",
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Back to Client
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value, last = false, highlight = false }) {
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
      <span
        style={{
          color: highlight ? "var(--amber)" : "var(--paper)",
          fontFamily: highlight ? "var(--font-mono)" : undefined,
          fontWeight: highlight ? 600 : 400,
          textAlign: "right",
          maxWidth: "65%",
        }}
      >
        {value}
      </span>
    </div>
  );
}
