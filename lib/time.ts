export const JST_TIME_ZONE = "Asia/Tokyo";

export function todayInJst(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: JST_TIME_ZONE }).format(new Date());
}

export function splitJstDateTime(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: "", time: "" };

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: JST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

export function combineJstDateTime(date: string, time: string): string | null {
  if (!date || !time) return null;
  return `${date}T${time}:00+09:00`;
}

export function addHoursIso(iso: string, hours: number): string {
  const d = new Date(iso);
  d.setUTCHours(d.getUTCHours() + hours);
  return d.toISOString();
}
