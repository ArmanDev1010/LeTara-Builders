import LegalPage, { legalMetadata } from "@/components/Legal/LegalPage";

export const metadata = legalMetadata("terms-of-service");

export default function Page() {
  return <LegalPage slug="terms-of-service" />;
}
