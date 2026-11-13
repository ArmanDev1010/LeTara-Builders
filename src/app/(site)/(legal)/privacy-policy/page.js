import LegalPage, { legalMetadata } from "@/components/Legal/LegalPage";

export const metadata = legalMetadata("privacy-policy");

export default function Page() {
  return <LegalPage slug="privacy-policy" />;
}
