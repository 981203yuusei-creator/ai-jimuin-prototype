"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { splitJstDateTime, combineJstDateTime } from "../../lib/time";

export type JobRow = {
  id: string;
  jobNumber: number | null;
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
  isPaid: boolean;
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
  const router = useRouter();
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
    isPaid: job.isPaid,
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
        isPaid: current.isPaid,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSavedAt(Date.now());
      // 未回収金額などの集計はサーバー側で計算しているため、保存後に再取得して反映する。
      router.refresh();
    }
  }

  function handleSave() {
    return save();
  }

  // テキスト系の項目は、入力欄からフォーカスが外れた瞬間に自動保存する(Excelのセル移動時の確定と同じ挙動)。
  function handleBlurSave() {
    save();
  }

  // ステータスは選択した瞬間に保存する(「保存」の押し忘れで元に戻ったように見える事故を防ぐ)。
  function handleStatusChange(newStatus: string) {
    set("status", newStatus);
    save({ status: newStatus });
  }

  // 入金済みチェックも同様に、チェックした瞬間に保存する。
  function handleIsPaidChange(newIsPaid: boolean) {
    setValues((prev) => ({ ...prev, isPaid: newIsPaid }));
    save({ isPaid: newIsPaid });
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
    handleBlurSave,
    handleStatusChange,
    handleIsPaidChange,
    deleting,
    deleted,
    handleDelete,
  };
}

