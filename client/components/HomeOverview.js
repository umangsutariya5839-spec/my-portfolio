import Link from "next/link";
import Icon from "./Icon";
import { ProjectCard } from "./Projects";
import SectionHeading from "./SectionHeading";

// Home page: a few featured projects, then one card per inner page with a live teaser.
export default function HomeOverview({ profile, projects, experience, skills }) {
  const featured = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const currentJob = experience.find((job) => job.current) || experience[0];
  const skillCount = skills.reduce((total, group) => total + group.items.length, 0);

  const pages = [
    {
      href: "/about",
      label: "About",
      title: "Who I am",
      text: profile.headline || profile.intro,
    },
    currentJob && {
      href: "/experience",
      label: "Experience",
      title: currentJob.role,
      text: [currentJob.org, currentJob.period].filter(Boolean).join(" · "),
    },
    skills.length && {
      href: "/skills",
      label: "Skills",
      title: `${skillCount} skills in ${skills.length} areas`,
      text: skills.slice(0, 3).map((group) => group.name).join(", "),
    },
  ].filter(Boolean);

  return (
    <>
      {featured.length ? (
        <section className="section border-y border-line bg-card">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Featured work" title="Recent projects." />
              <Link href="/projects" className="btn-ghost">
                All projects
                <Icon name="arrow" />
              </Link>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="Explore" title="Get to know me." />
          <ul className="mt-14 grid gap-5 md:grid-cols-3">
            {pages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="card group flex h-full flex-col p-7 transition-colors hover:border-accent/50"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-accent">{page.label}</span>
                  <span className="mt-4 font-display text-2xl font-semibold leading-snug">{page.title}</span>
                  <span className="mt-3 flex-1 text-ink/70">{page.text}</span>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink group-hover:text-accent">
                    Open {page.label.toLowerCase()}
                    <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
