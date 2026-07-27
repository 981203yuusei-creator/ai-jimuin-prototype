"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { combineJstDateTime } from "../../lib/time";

const STATUS_OPTIONS = [
  { value: "completed", label: "受付完了(対応待ち)" },
  { value: "done", label: "作業完了" },
];

const EMPTY = {
  name: "",
  phone: "",
  address: "",
  workType: "",
  status: "completed",
  scheduledDate: "",
  scheduledTime: "",
  quoteAmount: "",
};

export default function AddJobForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [memo, setMemo] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [values, setValues] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleExtract() {
    if (!memo.trim()) return;
    setExtracting(true);
    setExtractError(null);
    const res = await fetch("/api/dashboard/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: memo }),
    });
    setExtracting(false);
    if (!res.ok) {
      setExtractError("自動入力に失敗しました。下の項目を手入力してください。");
      return;
    }
    const body = await res.json();
    setValues((prev) => ({
      ...prev,
      name: body.name ?? prev.name,
      phone: body.phone ?? prev.phone,
      address: body.address ?? prev.address,
      workType: body.workType ?? prev.workType,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/dashboard/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        phone: values.phone,
        address: values.address,
        workType: values.workType,
        status: values.status,
        scheduledAt: combineJstDateTime(values.scheduledDate, values.scheduledTime),
        quoteAmount: values.quoteAmount,
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      setValues(EMPTY);
      setMemo("");
      setOpen(false);
      router.refresh();
    }
  }

  const inputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const, fontSize: 16 };

  if (!open) {
    return (
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setOpen(true)}>+ 電話受付を追加</button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 16, maxWidth: 400 }}
    >
      <strong>電話受付を追加</strong>

      <div style={{ marginTop: 10, padding: 10, backgroundColor: "#f5f5f5", borderRadius: 6 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>
          電話の内容をそのままメモしてください(AIが自動で項目に振り分けます)
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          placeholder="例: 山田さん 090-1234-5678 横浜市西区 エアコン故障 急ぎ"
          style={{ ...inputStyle, backgroundColor: "#fff" }}
        />
        <button
          type="button"
          onClick={handleExtract}
          disabled={extracting || !memo.trim()}
          style={{ marginTop: 6 }}
        >
          {extracting ? "AIが読み取り中..." : "AIで自動入力"}
        </button>
        {extractError && <p style={{ color: "red", fontSize: 12, marginTop: 6 }}>{extractError}</p>}
      </div>

      <p style={{ fontSize: 12, color: "#666", marginTop: 12 }}>
        内容を確認・修正してから追加してください。
      </p>

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
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>作業内容</label>
        <input
          value={values.workType}
          onChange={(e) => set("workType", e.target.value)}
          style={inputStyle}
        />
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
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
          訪問予定日時(任意)
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="date"
            value={values.scheduledDate}
            onChange={(e) => set("scheduledDate", e.target.value)}
            style={inputStyle}
          />
          <input
            type="time"
            value={values.scheduledTime}
            onChange={(e) => set("scheduledTime", e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
          見積金額(円・任意)
        </label>
        <input
          type="number"
          value={values.quoteAmount}
          onChange={(e) => set("quoteAmount", e.target.value)}
          style={inputStyle}
        />
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
