"use client";

import { useState } from "react";

export type JobRow = {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  workType: string | null;
  urgency: string;
  status: string;
  calendarEventId: string | null;
  createdAt: string;
  photoUrl: string | null;
  reportComment: string | null;
  reportPhotoUrl: string | null;
  reportWorkerName: string | null;
  reportStartedAt: string | null;
  reportCompletedAt: string | null;
};

function formatJstDate(value: string | null): string | null {
  return value
    ? new Date(value).toLocaleDateString("ja-JP", {
        timeZone: "Asia/Tokyo",
        month: "numeric",
        day: "numeric",
      })
    : null;
}

function formatJstTime(value: string | null): string | null {
  return value
    ? new Date(value).toLocaleTimeString("ja-JP", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
}

const URGENCY_OPTIONS = [
  { value: "high", label: "急ぎ" },
  { value: "normal", label: "通常" },
  { value: "low", label: "低" },
];

const STATUS_OPTIONS = [
  { value: "collecting", label: "受付中" },
  { value: "completed", label: "受付完了(対応待ち)" },
  { value: "done", label: "作業完了" },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  collecting: { bg: "#dbeafe", color: "#1e40af" },
  completed: { bg: "#fef3c7", color: "#92400e" },
  done: { bg: "#d1fae5", color: "#065f46" },
};

function useEditableJob(job: JobRow) {
  const [values, setValues] = useState({
    name: job.name ?? "",
    phone: job.phone ?? "",
    address: job.address ?? "",
    workType: job.workType ?? "",
    urgency: job.urgency,
    status: job.status,
  });
  const [calendarEventId, setCalendarEventId] = useState(job.calendarEventId);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/dashboard/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) {
      const body = await res.json();
      setCalendarEventId(body.job.calendarEventId);
      setSavedAt(Date.now());
    }
  }

  async function handleDelete() {
    const label = [values.name, values.workType].filter(Boolean).join(" / ") || "この案件";
    if (!confirm(`${label}を削除します。この操作は取り消せません。よろしいですか?`)) return;

    setDeleting(true);
    const res = await fetch(`/api/dashboard/jobs/${job.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      setDeleted(true);
    }
  }

  return { values, set, calendarEventId, saving, savedAt, handleSave, deleting, deleted, handleDelete };
}

function OpenReportButton({ jobId }: { jobId: string }) {
  return (
    <a
      href={`/report/${jobId}`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-block",
        padding: "6px 12px",
        border: "1px solid #999",
        borderRadius: 4,
        whiteSpace: "nowrap",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      報告書を開く
    </a>
  );
}

function ReportSummary({ job }: { job: JobRow }) {
  const workDate = formatJstDate(job.reportCompletedAt ?? job.reportStartedAt);
  const startTime = formatJstTime(job.reportStartedAt);
  const endTime = formatJstTime(job.reportCompletedAt);

  if (!job.reportPhotoUrl && !job.reportWorkerName && !workDate && !job.reportComment) {
    return <>-</>;
  }

  return (
    <>
      {job.reportPhotoUrl && (
        <a href={job.reportPhotoUrl} target="_blank" rel="noreferrer">
          <img src={job.reportPhotoUrl} alt="作業完了写真" style={{ height: 48, display: "block" }} />
        </a>
      )}
      {job.reportWorkerName && (
        <div style={{ fontSize: 12, marginTop: 4 }}>担当: {job.reportWorkerName}</div>
      )}
      {workDate && (
        <div style={{ fontSize: 12, color: "#555" }}>
          {workDate} {startTime ?? "?"} 〜 {endTime ?? "?"}
        </div>
      )}
      {job.reportComment && (
        <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{job.reportComment}</div>
      )}
    </>
  );
}

function StatusSelect({
  value,
  onChange,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: 4,
        boxSizing: "border-box",
        backgroundColor: STATUS_COLORS[value]?.bg,
        color: STATUS_COLORS[value]?.color,
        fontWeight: 600,
        border: "none",
        borderRadius: 4,
        fontSize: 16,
        ...style,
      }}
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function EditableRow({ job }: { job: JobRow }) {
  const { values, set, calendarEventId, saving, savedAt, handleSave, deleting, deleted, handleDelete } =
    useEditableJob(job);
  const inputStyle = { width: "100%", padding: 4, boxSizing: "border-box" as const };
  const selectStyle = { ...inputStyle, minWidth: 90 };

  if (deleted) return null;

  return (
    <tr style={{ borderBottom: "1px solid #eee" }}>
      <td style={{ padding: 8, whiteSpace: "nowrap" }}>
        {new Date(job.createdAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
      </td>
      <td style={{ padding: 8, minWidth: 140 }}>
        <StatusSelect value={values.status} onChange={(v) => set("status", v)} style={{ minWidth: 90 }} />
      </td>
      <td style={{ padding: 8 }}>
        <input value={values.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8 }}>
        <input value={values.phone} onChange={(e) => set("phone", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8 }}>
        <input value={values.address} onChange={(e) => set("address", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8 }}>
        <input value={values.workType} onChange={(e) => set("workType", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8, minWidth: 80 }}>
        <select
          value={values.urgency}
          onChange={(e) => set("urgency", e.target.value)}
          style={selectStyle}
        >
          {URGENCY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </td>
      <td style={{ padding: 8 }}>
        {job.photoUrl ? (
          <a href={job.photoUrl} target="_blank" rel="noreferrer">
            <img src={job.photoUrl} alt="現場写真" style={{ height: 48 }} />
          </a>
        ) : (
          "-"
        )}
      </td>
      <td style={{ padding: 8 }}>{calendarEventId ? "登録済み" : "-"}</td>
      <td style={{ padding: 8, maxWidth: 220 }}>
        <ReportSummary job={job} />
      </td>
      <td style={{ padding: 8 }}>
        <OpenReportButton jobId={job.id} />
      </td>
      <td style={{ padding: 8, whiteSpace: "nowrap" }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </button>
        {savedAt && <span style={{ marginLeft: 6, color: "green" }}>✓</span>}
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ marginLeft: 6, color: "#b91c1c" }}
        >
          {deleting ? "削除中..." : "削除"}
        </button>
      </td>
    </tr>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 10 }}>
      <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>{label}</label>
      {children}
    </div>
  );
}

function JobCard({ job }: { job: JobRow }) {
  const { values, set, calendarEventId, saving, savedAt, handleSave, deleting, deleted, handleDelete } =
    useEditableJob(job);
  const cardInputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const, fontSize: 16 };

  if (deleted) return null;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#666" }}>
          {new Date(job.createdAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
        </span>
      </div>
      <div style={{ marginTop: 8 }}>
        <StatusSelect value={values.status} onChange={(v) => set("status", v)} style={{ width: "100%" }} />
      </div>
      <Field label="お名前">
        <input value={values.name} onChange={(e) => set("name", e.target.value)} style={cardInputStyle} />
      </Field>
      <Field label="電話番号">
        <input value={values.phone} onChange={(e) => set("phone", e.target.value)} style={cardInputStyle} />
      </Field>
      <Field label="住所">
        <input value={values.address} onChange={(e) => set("address", e.target.value)} style={cardInputStyle} />
      </Field>
      <Field label="工事内容">
        <input
          value={values.workType}
          onChange={(e) => set("workType", e.target.value)}
          style={cardInputStyle}
        />
      </Field>
      <Field label="緊急度">
        <select
          value={values.urgency}
          onChange={(e) => set("urgency", e.target.value)}
          style={cardInputStyle}
        >
          {URGENCY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="写真">
        {job.photoUrl ? (
          <a href={job.photoUrl} target="_blank" rel="noreferrer">
            <img src={job.photoUrl} alt="現場写真" style={{ height: 64 }} />
          </a>
        ) : (
          "-"
        )}
      </Field>
      <Field label="カレンダー">{calendarEventId ? "登録済み" : "-"}</Field>
      <Field label="作業報告">
        <ReportSummary job={job} />
      </Field>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <OpenReportButton jobId={job.id} />
        <button onClick={handleSave} disabled={saving} style={{ padding: "6px 12px" }}>
          {saving ? "保存中..." : "保存"}
        </button>
        {savedAt && <span style={{ color: "green", alignSelf: "center" }}>✓</span>}
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ padding: "6px 12px", color: "#b91c1c" }}
        >
          {deleting ? "削除中..." : "削除"}
        </button>
      </div>
    </div>
  );
}

export default function JobsTable({ jobs }: { jobs: JobRow[] }) {
  if (jobs.length === 0) {
    return <p>まだ案件がありません。</p>;
  }

  return (
    <div>
      <div className="jobs-table-desktop">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
              <th style={{ padding: 8 }}>受付日時</th>
              <th style={{ padding: 8 }}>状態</th>
              <th style={{ padding: 8 }}>お名前</th>
              <th style={{ padding: 8 }}>電話番号</th>
              <th style={{ padding: 8 }}>住所</th>
              <th style={{ padding: 8 }}>工事内容</th>
              <th style={{ padding: 8 }}>緊急度</th>
              <th style={{ padding: 8 }}>写真</th>
              <th style={{ padding: 8 }}>カレンダー</th>
              <th style={{ padding: 8 }}>作業報告</th>
              <th style={{ padding: 8 }}></th>
              <th style={{ padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <EditableRow key={job.id} job={job} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="jobs-cards-mobile">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <style jsx>{`
        .jobs-table-desktop {
          display: block;
          overflow-x: auto;
        }
        .jobs-cards-mobile {
          display: none;
        }
        @media (max-width: 800px) {
          .jobs-table-desktop {
            display: none;
          }
          .jobs-cards-mobile {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
