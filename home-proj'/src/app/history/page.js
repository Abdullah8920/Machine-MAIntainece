"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import { getAllClients } from "@/services/machineService";

export default function HistoryPage() {
  const router = useRouter();
  const [clients, setClients] = useState(null);

  useEffect(() => {
    getAllClients().then(setClients);
  }, []);

  return (
    <div className="page">
      <Header title="All History" back />
      <div className="page-content">
        {clients === null ? (
          <EmptyState icon="⋯" title="Loading" message="Fetching all records." />
        ) : clients.length === 0 ? (
          <EmptyState icon="📋" title="No records yet" message="Add a machine to get started." />
        ) : (
          <>
            <p style={{ fontSize: "12px", color: "var(--paper-dim)", marginBottom: "12px" }}>
              {clients.length} client(s)
            </p>
            {clients.map((client) => {
              const count = Object.keys(client.machines || {}).length;
              return (
                <Card
                  key={client.id}
                  onClick={() => router.push(`/client/${client.id}`)}
                  style={{ marginBottom: "12px", cursor: "pointer" }}
                >
                  <h3 style={{ fontSize: "17px", color: "var(--paper)" }}>{client.clientName}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--paper-dim)" }}>
                    {client.companyName} · {count} record{count !== 1 ? "s" : ""}
                  </p>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
