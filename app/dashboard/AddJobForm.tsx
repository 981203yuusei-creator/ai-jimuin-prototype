"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const URGENCY_OPTIONS = [
  { value: "high", label: "急ぎ" },
  { value: "normal", label: "通常" },
  { value: "low", label: "低" },
];

const STATUS_OPTIONS = [
  { value: "completed", label: "受付完了(対応待ち)" },
  { value: "done", label: "作業完了" },
];

const EMPTY = { name: "", phone: "", address: "", workType: "", urgency: "normal", status: "completed" };

export default function AddJobForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/dashboard/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSubmitting(false);
    if (res.ok) {
      setValues(EMPTY);
      setOpen(false);
      router.refresh();
    }
  }

  const inputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const, fontSize: 16 };

  if (!open) {
    return (
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setOpen(true)}>+ 電話受付を手入力で追加</button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 16, maxWidth: 400 }}
    >
      <strong>電話受付を手入力で追加</strong>
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>お名前</label>
        <input value={values.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>電話番号</label>
        <input value={values.phone} onChange={(e) => set("phone", e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>住所</label>
        <input value={values.address} onChange={(e) => set("address", e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>工事内容</label>
        <input
          value={values.workType}
          onChange={(e) => set("workType", e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>緊急度</label>
        <select value={values.urgency} onChange={(e) => set("urgency", e.target.value)} style={inputStyle}>
          {URGENCY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>状態</label>
        <select value={values.status} onChange={(e) => set("status", e.target.value)} style={inputStyle}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="submit" disabled={submitting}>
          {submitting ? "追加中..." : "追加する"}
        </button>
        <button type="button" onClick={() => setOpen(false)}>
          キャンセル
        </button>
      </div>
    </form>
  );
}
