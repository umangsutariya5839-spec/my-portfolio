import SectionHeading from "./SectionHeading";

export default function Experience({ experience, page = false }) {
  if (!experience?.length) return null;

  return (
    <section id="experience" className={page ? "page-top" : "section"}>
      <div className="shell">
        <SectionHeading
          page={page}
          eyebrow="Experience"
          title="Where I've been working."
          intro={page ? "My current role in ERP software testing, freelance web work, and the internship where I started working with data." : undefined}
        />

        <ol className="mt-14 border-t border-line">
          {experience.map((job) => (
            <li key={job.id} className="grid gap-4 border-b border-line py-9 md:grid-cols-[14rem_1fr] md:gap-10">
              <div>
                <p className="text-sm font-medium text-muted">{job.period}</p>
                {job.current ? (
                  <span className="mt-2 inline-block rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                    Current
                  </span>
                ) : null}
              </div>
              <div>
                <h3 className="text-2xl">{job.role}</h3>
                {job.org ? <p className="mt-1 text-accent">{job.org}</p> : null}
                {job.points?.length ? (
                  <ul className="mt-4 space-y-2 text-ink/75">
                    {job.points.map((point) => (
                      <li key={point} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent/60">
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
