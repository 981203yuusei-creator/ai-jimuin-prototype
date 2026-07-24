export const JST_TIME_ZONE = "Asia/Tokyo";

export function todayInJst(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: JST_TIME_ZONE }).format(new Date());
}
