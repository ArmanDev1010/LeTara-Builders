import SiteShell from "@/components/UI/SiteShell";

// Every page of the website, inside its navbar, footer, quote dialog and
// page transition (UI/SiteShell). Its own group, so the projects editor
// (app/keystatic) gets the page without them.
export default function SiteLayout({ children }) {
  return <SiteShell>{children}</SiteShell>;
}
