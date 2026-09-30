import Link from "next/link";
import Icon from "./Icon";
import SectionHeading from "./SectionHeading";

// How a freelance project runs, start to finish. The order matters, so it is numbered.
const process = [
  { title: "Discuss", text: "We talk through your business, goals and budget. You get a clear quote and timeline." },
  { title: "Design & build", text: "I build the site or app and share progress with you every week." },
  { title: "Test", text: "Every page is checked on real phones and browsers, and every bug is fixed." },
  { title: "Launch & support", text: "I put it live on your domain and stay available for changes after launch." },
];

const engagements = [
  { title: "Fixed-price project", text: "One agreed price and delivery date for a clearly defined website or app." },
  { title: "Hourly or part-time", text: "Flexible help for ongoing development, testing or small changes." },
  { title: "Monthly support plan", text: "Regular updates, fixes and backups for a fixed monthly fee." },
];

const slug = (text) => text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function groupByCategory(services) {
  const groups = [];
  for (const service of services) {
    const name = service.category || "Services";
    let group = groups.find((g) => g.name === name);
    if (!group) groups.push((group = { name, services: [] }));
    group.services.push(service);
  }
  return groups;
}

function ServiceCard({ service, showItems }) {
  return (
    <article id={slug(service.title)} className="service-card card flex scroll-mt-28 flex-col p-7">
      <h3 className="text-[1.4rem] leading-snug">{service.title}</h3>
      <p className="mt-3 text-ink/75">{service.summary}</p>
      {showItems && service.items?.length ? (
        <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
          {service.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[0.95rem]">
              <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon name="check" className="h-3 w-3" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export default function Services({ services, page = false, compact = false }) {
  if (!services?.length) return null;
  const groups = groupByCategory(services);

  // Home page: one service from each category, with a link to the full list.
  // Home page: every service, grouped by category. Each one links to its own card on /services.
  if (compact) {
    return (
      <section id="services" className="section border-t border-line">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Hire me"
              title="Freelance services."
              intro={`${services.length} services across web development, AI, testing and business support. Pick one to see what's included.`}
            />
            <Link href="/services" className="btn-primary">
              View all services
              <Icon name="arrow" />
            </Link>
          </div>

          <div className="mt-14 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-4">
            {groups.map((group) => (
              <div key={group.name} className="card p-6">
                <a
                  href={`/services#${slug(group.name)}`}
                  className="flex items-baseline justify-between gap-3 border-b border-line pb-4 hover:text-accent"
                >
                  <h3 className="text-xl leading-snug">{group.name}</h3>
                  <span className="shrink-0 text-sm text-muted">{group.services.length}</span>
                </a>
                <ul className="mt-2">
                  {group.services.map((service) => (
                    <li key={service.id}>
                      <a
                        href={`/services#${slug(service.title)}`}
                        className="group flex items-center justify-between gap-3 rounded-lg py-2.5 text-[0.97rem] text-ink/85 transition-colors hover:text-accent"
                      >
                        {service.title}
                        <Icon name="arrow" className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className={page ? "page-top" : "section border-t border-line"}>
      <div className="shell">
        <SectionHeading
          page={page}
          eyebrow="Freelance services"
          title="What I can build for your business."
          intro="From a simple business website to a full web application with AI features, you work directly with me from the first call to launch day and beyond."
        />

        <nav aria-label="Service categories" className="mt-10 flex flex-wrap gap-2">
          {groups.map((group) => (
            <a key={group.name} href={`#${slug(group.name)}`} className="chip transition-colors hover:border-accent hover:text-accent">
              {group.name}
              <span className="ml-2 text-muted">{group.services.length}</span>
            </a>
          ))}
        </nav>

        <div className="mt-16 space-y-20">
          {groups.map((group) => (
            <div key={group.name} id={slug(group.name)} className="scroll-mt-28">
              <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">{group.name}</h2>
                <span className="text-sm text-muted">
                  {group.services.length} {group.services.length === 1 ? "service" : "services"}
                </span>
              </div>
              {/* Groups of 3, 6, 9… fill three columns; groups of 2 or 4 fill two, so no card sits alone. */}
              <div
                className={`mt-8 grid items-start gap-5 md:grid-cols-2 ${group.services.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}
              >
                {group.services.map((service) => (
                  <ServiceCard key={service.id} service={service} showItems />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-28">
          <SectionHeading eyebrow="How I work" title="Simple process, no surprises." />
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, index) => (
              <li key={step.title} className="border-t-2 border-ink pt-5">
                <span className="font-display text-sm font-semibold text-accent">Step {index + 1}</span>
                <h3 className="mt-2 text-xl">{step.title}</h3>
                <p className="mt-2 text-ink/70">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-24">
          <SectionHeading eyebrow="Ways to work together" title="Pick what suits your project." />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {engagements.map((way) => (
              <li key={way.title} className="rounded-2xl bg-accent-soft/60 p-7">
                <h3 className="text-xl">{way.title}</h3>
                <p className="mt-2 text-ink/75">{way.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