function ShareInstructionButton({ jobId }: { jobId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/report/${jobId}`;
    const shareNavigator = navigator as Navigator & {
      share?: (data: { title?: string; url?: string }) => Promise<void>;
    };

    if (shareNavigator.share) {
      try {
        await shareNavigator.share({ title: "作業指示書", url });
      } catch {
        // 共有シートを閉じた/キャンセルした場合は何もしない
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" as const }}>
      <button
        type="button"
        onClick={handleShare}
        style={{
          padding: "6px 12px",
          border: "1px solid #999",
          borderRadius: 4,
          whiteSpace: "nowrap",
          backgroundColor: "#fff",
        }}
      >
        作業指示書を送る
      </button>
      <a
        href={`/report/${jobId}`}
        target="_blank"
        rel="noreferrer"
        style={{ fontSize: 12, color: "#555", whiteSpace: "nowrap" }}
      >
        開く
      </a>
      {copied && <span style={{ fontSize: 12, color: "green" }}>コピーしました</span>}
    </div>
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
  onBlur,
  style,
}: {
  date: string;
  time: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  onBlur?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", gap: 4, ...style }}>
      <input
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        onBlur={onBlur}
        style={{ padding: 4, fontSize: 14, flex: 1, minWidth: 120 }}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => onTimeChange(e.target.value)}
        onBlur={onBlur}
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
    handleBlurSave,
    handleStatusChange,
    handleIsPaidChange,
    deleting,
    deleted,
    handleDelete,
  } = useEditableJob(job);
  const inputStyle = { width: "100%", padding: 4, boxSizing: "border-box" as const };

  if (deleted) return null;

  return (
    <tr style={{ borderBottom: "1px solid #eee" }}>
      <td style={{ padding: 8, whiteSpace: "nowrap" }}>{job.jobNumber ?? "-"}</td>
      <td style={{ padding: 8, whiteSpace: "nowrap" }}>
        {new Date(job.createdAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
      </td>
      <td style={{ padding: 8, minWidth: 140 }}>
        <StatusSelect value={values.status} onChange={handleStatusChange} style={{ minWidth: 90 }} />
      </td>
      <td style={{ padding: 8, minWidth: 110 }}>
        <input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={handleBlurSave}
          style={inputStyle}
        />
      </td>
      <td style={{ padding: 8, minWidth: 130 }}>
        <input
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          onBlur={handleBlurSave}
          style={inputStyle}
        />
      </td>
      <td style={{ padding: 8, minWidth: 160 }}>
        <input
          value={values.address}
          onChange={(e) => set("address", e.target.value)}
          onBlur={handleBlurSave}
          style={inputStyle}
        />
      </td>
      <td style={{ padding: 8, minWidth: 140 }}>
        <input
          value={values.workType}
          onChange={(e) => set("workType", e.target.value)}
          onBlur={handleBlurSave}
          style={inputStyle}
        />
      </td>
      <td style={{ padding: 8, minWidth: 230 }}>
        <ScheduleInputs
          date={values.scheduledDate}
          time={values.scheduledTime}
          onDateChange={(v) => set("scheduledDate", v)}
          onTimeChange={(v) => set("scheduledTime", v)}
          onBlur={handleBlurSave}
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
          onBlur={handleBlurSave}
          placeholder="見積額"
          style={inputStyle}
        />
      </td>
      <td style={{ padding: 8, minWidth: 100 }}>
        <input
          type="number"
          value={values.invoiceAmount}
          onChange={(e) => set("invoiceAmount", e.target.value)}
          onBlur={handleBlurSave}
          placeholder="請求額"
          style={inputStyle}
        />
      </td>
      <td style={{ padding: 8, textAlign: "center" }}>
        <input
          type="checkbox"
          checked={values.isPaid}
          onChange={(e) => handleIsPaidChange(e.target.checked)}
          style={{ width: 18, height: 18 }}
        />
      </td>
      <td style={{ padding: 8, minWidth: 140 }}>
        <input
          value={values.invoiceNote}
          onChange={(e) => set("invoiceNote", e.target.value)}
          onBlur={handleBlurSave}
          placeholder="備考"
          style={inputStyle}
        />
      </td>
      <td style={{ padding: 8 }}>
        <ShareInstructionButton jobId={job.id} />
      </td>
      <td style={{ padding: 8 }}>
        <InvoiceLinks jobId={job.id} />
      </td>
      <td style={{ padding: 8, whiteSpace: "nowrap" }}>
        {saving ? (
          <span style={{ color: "#888", fontSize: 12 }}>保存中...</span>
        ) : savedAt ? (
          <span style={{ color: "green", fontSize: 12 }}>✓ 保存済み</span>
        ) : null}
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
    handleBlurSave,
    handleStatusChange,
    handleIsPaidChange,
    deleting,
    deleted,
    handleDelete,
  } = useEditableJob(job);
  const cardInputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const, fontSize: 16 };

  if (deleted) return null;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>No. {job.jobNumber ?? "-"}</span>
        <span style={{ fontSize: 12, color: "#666" }}>
          {new Date(job.createdAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
        </span>
      </div>
      <div style={{ marginTop: 8 }}>
        <StatusSelect value={values.status} onChange={handleStatusChange} style={{ width: "100%" }} />
      </div>
      <Field label="お名前">
        <input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={handleBlurSave}
          style={cardInputStyle}
        />
      </Field>
      <Field label="電話番号">
        <input
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          onBlur={handleBlurSave}
          style={cardInputStyle}
        />
      </Field>
      <Field label="住所">
        <input
          value={values.address}
          onChange={(e) => set("address", e.target.value)}
          onBlur={handleBlurSave}
          style={cardInputStyle}
        />
      </Field>
      <Field label="作業内容">
        <input
          value={values.workType}
          onChange={(e) => set("workType", e.target.value)}
          onBlur={handleBlurSave}
          style={cardInputStyle}
        />
      </Field>
      <Field label="訪問予定日時">
        <ScheduleInputs
          date={values.scheduledDate}
          time={values.scheduledTime}
          onDateChange={(v) => set("scheduledDate", v)}
          onTimeChange={(v) => set("scheduledTime", v)}
          onBlur={handleBlurSave}
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
          onBlur={handleBlurSave}
          style={cardInputStyle}
        />
      </Field>
      <Field label="請求金額(円)">
        <input
          type="number"
          value={values.invoiceAmount}
          onChange={(e) => set("invoiceAmount", e.target.value)}
          onBlur={handleBlurSave}
          style={cardInputStyle}
        />
      </Field>
      <Field label="入金済み">
        <input
          type="checkbox"
          checked={values.isPaid}
          onChange={(e) => handleIsPaidChange(e.target.checked)}
          style={{ width: 20, height: 20 }}
        />
      </Field>
      <Field label="備考(見積書・請求書に表示)">
        <textarea
          value={values.invoiceNote}
          onChange={(e) => set("invoiceNote", e.target.value)}
          onBlur={handleBlurSave}
          rows={2}
          style={cardInputStyle}
        />
      </Field>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <ShareInstructionButton jobId={job.id} />
        <InvoiceLinks jobId={job.id} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
        {saving ? (
          <span style={{ color: "#888", fontSize: 13 }}>保存中...</span>
        ) : savedAt ? (
          <span style={{ color: "green", fontSize: 13 }}>✓ 保存済み</span>
        ) : null}
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

const FILTER_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "collecting", label: "受付中" },
  { value: "completed", label: "対応待ち" },
  { value: "done", label: "作業完了" },
  { value: "unpaid", label: "未回収のみ" },
];

function matchesSearch(job: JobRow, keyword: string): boolean {
  if (!keyword) return true;
  const haystack = [job.name, job.phone, job.address, job.workType, job.invoiceNote]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(keyword.toLowerCase());
}

function matchesFilter(job: JobRow, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "unpaid") return !job.isPaid && !!job.invoiceAmount;
  return job.status === filter;
}

export default function JobsTable({ jobs }: { jobs: JobRow[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  if (jobs.length === 0) {
    return <p>まだ案件がありません。</p>;
  }

  const filteredJobs = jobs.filter((job) => matchesSearch(job, search) && matchesFilter(job, filter));

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="名前・電話番号・住所・作業内容で検索"
          style={{ padding: 8, fontSize: 14, minWidth: 240, flex: "1 1 240px", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {FILTER_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setFilter(o.value)}
              style={{
                padding: "6px 10px",
                fontSize: 13,
                borderRadius: 4,
                border: filter === o.value ? "1px solid #2563eb" : "1px solid #ccc",
                backgroundColor: filter === o.value ? "#dbeafe" : "#fff",
                color: filter === o.value ? "#1e40af" : "#333",
                cursor: "pointer",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "#888" }}>{filteredJobs.length}件表示中(全{jobs.length}件)</span>
      </div>

      {filteredJobs.length === 0 && <p style={{ color: "#888" }}>該当する案件がありません。</p>}

      <div className="jobs-table-desktop">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
              <th style={{ padding: 8 }}>No.</th>
              <th style={{ padding: 8 }}>受付日時</th>
              <th style={{ padding: 8 }}>状態</th>
              <th style={{ padding: 8 }}>お名前</th>
              <th style={{ padding: 8 }}>電話番号</th>
              <th style={{ padding: 8 }}>住所</th>
              <th style={{ padding: 8 }}>作業内容</th>
              <th style={{ padding: 8 }}>訪問予定日時</th>
              <th style={{ padding: 8 }}>写真</th>
              <th style={{ padding: 8 }}>作業報告</th>
              <th style={{ padding: 8 }}>見積額</th>
              <th style={{ padding: 8 }}>請求額</th>
              <th style={{ padding: 8 }}>入金</th>
              <th style={{ padding: 8 }}>備考</th>
              <th style={{ padding: 8 }}></th>
              <th style={{ padding: 8 }}></th>
              <th style={{ padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <EditableRow key={job.id} job={job} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="jobs-cards-mobile">
        {filteredJobs.map((job) => (
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
