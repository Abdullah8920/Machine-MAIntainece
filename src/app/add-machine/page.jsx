"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { addMachineEntry } from "@/services/machineService";

const initialForm = {
  clientName: "",
  companyName: "",
  machineName: "",
  date: "",
  defect: "",
  cost: "",
  remarks: "",
};

export default function AddMachine() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

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

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const required = ["clientName", "companyName", "machineName", "date", "defect", "cost"];
    const missing = required.some((key) => !form[key]);
    if (missing) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");
    setSaving(true);

    try {
      const { clientId } = await addMachineEntry({ ...form, image: imagePreview });
      router.push(`/client/${clientId}`);
    } catch (err) {
      console.error(err);
      setError("Could not save. Check your Firebase config and internet connection.");
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <Header title="Add Machine Detail" back />
      <div className="page-content">
        <Input label="Client Name" name="clientName" value={form.clientName} onChange={handleChange} required />
        <Input label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} required />
        <Input label="Machine Name" name="machineName" value={form.machineName} onChange={handleChange} required />
        <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
        <Input label="Defect" name="defect" as="textarea" value={form.defect} onChange={handleChange} required />
        <Input label="Cost" name="cost" type="number" value={form.cost} onChange={handleChange} required />
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
            Upload Image
          </label>

          <label
            htmlFor="machine-image"
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
            id="machine-image"
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{ display: "none" }}
          />
        </div>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "13px", marginBottom: "14px" }}>{error}</p>
        )}

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
