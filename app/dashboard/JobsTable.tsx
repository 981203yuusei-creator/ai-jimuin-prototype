"use client";

import { useState } from "react";
import { splitJstDateTime, combineJstDateTime } from "../../lib/time";

export type JobRow = {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  workType: string | null;
  status: string;
  calendarEventId: string | null;
  createdAt: string;
  photoUrl: string | null;
  reportComment: string | null;
  reportPhotoUrl: string | null;
  reportWorkerName: string | null;
  reportStartedAt: string | null;
  reportCompletedAt: string | null;
  scheduledAt: string | null;
  quoteAmount: number | null;
  invoiceAmount: number | null;
  invoiceNote: string | null;
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
  const initialSchedule = splitJstDateTime(job.scheduledAt);
  const [values, setValues] = useState({
    name: job.name ?? "",
    phone: job.phone ?? "",
    address: job.address ?? "",
    workType: job.workType ?? "",
    status: job.status,
    scheduledDate: initialSchedule.date,
    scheduledTime: initialSchedule.time,
    quoteAmount: job.quoteAmount?.toString() ?? "",
    invoiceAmount: job.invoiceAmount?.toString() ?? "",
    invoiceNote: job.invoiceNote ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function save(overrides?: Partial<typeof values>) {
    const current = { ...values, ...overrides };
    setSaving(true);
    const res = await fetch(`/api/dashboard/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: current.name,
        phone: current.phone,
        address: current.address,
        workType: current.workType,
        status: current.status,
        scheduledAt: combineJstDateTime(current.scheduledDate, current.scheduledTime),
        quoteAmount: current.quoteAmount,
        invoiceAmount: current.invoiceAmount,
        invoiceNote: current.invoiceNote,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSavedAt(Date.now());
    }
  }

  function handleSave() {
    return save();
  }

  // ステータスは選択した瞬間に保存する(「保存」の押し忘れで元に戻ったように見える事故を防ぐ)。
  function handleStatusChange(newStatus: string) {
    set("status", newStatus);
    save({ status: newStatus });
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

  return {
    values,
    set,
    saving,
    savedAt,
    handleSave,
    handleStatusChange,
    deleting,
    deleted,
    handleDelete,
  };
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

function InvoiceLinks({ jobId }: { jobId: string }) {
  const linkStyle = {
    display: "inline-block",
    padding: "6px 12px",
    border: "1px solid #999",
    borderRadius: 4,
    whiteSpace: "nowrap" as const,
    textDecoration: "none",
    color: "inherit",
  };
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
      <a href={`/dashboard/invoice/${jobId}?type=quote`} target="_blank" rel="noreferrer" style={linkStyle}>
        見積書
      </a>
      <a
        href={`/dashboard/invoice/${jobId}?type=invoice`}
        target="_blank"
        rel="noreferrer"
        style={linkStyle}
      >
        請求書
      </a>
    </div>
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
          <img src={job.reportPhotoUrl} alt="作業完了写真" style={{ height: 120, display: "block" }} />
        </a>
      )}
      {job.reportWorkerName && (
        <div style={{ fontSize: 14, marginTop: 4 }}>担当: {job.reportWorkerName}</div>
      )}
      {workDate && (
        <div style={{ fontSize: 14, color: "#555" }}>
          {workDate} {startTime ?? "?"} 〜 {endTime ?? "?"}
        </div>
      )}
      {job.reportComment && (
        <div style={{ fontSize: 14, color: "#555", marginTop: 4, whiteSpace: "pre-wrap" }}>
          {job.reportComment}
        </div>
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

function ScheduleInputs({
  date,
  time,
  onDateChange,
  onTimeChange,
  style,
}: {
  date: string;
  time: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", gap: 4, ...style }}>
      <input
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        style={{ padding: 4, fontSize: 14, flex: 1, minWidth: 120 }}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => onTimeChange(e.target.value)}
        style={{ padding: 4, fontSize: 14, flex: 1, minWidth: 90 }}
      />
    </div>
  );
}

function EditableRow({ job }: { job: JobRow }) {
  const {
    values,
    set,
    saving,
    savedAt,
    handleSave,
    handleStatusChange,
    deleting,
    deleted,
    handleDelete,
  } = useEditableJob(job);
  const inputStyle = { width: "100%", padding: 4, boxSizing: "border-box" as const };

  if (deleted) return null;

  return (
    <tr style={{ borderBottom: "1px solid #eee" }}>
      <td style={{ padding: 8, whiteSpace: "nowrap" }}>
        {new Date(job.createdAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
      </td>
      <td style={{ padding: 8, minWidth: 140 }}>
        <StatusSelect value={values.status} onChange={handleStatusChange} style={{ minWidth: 90 }} />
      </td>
      <td style={{ padding: 8, minWidth: 110 }}>
        <input value={values.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8, minWidth: 130 }}>
        <input value={values.phone} onChange={(e) => set("phone", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8, minWidth: 160 }}>
        <input value={values.address} onChange={(e) => set("address", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8, minWidth: 140 }}>
        <input value={values.workType} onChange={(e) => set("workType", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8, minWidth: 230 }}>
        <ScheduleInputs
          date={values.scheduledDate}
          time={values.scheduledTime}
          onDateChange={(v) => set("scheduledDate", v)}
          onTimeChange={(v) => set("scheduledTime", v)}
        />
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
      <td style={{ padding: 8, minWidth: 260 }}>
        <ReportSummary job={job} />
      </td>
      <td style={{ padding: 8, minWidth: 100 }}>
        <input
          type="number"
          value={values.quoteAmount}
          onChange={(e) => set("quoteAmount", e.target.value)}
          placeholder="見積額"
          style={inputStyle}
        />
      </td>
      <td style={{ padding: 8, minWidth: 100 }}>
        <input
          type="number"
          value={values.invoiceAmount}
          onChange={(e) => set("invoiceAmount", e.target.value)}
          placeholder="請求額"
          style={inputStyle}
        />
      </td>
      <td style={{ padding: 8, minWidth: 140 }}>
        <input
          value={values.invoiceNote}
          onChange={(e) => set("invoiceNote", e.target.value)}
          placeholder="備考"
          style={inputStyle}
        />
      </td>
      <td style={{ padding: 8 }}>
        <OpenReportButton jobId={job.id} />
      </td>
      <td style={{ padding: 8 }}>
        <InvoiceLinks jobId={job.id} />
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
  const {
    values,
    set,
    saving,
    savedAt,
    handleSave,
    handleStatusChange,
    deleting,
    deleted,
    handleDelete,
  } = useEditableJob(job);
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
        <StatusSelect value={values.status} onChange={handleStatusChange} style={{ width: "100%" }} />
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
      <Field label="訪問予定日時">
        <ScheduleInputs
          date={values.scheduledDate}
          time={values.scheduledTime}
          onDateChange={(v) => set("scheduledDate", v)}
          onTimeChange={(v) => set("scheduledTime", v)}
          style={{ width: "100%" }}
        />
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
      <Field label="作業報告">
        <ReportSummary job={job} />
      </Field>
      <Field label="見積金額(円)">
        <input
          type="number"
          value={values.quoteAmount}
          onChange={(e) => set("quoteAmount", e.target.value)}
          style={cardInputStyle}
        />
      </Field>
      <Field label="請求金額(円)">
        <input
          type="number"
          value={values.invoiceAmount}
          onChange={(e) => set("invoiceAmount", e.target.value)}
          style={cardInputStyle}
        />
      </Field>
      <Field label="備考(見積書・請求書に表示)">
        <textarea
          value={values.invoiceNote}
          onChange={(e) => set("invoiceNote", e.target.value)}
          rows={2}
          style={cardInputStyle}
        />
      </Field>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <OpenReportButton jobId={job.id} />
        <InvoiceLinks jobId={job.id} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
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
              <th style={{ padding: 8 }}>訪問予定日時</th>
              <th style={{ padding: 8 }}>写真</th>
              <th style={{ padding: 8 }}>作業報告</th>
              <th style={{ padding: 8 }}>見積額</th>
              <th style={{ padding: 8 }}>請求額</th>
              <th style={{ padding: 8 }}>備考</th>
              <th style={{ padding: 8 }}></th>
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
