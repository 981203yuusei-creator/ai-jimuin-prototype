import type { Metadata } from "next";

const SITE_URL = "https://ai-jimuin-prototype-shimo1.vercel.app";
const TITLE = "ジムアシ | 現場訪問サービス業の事務をAIとLINEで自動化";
const DESCRIPTION =
  "現場に集中。事務はAIに。LINEでのお客様対応・AIによる自動入力・スケジュール管理・見積書/請求書作成・確定申告対応まで、工事・修理・点検・清掃などの小規模事業者向け事務アシスタントSaaS「ジムアシ」。月額9,800円。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | ジムアシ",
  },
  description: DESCRIPTION,
  keywords: [
    "現場訪問サービス業 事務代行",
    "工事業 事務代行",
    "修理業 顧客管理",
    "LINE 顧客管理",
    "職人 事務効率化",
    "個人事業主 見積書 請求書",
    "出張サービス スケジュール管理",
  ],
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "kFE3r5ikSnVk7fg6OcL2v3RM2UvOY4wGuAqgm1MUEG8",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "ジムアシ",
    title: TITLE,
    description: "現場に集中。事務はAIに。LINEとAIで、現場訪問サービス業の事務作業をまるごとサポート。",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "現場に集中。事務はAIに。LINEとAIで、現場訪問サービス業の事務作業をまるごとサポート。",
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
