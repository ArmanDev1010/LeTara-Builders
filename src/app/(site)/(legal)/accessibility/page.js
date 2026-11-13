import LegalPage, { legalMetadata } from "@/components/Legal/LegalPage";

export const metadata = legalMetadata("accessibility");

export default function Page() {
  return <LegalPage slug="accessibility" />;
}
