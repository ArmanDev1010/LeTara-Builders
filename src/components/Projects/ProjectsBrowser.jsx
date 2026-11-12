"use client";

import { useEffect, useMemo, useState } from "react";
import { TbChevronDown } from "react-icons/tb";
import ProjectCard from "@/components/Projects/ProjectCard";
import { SERVICES } from "@/data/services";

const keyOf = (project) => project.area ?? project.city.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// The projects page's grid with its filters: by service (a chip each, with
// how many projects have it) and by city (a menu of the places there are
// projects in). The picks are kept in the address (?service=…&city=…), so a
// service or area page's "See all" link opens the grid already filtered, and
// a filtered view can be shared. Cards rise in as the picks change
// (.project-in in globals.css; with Reduce Motion they only fade).
export default function ProjectsBrowser({ projects }) {
  const [service, setService] = useState(null);
  const [city, setCity] = useState(null);

  // the picks in the address, read once it's in the browser (the page itself
  // is built ahead, unfiltered)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (SERVICES.some((s) => s.slug === params.get("service"))) setService(params.get("service"));
    if (projects.some((p) => keyOf(p) === params.get("city"))) setCity(params.get("city"));
  }, [projects]);

  const pick = (nextService, nextCity) => {
    setService(nextService);
    setCity(nextCity);
    const params = new URLSearchParams();
    if (nextService) params.set("service", nextService);
    if (nextCity) params.set("city", nextCity);
    const query = params.toString();
    window.history.replaceState(window.history.state, "", query ? `?${query}` : window.location.pathname);
  };

  const services = useMemo(
    () => SERVICES.map((s) => ({ ...s, count: projects.filter((p) => p.services.includes(s.slug)).length })).filter((s) => s.count),
    [projects],
  );
  const cities = useMemo(() => {
    const seen = new Map();
    for (const p of projects) {
      const key = keyOf(p);
      if (!seen.has(key)) seen.set(key, { key, name: p.city, count: 0 });
      seen.get(key).count++;
    }
    return [...seen.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [projects]);
  const shown = projects.filter((p) => (!service || p.services.includes(service)) && (!city || keyOf(p) === city));

  const chip = (on) =>
    `inline-flex items-center gap-2 border px-3.5 py-2 font-script text-[11.5px] uppercase tracking-[0.14em] cursor-pointer transition-colors duration-200 ${
      on ? "bg-neutral-950 border-neutral-950 text-white" : "border-neutral-300 text-neutral-700 hover:border-neutral-950"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-5 1080:flex-row 1080:items-center 1080:justify-between">
        <div role="group" aria-label="Filter by service" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={!service} onClick={() => pick(null, city)} className={chip(!service)}>
            All projects <span className="opacity-60">{projects.length}</span>
          </button>
          {services.map(({ slug, title, icon: Icon, count }) => (
            <button key={slug} type="button" aria-pressed={service === slug} onClick={() => pick(slug, city)} className={chip(service === slug)}>
              <Icon aria-hidden="true" className="text-[15px] text-third" />
              {title} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
        {cities.length > 1 && (
          <label className="relative inline-flex items-center self-start 1080:self-auto">
            <span className="sr-only">Filter by city</span>
            <select
              value={city ?? ""}
              onChange={(e) => pick(service, e.target.value || null)}
              className="appearance-none cursor-pointer border border-neutral-300 bg-white pl-4 pr-11 py-2.5 text-[16px] text-neutral-900 hover:border-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third"
            >
              <option value="">All cities</option>
              {cities.map(({ key, name, count }) => (
                <option key={key} value={key}>
                  {name} ({count})
                </option>
              ))}
            </select>
            <TbChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 text-[16px] text-neutral-500" />
          </label>
        )}
      </div>

      <p className="mt-8 font-script text-[11px] uppercase tracking-[0.2em] text-neutral-500 pointer-events-none" aria-live="polite">
        {shown.length === projects.length ? `${projects.length} ${projects.length === 1 ? "project" : "projects"}` : `${shown.length} of ${projects.length} projects`}
      </p>

      {shown.length ? (
        <ul className="mt-6 grid gap-x-6 gap-y-14 700:grid-cols-2 1080:grid-cols-3 1440:gap-x-8">
          {shown.map((project, i) => (
            <li key={`${project.slug}-${service ?? ""}-${city ?? ""}`} className="project-in" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 border border-dashed border-neutral-300 px-6 py-14 text-center">
          <p className="font-display uppercase text-[28px] text-neutral-950 pointer-events-none">No projects here yet</p>
          <button type="button" onClick={() => pick(null, null)} className="mt-4 uppercase text-[12px] font-semibold tracking-[0.14em] text-neutral-950 border-b border-third pb-1 cursor-pointer hover:text-third">
            Show all projects
          </button>
        </div>
      )}
    </div>
  );
}
