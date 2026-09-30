"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/nav";
import Icon from "./Icon";
import ResumeButton from "./ResumeButton";

// "/projects/quickbite" still counts as being on "Projects".
const isActive = (pathname, href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

export default function Nav({ name, resumeUrl }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the page changes.
  useEffect(() => setOpen(false), [pathname]);

  const [first, ...rest] = (name || "").split(" ");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || open ? "border-b border-line bg-paper/90 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="shell flex h-[4.5rem] items-center justify-between" aria-label="Main">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          {first}
          <span className="text-accent">.</span>
          <span className="sr-only"> {rest.join(" ")}</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-[0.95rem] transition-colors ${
                    active ? "bg-ink text-paper" : "text-ink/75 hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ResumeButton url={resumeUrl} name={name} label="Resume" className="btn-ghost hidden !px-5 !py-2.5 text-sm sm:inline-flex" />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-menu" className="shell pb-6 lg:hidden">
          <ul className="flex flex-col divide-y divide-line border-t border-line">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between py-3.5 text-lg ${active ? "text-accent" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                    {active ? <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ResumeButton url={resumeUrl} name={name} className="btn-primary mt-4 w-full" />
        </div>
      ) : null}
    </header>
  );
}
