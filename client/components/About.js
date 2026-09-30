import ResumeButton from "./ResumeButton";
import SectionHeading from "./SectionHeading";

export default function About({ profile, page = false }) {
  const paragraphs = (profile.about || "").split(/\n\s*\n/).filter(Boolean);

  return (
    <section id="about" className={page ? "page-top" : "section border-t border-line bg-card"}>
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading page={page} eyebrow="About me" title="Careful testing, clean web work." />
          {profile.headline ? (
            <p className="mt-8 border-l-2 border-accent pl-5 font-display text-xl italic leading-snug text-ink/85">
              {profile.headline}
            </p>
          ) : null}
          <ResumeButton url={profile.resumeUrl} name={profile.name} className="btn-primary mt-10" />
        </div>

        <div>
          <div className="space-y-5 text-lg text-ink/80">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {profile.stats?.length ? (
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {profile.stats.map((stat) => (
                <div key={stat.label} className="bg-paper px-5 py-6">
                  <dd className="font-display text-3xl font-semibold text-ink">{stat.value}</dd>
                  <dt className="mt-1 text-sm text-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  );
}
