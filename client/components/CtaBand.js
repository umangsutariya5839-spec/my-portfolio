import Link from "next/link";
import Icon from "./Icon";

// Closing call to action at the bottom of pages that don't already end in the contact form.
export default function CtaBand({ title = "Have a role or a project in mind?", text }) {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="shell">
        <div className="flex flex-col gap-8 rounded-3xl bg-accent-soft px-7 py-10 sm:px-12 sm:py-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)]">{title}</h2>
            <p className="mt-3 text-lg text-ink/70">
              {text || "I'm available for freelance websites, web apps and AI projects, and open to full-time roles in web development and QA."}
            </p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0 self-start md:self-auto">
            Get in touch
            <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
