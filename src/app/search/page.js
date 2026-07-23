"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import Card from "@/components/Card";
import { searchClients } from "@/services/machineService";

export default function SearchClient() {
  const router = useRouter();
  const [form, setForm] = useState({ query: "", defect: "", machineName: "" });
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const found = await searchClients(form);
      setResults(found);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="page">
      <Header title="Search Client" back />
      <div className="page-content">
        <Input
          label="Company Name / Client Name"
          name="query"
          value={form.query}
          onChange={handleChange}
          placeholder="e.g. Abdullah Ansari"
        />
        <Input
          label="Defect"
          name="defect"
          value={form.defect}
          onChange={handleChange}
          placeholder="e.g. Motor Burn"
        />
        <Input
          label="Machine Name"
          name="machineName"
          value={form.machineName}
          onChange={handleChange}
          placeholder="e.g. Compressor"
        />

        <div style={{ textAlign: "right", marginBottom: "22px" }}>
          <a
            onClick={() => router.push("/search-date")}
            href="#"
            style={{ textDecoration: "underline", color: "var(--steel)", fontSize: "14px", cursor: "pointer" }}
          >
            Search With Date
          </a>
        </div>

        <div style={{ marginBottom: "22px" }}>
          <Button onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </Button>
        </div>

        {results !== null && (
          <>
            {results.length === 0 ? (
              <EmptyState
                icon="⌕"
                title="No matches found"
                message="Try a different name, defect, or machine keyword."
              />
            ) : (
              results.map((client) => (
                <Card
                  key={client.id}
                  onClick={() => router.push(`/client/${client.id}`)}
                  style={{ marginBottom: "12px", cursor: "pointer" }}
                >
                  <h3 style={{ fontSize: "17px", color: "var(--paper)" }}>{client.clientName}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--paper-dim)" }}>
                    {client.companyName} · {Object.keys(client.machines).length} record(s)
                  </p>
                </Card>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
