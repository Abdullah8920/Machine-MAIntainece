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
  updateClientInfo,
} from "@/services/machineService";

export default function EditRecord() {
  const { id, machineId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [found, setFound] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    clientName: "",
    companyName: "",
    machineName: "",
    machineType: "New",
    date: "",
    deliveryDate: "",
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
      const record = history.find((r) => r.id === machineId);

      if (!cancelled && client && record) {
        setFound(true);
        setImagePreview(record.image || null);
        setForm({
          clientName: client.clientName || "",
          companyName: client.companyName || "",
          machineName: record.machineName || "",
          machineType: record.machineType || "New",
          date: record.date || "",
          deliveryDate: record.deliveryDate || "",
          defect: record.defect || "",
          cost: record.cost || "",
          advance: record.advance || "",
          remarks: record.remarks || "",
        });
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, machineId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const required = ["clientName", "companyName", "machineName", "date", "defect", "cost"];
    const missing = required.some((key) => !form[key]);
    if (missing) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");
    setSaving(true);

    const { clientName, companyName, ...machineFields } = form;
    machineFields.image = imagePreview;

    try {
      await Promise.all([
        updateClientInfo(id, { clientName, companyName }),
        updateMachineEntry(id, machineId, machineFields),
      ]);
      router.push(`/client/${id}/record/${machineId}`);
    } catch (err) {
      console.error(err);
      setError("Could not save. Check your Firebase config and internet connection.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Header title="Edit Record" back />
        <div className="page-content">
          <EmptyState icon="⋯" title="Loading" message="Fetching this record." />
        </div>
      </div>
    );
  }

  if (!found) {
    return (
      <div className="page">
        <Header title="Edit Record" back />
        <div className="page-content">
          <EmptyState title="Record not found" message="This entry may have been removed." />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Header title="Edit Record" back />
      <div className="page-content">
        <Input label="Client Name" name="clientName" value={form.clientName} onChange={handleChange} required />
        <Input label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} required />
        <Input label="Machine Name" name="machineName" value={form.machineName} onChange={handleChange} required />
        <Input
          label="Machine Type"
          name="machineType"
          as="select"
          options={["New", "Old"]}
          value={form.machineType}
          onChange={handleChange}
        />
        <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
        <Input label="Delivery Date" name="deliveryDate" type="date" value={form.deliveryDate} onChange={handleChange} />
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

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--paper-dim)",
              fontWeight: 600,
            }}
          >
            Machine Image
          </label>

          <label
            htmlFor="record-image-edit"
            style={{
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: imagePreview ? "auto" : "90px",
              border: "1px dashed var(--ink-3)",
              borderRadius: "8px",
              background: "var(--ink-2)",
              color: "var(--paper-dim)",
              fontSize: "13px",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Machine preview"
                style={{ width: "100%", maxHeight: "180px", objectFit: "cover" }}
              />
            ) : (
              "Tap to upload a photo"
            )}
          </label>
          <input
            id="record-image-edit"
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{ display: "none" }}
          />
          {imagePreview && (
            <button
              onClick={() => setImagePreview(null)}
              style={{
                marginTop: "8px",
                background: "none",
                border: "none",
                color: "var(--danger)",
                fontSize: "12px",
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Remove photo
            </button>
          )}
        </div>

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
