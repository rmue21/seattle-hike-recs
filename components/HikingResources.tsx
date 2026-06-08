const RESOURCES = [
  {
    name: "Washington Trails Association",
    url: "https://www.wta.org/",
  },
  {
    name: "AllTrails",
    url: "https://www.alltrails.com/",
  },
  {
    name: "National Park Service",
    url: "https://www.nps.gov/",
  },
  {
    name: "Washington State Parks",
    url: "https://parks.wa.gov/",
  }
] as const;

export function HikingResources() {
  return (
    <aside className="mx-auto max-w-3xl border-t border-slate-200/80 px-4 pt-8 sm:px-6">
      <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Helpful hiking resources
      </h2>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {RESOURCES.map((resource) => (
          <li key={resource.url}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-emerald-700 hover:decoration-emerald-400"
            >
              {resource.name}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
