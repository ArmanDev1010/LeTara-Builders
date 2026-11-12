import Image from "next/image";
import Link from "next/link";
import { PhotoStandIn } from "@/components/Home/parts";
import { SERVICES } from "@/data/services";

// a cut corner, top right, as on the site's cards
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,0_100%)]";

// One project as a card (lib/projects.js): its main photo, or a black
// stand-in with its first service's icon until it has one (as everywhere on
// the site), with "In progress" and "Sample" marks; under it the place and
// year, the name, the summary and the services. The whole card opens the
// project's page. Pointing at it (or tabbing to it) eases the photo closer
// and draws a gold rule along its foot; with Reduce Motion only the rule,
// fading in.
export default function ProjectCard({ project, sizes = "(min-width: 1080px) 33vw, (min-width: 700px) 50vw, 100vw" }) {
  const services = project.services.map((slug) => SERVICES.find((s) => s.slug === slug)).filter(Boolean);
  const Icon = services[0]?.icon;
  return (
    <Link
      href={project.href}
      className="group block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-third"
    >
      <div className={`relative aspect-[4/3] overflow-hidden bg-[#0b0b0b] ${CHAMFER}`}>
        {project.cover ? (
          <Image
            src={project.cover}
            alt={`${project.title}${project.city ? `, ${project.city}` : ""}`}
            fill
            sizes={sizes}
            className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] [transform:scale(1)] motion-safe:group-hover:[transform:scale(1.04)] motion-safe:group-focus-visible:[transform:scale(1.04)]"
          />
        ) : (
          <PhotoStandIn icon={Icon} />
        )}
        <span aria-hidden="true" className="pointer-events-none absolute top-0 left-[calc(100%-18px)] w-[26px] h-[1.5px] bg-third origin-left rotate-45" />
        <span className="pointer-events-none absolute left-4 top-4 flex gap-2">
          {project.status === "in-progress" && (
            <span className="bg-third px-2.5 py-1 font-script text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-950">In progress</span>
          )}
          {project.sample && (
            <span className="border border-white/30 bg-black/40 px-2.5 py-1 font-script text-[10.5px] uppercase tracking-[0.16em] text-white/80">Sample</span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-third origin-left transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform:scaleX(0)] group-hover:[transform:scaleX(1)] group-focus-visible:[transform:scaleX(1)] motion-reduce:[transform:none] motion-reduce:opacity-0 motion-reduce:group-hover:opacity-100 motion-reduce:group-focus-visible:opacity-100"
        />
      </div>
      <div className="pointer-events-none pt-5">
        <p className="font-script text-[11px] uppercase tracking-[0.2em] text-third">
          {project.city}
          {project.year ? ` · ${project.year}` : ""}
        </p>
        <h3 className="mt-2 font-display uppercase text-[26px] 700:text-[28px] leading-[0.95] tracking-[0.01em] text-neutral-950 transition-colors duration-300 group-hover:text-neutral-700">
          {project.title}
        </h3>
        <p className="mt-2.5 text-[15px] leading-relaxed text-neutral-600 line-clamp-2">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {services.map(({ slug, title, icon: ServiceIcon }) => (
            <li key={slug} className="inline-flex items-center gap-1.5 border border-neutral-200 px-2.5 py-1 font-script text-[10.5px] uppercase tracking-[0.14em] text-neutral-600">
              <ServiceIcon aria-hidden="true" className="text-[13px] text-third" />
              {title}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
