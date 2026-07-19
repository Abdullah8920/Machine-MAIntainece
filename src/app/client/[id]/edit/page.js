"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import {
    getClientById,
    getClientHistory,
    updateMachineEntry,
} from "@/services/machineService";

export default function EditMachine() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [machineId, setMachineId] = useState(null);
    const [form, setForm] = useState({
        machineName: "",
        date: "",
        defect: "",
        cost: "",
        advance: "",
        remarks: "",
    });

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            const [client, history] = await Promise.all([
                getClientById(id),
                getClientHistory(id),
            ]);
            const current = history[0];

            if (!cancelled && client && current) {
                setMachineId(current.id);
                setForm({
                    machineName: current.machineName || "",
                    date: current.date || "",
                    defect: current.defect || "",
                    cost: current.cost || "",
                    advance: current.advance || "",
                    remarks: current.remarks || "",
                });
            }
            if (!cancelled) setLoading(false);
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const required = ["machineName", "date", "defect", "cost"];
        const missing = required.some((key) => !form[key]);
        if (missing) {
            setError("Please fill all required fields.");
            return;
        }
        setError("");
        setSaving(true);

        try {
            await updateMachineEntry(id, machineId, form);
            router.push(`/client/${id}`);
        } catch (err) {
            console.error(err);
            setError("Could not save. Check your Firebase config and internet connection.");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <Header title="Edit Entry" back />
                <div className="page-content">
                    <EmptyState icon="⋯" title="Loading" message="Fetching the current record." />
                </div>
            </div>
        );
    }

    if (!machineId) {
        return (
            <div className="page">
                <Header title="Edit Entry" back />
                <div className="page-content">
                    <EmptyState title="Nothing to edit" message="This client has no entries yet." />
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <Header title="Edit Entry" back />
            <div className="page-content">
                <Input label="Machine Name" name="machineName" value={form.machineName} onChange={handleChange} required />
                <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
                <Input label="Defect" name="defect" as="textarea" value={form.defect} onChange={handleChange} required />
                <Input label="Total Cost" name="cost" type="number" value={form.cost} onChange={handleChange} required />
                <Input label="Advance Received" name="advance" type="number" value={form.advance} onChange={handleChange} />

                {form.cost && (
                    <p style={{ fontSize: "13px", color: "var(--paper-dim)", marginTop: "-10px", marginBottom: "16px" }}>
                        Balance:{" "}
                        <span style={{ color: "var(--amber)", fontFamily: "var(--font-mono)" }}>
                            Rs {(Number(form.cost) || 0) - (Number(form.advance) || 0)}
                        </span>
                    </p>
                )}

                <Input label="Remarks" name="remarks" as="textarea" value={form.remarks} onChange={handleChange} />

                {error && (
                    <p style={{ color: "var(--danger)", fontSize: "13px", marginBottom: "14px" }}>{error}</p>
                )}

                <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}