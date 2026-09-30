import SectionHeading from "./SectionHeading";

export default function Skills({ skills, page = false }) {
  if (!skills?.length) return null;

  return (
    <section id="skills" className={page ? "page-top" : "section"}>
      <div className="shell">
        <SectionHeading
          page={page}
          eyebrow="Skills"
          title={page ? "Skills & technologies." : "What I work with."}
          intro={page ? "The technologies I use to build and test modern websites and web applications, from frontend to database, with AI tools built into how I work." : undefined}
        />

        <div className="mt-14 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.id} className="card p-6 sm:p-7">
              <h3 className="text-xl">{group.name}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
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
