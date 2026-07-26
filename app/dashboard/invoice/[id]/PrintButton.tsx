"use client";

export default function PrintButton() {
  return <button onClick={() => window.print()}>印刷 / PDFに保存</button>;
}
