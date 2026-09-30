// On its own page the heading is the page's <h1>; on the home page it is an <h2>.
export default function SectionHeading({ eyebrow, title, intro, center = false, page = false }) {
  const Heading = page ? "h1" : "h2";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <Heading className={page ? "page-title" : "section-title"}>{title}</Heading>
      {intro ? <p className="mt-5 text-lg text-muted">{intro}</p> : null}
    </div>
  );
}
