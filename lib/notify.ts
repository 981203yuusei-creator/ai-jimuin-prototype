import { pushLineMessage } from "./line";
import { Company } from "./companies";

export async function notifyOwner(company: Company, message: string): Promise<void> {
  if (!company.ownerLineUserId || !company.lineChannelAccessToken) return;
  await pushLineMessage(company.ownerLineUserId, message, company.lineChannelAccessToken);
}
