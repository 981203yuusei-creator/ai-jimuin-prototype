"use client";

export default function LogoutButton() {
  async function handleClick() {
    await fetch("/api/dashboard/logout", { method: "POST" });
    window.location.href = "/dashboard/login";
  }

  return (
    <button onClick={handleClick} style={{ padding: "4px 12px" }}>
      ログアウト
    </button>
  );
}
