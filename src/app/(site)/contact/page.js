import ContactPage, { CONTACT_PAGE } from "@/components/Contact/ContactPage";
import { CONTACT_HREF } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({ ...CONTACT_PAGE, path: CONTACT_HREF });

export default function Page() {
  return <ContactPage />;
}
