import type { Metadata } from "next";

const SITE_URL = "https://ai-jimuin-prototype-shimo1.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ジムアシ | 電気工事・水道工事の事務をAIとLINEで自動化",
    template: "%s | ジムアシ",
  },
  description:
    "現場に集中。事務はAIに。LINEでのお客様対応・AIによる自動入力・スケジュール管理・見積書/請求書作成・確定申告対応まで、電気工事・水道工事の小規模事業者向け事務アシスタントSaaS「ジムアシ」。月額9,800円。",
  keywords: [
    "電気工事 事務代行",
    "水道工事 事務代行",
    "LINE 顧客管理",
    "職人 事務効率化",
    "個人事業主 見積書 請求書",
    "工事業 スケジュール管理",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "ジムアシ",
    title: "ジムアシ | 電気工事・水道工事の事務をAIとLINEで自動化",
    description: "現場に集中。事務はAIに。LINEとAIで、電気工事・水道工事の事務作業をまるごとサポート。",
  },
  twitter: {
    card: "summary_large_image",
    title: "ジムアシ | 電気工事・水道工事の事務をAIとLINEで自動化",
    description: "現場に集中。事務はAIに。LINEとAIで、電気工事・水道工事の事務作業をまるごとサポート。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
