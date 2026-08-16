import { NextRequest, NextResponse } from "next/server";
import { getCompanyByIntegrationApiKey } from "../../../../lib/companies";
import { listJobsForCompany } from "../../../../lib/jobsRepo";

// 外部サービス(AI売上監査等)向けの読み取り専用API。
// ダッシュボードのsession cookie認証とは別系統で、Authorization: Bearer <APIキー> のみで認証する。
// middleware.tsのmatcherには意図的に含めていない(含めるとsession cookie必須になってしまうため)。
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const key = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;

  if (!key) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const company = await getCompanyByIntegrationApiKey(key);
  if (!company) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const jobs = await listJobsForCompany(company.id);

  return NextResponse.json({
    company: { id: company.id, name: company.name },
    jobs,
  });
}
