import Link from "next/link";
import Icon from "./Icon";
import SectionHeading from "./SectionHeading";

export function ProjectCard({ project, index }) {
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_24px_60px_-28px_rgba(28,27,25,0.35)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-accent-soft">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-end justify-between p-6">
            <span className="font-display text-7xl font-semibold italic leading-none text-accent/35">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-full border border-accent/30 text-accent transition-colors group-hover:bg-accent group-hover:text-card">
              <Icon name="arrowUpRight" />
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3 text-sm text-muted">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h3 className="mt-3 text-2xl">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 focus:outline-none">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-ink/75">{project.summary}</p>

        {project.stack?.length ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech} className="rounded-full bg-paper px-3 py-1 text-xs text-ink/70">
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
          View project
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

export default function Projects({ projects, page = false }) {
  if (!projects?.length) return null;

  return (
    <section id="projects" className={page ? "page-top" : "section border-y border-line bg-card"}>
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            page={page}
            eyebrow="Selected work"
            title="Projects I've built and tested."
            intro="Client work, web apps and testing projects. Open any one for the details."
          />
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
