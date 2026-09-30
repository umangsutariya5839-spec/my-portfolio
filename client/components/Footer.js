import Link from "next/link";
import Icon from "./Icon";
import { navLinks } from "@/lib/nav";

export default function Footer({ profile }) {
  const socials = [
    profile.github && { href: profile.github, icon: "github", label: "GitHub" },
    profile.linkedin && { href: profile.linkedin, icon: "linkedin", label: "LinkedIn" },
    profile.email && { href: `mailto:${profile.email}`, icon: "mail", label: "Email" },
  ].filter(Boolean);

  return (
    <footer className="bg-ink text-paper">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_auto] md:items-start">
        <div>
          <p className="font-display text-3xl font-semibold text-paper">
            {profile.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-2 text-paper/60">{profile.role}</p>
        </div>

        <nav aria-label="Footer">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-paper/45">Pages</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-paper/75 transition-colors hover:text-paper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {socials.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={link.label}
              className="grid h-11 w-11 place-items-center rounded-full border border-paper/20 transition-colors hover:border-accent hover:bg-accent"
            >
              <Icon name={link.icon} className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="shell py-6 text-sm text-paper/50">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
