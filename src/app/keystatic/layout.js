import KeystaticApp from "./keystatic";

export const metadata = {
  title: "Projects editor",
  robots: { index: false, follow: false },
};

// The projects editor at /keystatic (keystatic.config.js), outside the
// site's own layout (app/(site)): no navbar, footer or quote dialog. Its
// storage is local, so it only works while the site runs on this computer
// (npm run dev); a live build can't write files, so there it says so until
// it's switched to GitHub storage (see CLAUDE.md).
export default function KeystaticLayout() {
  if (process.env.NODE_ENV === "production") {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#0b0b0b", color: "#f5f5f5", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
        <p>The projects editor works while the site runs on its own computer: npm run dev, then localhost:3001/keystatic.</p>
      </main>
    );
  }
  return <KeystaticApp />;
}
