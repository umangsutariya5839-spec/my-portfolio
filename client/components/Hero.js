import Link from "next/link";
import Icon from "./Icon";
import ResumeButton from "./ResumeButton";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export default function Hero({ profile }) {
  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-40">
      {/* soft background shape */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-accent-soft/70 blur-3xl"
      />

      <div className="shell relative grid items-center gap-14 pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-28">
        <div className="rise">
          {profile.available ? (
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-1.5 text-sm text-ink/80">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for freelance projects
            </p>
          ) : null}

          <p className="mt-8 text-lg text-muted">Hello, I&apos;m</p>
          <h1 className="mt-2 text-[clamp(2.9rem,7.5vw,5.6rem)] leading-[1.02]">{profile.name}</h1>
          {profile.role ? (
            <p className="mt-5 font-display text-[clamp(1.25rem,2.4vw,1.7rem)] italic text-accent">{profile.role}</p>
          ) : null}
          <p className="mt-6 max-w-readable text-lg text-muted">{profile.intro}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/projects" className="btn-primary">
              View my work
              <Icon name="arrow" />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Get in touch
            </Link>
            <ResumeButton url={profile.resumeUrl} name={profile.name} className="btn-ghost" />
          </div>

          <div className="mt-10 flex items-center gap-5 text-muted">
            {profile.github ? (
              <a href={profile.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent" aria-label="GitHub">
                <Icon name="github" className="h-5 w-5" />
              </a>
            ) : null}
            {profile.linkedin ? (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent" aria-label="LinkedIn">
                <Icon name="linkedin" className="h-5 w-5" />
              </a>
            ) : null}
            {profile.email ? (
              <a href={`mailto:${profile.email}`} className="transition-colors hover:text-accent" aria-label="Email">
                <Icon name="mail" className="h-5 w-5" />
              </a>
            ) : null}
            <span className="h-px w-12 bg-line" aria-hidden="true" />
            <span className="text-sm">{profile.location?.split(",").slice(-2).join(",").trim()}</span>
          </div>
        </div>

        {/* Portrait in an arched frame. Falls back to initials until a photo URL is set in /admin. */}
        <div className="rise rise-2 relative mx-auto w-full max-w-[22rem] lg:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full border border-line bg-accent-soft">
            {profile.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoUrl} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <span className="font-display text-[7rem] font-semibold italic text-accent/80">{initials(profile.name)}</span>
              </div>
            )}
          </div>

          {profile.stats?.[0] ? (
            <div className="card absolute -left-4 bottom-10 px-5 py-4 shadow-[0_20px_50px_-20px_rgba(28,27,25,0.25)] sm:-left-10">
              <p className="font-display text-3xl font-semibold">{profile.stats[0].value}</p>
              <p className="text-sm text-muted">{profile.stats[0].label}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
