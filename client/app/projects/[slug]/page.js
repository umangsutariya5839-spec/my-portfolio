import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError, getPortfolio } from "@/lib/api";
import ApiDown from "@/components/ApiDown";
import Icon from "@/components/Icon";
import SiteShell from "@/components/SiteShell";

export const dynamic = "force-dynamic";

async function load(slug) {
  try {
    const [project, content] = await Promise.all([api(`/projects/${encodeURIComponent(slug)}`), getPortfolio()]);
    return { project, content };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return { error };
  }
}

export async function generateMetadata({ params }) {
  try {
    const project = await api(`/projects/${encodeURIComponent(params.slug)}`);
    return { title: project.title, description: project.summary };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectPage({ params }) {
  const { project, content, error } = await load(params.slug);
  if (error) return <ApiDown error={error} />;

  const { profile, projects } = content;
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <SiteShell profile={profile}>
      <div className="pt-32 sm:pt-40">
        <article className="shell">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            All projects
          </Link>

          <header className="rise mt-8 max-w-4xl">
            <p className="eyebrow">{[project.category, project.year].filter(Boolean).join(" · ")}</p>
            <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.5rem)]">{project.title}</h1>
            <p className="mt-6 max-w-readable text-xl text-muted">{project.summary}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  Visit live site
                  <Icon name="arrowUpRight" />
                </a>
              ) : null}
              {project.codeUrl ? (
                <a href={project.codeUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                  <Icon name="github" />
                  View code
                </a>
              ) : null}
            </div>
          </header>

          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.imageUrl} alt={`${project.title} screenshot`} className="card mt-14 w-full object-cover" />
          ) : null}

          <div className="mt-14 grid gap-12 border-t border-line pt-12 lg:grid-cols-[1fr_18rem] lg:gap-20">
            <section>
              <h2 className="text-2xl">What I did</h2>
              <ul className="mt-6 space-y-4 text-lg text-ink/80">
                {project.points.map((point) => (
                  <li key={point} className="flex gap-4">
                    <span className="mt-1.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {project.stack?.length ? (
              <aside>
                <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-muted">Built with</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li key={tech} className="chip">
                      {tech}
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </article>

        {next && next.slug !== project.slug ? (
          <div className="mt-24 border-t border-line bg-card">
            <Link href={`/projects/${next.slug}`} className="shell group flex items-center justify-between gap-6 py-14">
              <div>
                <p className="text-sm text-muted">Next project</p>
                <p className="mt-2 font-display text-3xl font-semibold transition-colors group-hover:text-accent sm:text-4xl">
                  {next.title}
                </p>
              </div>
              <Icon name="arrow" className="h-8 w-8 shrink-0 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        ) : (
          <div className="mt-24" />
        )}
      </div>
    </SiteShell>
  );
}
