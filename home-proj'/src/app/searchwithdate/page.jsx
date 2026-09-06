"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { searchByDate } from "@/services/machineService";

export default function SearchByDate() {
    const router = useRouter();
    const [date, setDate] = useState("");
    const [results, setResults] = useState(null);
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
        if (!date) return;
        setSearching(true);
        try {
            const found = await searchByDate(date);
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
            <Header title="Search With Date" back />
            <div className="page-content">
                <Input
                    label="Date"
                    name="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <div style={{ marginBottom: "22px" }}>
                    <Button onClick={handleSearch} disabled={searching || !date}>
                        {searching ? "Searching..." : "Search"}
                    </Button>
                </div>

                {results !== null && (
                    <>
                        <p style={{ fontSize: "12px", color: "var(--paper-dim)", marginBottom: "12px" }}>
                            {results.length} record(s) on {date}
                        </p>

                        {results.length === 0 ? (
                            <EmptyState
                                icon="📅"
                                title="No entries on this date"
                                message="Try a different date."
                            />
                        ) : (
                            results.map((r) => (
                                <Card
                                    key={r.id}
                                    onClick={() => router.push(`/client/${r.clientId}`)}
                                    style={{ marginBottom: "12px", cursor: "pointer" }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <h3 style={{ fontSize: "17px", color: "var(--paper)" }}>{r.machineName}</h3>
                                            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--paper-dim)" }}>
                                                {r.clientName} · {r.companyName}
                                            </p>
                                        </div>
                                        <StatusBadge status={r.status} />
                                    </div>

                                    <div
                                        style={{
                                            marginTop: "12px",
                                            paddingTop: "12px",
                                            borderTop: "1px dashed var(--ink-3)",
                                            fontSize: "13px",
                                        }}
                                    >
                                        <p style={{ margin: "0 0 4px", color: "var(--paper)" }}>{r.defect}</p>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ color: "var(--paper-dim)" }}>{r.remarks}</span>
                                            <span style={{ fontFamily: "var(--font-mono)", color: "var(--amber)" }}>
                                                Rs {r.cost}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
}