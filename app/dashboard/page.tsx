import { headers } from "next/headers";
import { getCompanyById } from "../../lib/companies";
import { listJobsForCompany } from "../../lib/jobsRepo";
import { getSignedPhotoUrl } from "../../lib/storage";
import LogoutButton from "./LogoutButton";
import JobsTable from "./JobsTable";

export default async function DashboardPage() {
  const companyId = headers().get("x-company-id") ?? "";
  const [company, jobs] = await Promise.all([
    getCompanyById(companyId),
    listJobsForCompany(companyId),
  ]);

  const jobRows = await Promise.all(
    jobs.map(async (job) => ({
      ...job,
      photoUrl: job.photoPath ? await getSignedPhotoUrl(job.photoPath) : null,
      reportPhotoUrl: job.reportPhotoPath ? await getSignedPhotoUrl(job.reportPhotoPath) : null,
    }))
  );

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 20 }}>案件一覧{company ? ` - ${company.name}` : ""}</h1>
        <LogoutButton />
      </div>

      <JobsTable jobs={jobRows} />
    </div>
  );
}
