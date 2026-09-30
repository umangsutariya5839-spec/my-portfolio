import SectionHeading from "./SectionHeading";

export default function Education({ education, profile }) {
  return (
    <section id="education" className="section border-t border-line bg-card">
      <div className="shell grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        {education?.length ? (
          <div>
            <SectionHeading eyebrow="Education" title="Where I studied." />
            <ol className="relative mt-12 space-y-10 border-l border-line pl-8">
              {education.map((item) => (
                <li key={item.id} className="relative">
                  <span className="absolute -left-[2.3rem] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-card" aria-hidden="true" />
                  <p className="text-sm text-muted">{item.period}</p>
                  <h3 className="mt-1 text-xl">{item.qualification}</h3>
                  <p className="mt-1 text-ink/75">{item.institute}</p>
                  {item.result ? <p className="mt-2 text-sm font-medium text-accent">{item.result}</p> : null}
                  {item.note ? <p className="mt-2 text-ink/70">{item.note}</p> : null}
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {profile.beyondTitle ? (
          <aside className="self-start rounded-2xl bg-ink p-8 text-paper sm:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent-soft/80">Beyond the desk</p>
            <h3 className="mt-4 text-3xl text-paper">{profile.beyondTitle}</h3>
            <p className="mt-5 text-paper/75">{profile.beyondBody}</p>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
