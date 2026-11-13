import LegalPage, { legalMetadata } from "@/components/Legal/LegalPage";

export const metadata = legalMetadata("sms-terms");

export default function Page() {
  return <LegalPage slug="sms-terms" />;
}
