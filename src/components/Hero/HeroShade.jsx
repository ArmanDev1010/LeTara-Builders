// The shading every hero puts over its picture: darker where the navbar and
// the hero copy sit, so they read over any photo, while the middle of the
// picture stays clear. Shared by the homepage's build sequence and the
// service pages' hero, so they match.
export default function HeroShade() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.75),rgba(0,0,0,0.5)_40%,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] max-700:h-[72%] bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_22%_62%,rgba(0,0,0,0.65),rgba(0,0,0,0.35)_55%,transparent)] max-700:bg-[radial-gradient(ellipse_110%_50%_at_50%_70%,rgba(0,0,0,0.6),rgba(0,0,0,0.3)_60%,transparent)]" />
    </>
  );
}
