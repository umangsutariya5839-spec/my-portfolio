"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Icon from "./Icon";
import ResumeButton from "./ResumeButton";
import SectionHeading from "./SectionHeading";

const empty = { name: "", email: "", subject: "", message: "", company: "" };

export default function Contact({ profile, page = false }) {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const update = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setStatus({ state: "sending", message: "" });
    try {
      await api("/contact", { body: form });
      setForm(empty);
      setStatus({ state: "sent", message: "Thanks! Your message is on its way. I'll reply soon." });
    } catch (error) {
      setStatus({ state: "error", message: error.message });
    }
  }

  const details = [
    profile.email && { icon: "mail", label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { icon: "phone", label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    profile.location && { icon: "pin", label: "Location", value: profile.location },
  ].filter(Boolean);

  return (
    <section id="contact" className={page ? "page-top" : "section"}>
      <div className="shell grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <SectionHeading
            page={page}
            eyebrow="Contact"
            title="Let's work together."
            intro="Hiring for a testing or web role, or need a website for your business? Send a message and I'll get back to you."
          />

          <ul className="mt-10 space-y-5">
            {details.map((d) => (
              <li key={d.label} className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Icon name={d.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted">{d.label}</p>
                  {d.href ? (
                    <a href={d.href} className="link-underline break-all">
                      {d.value}
                    </a>
                  ) : (
                    <p>{d.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <ResumeButton url={profile.resumeUrl} name={profile.name} className="btn-ghost mt-10" />
        </div>

        <form onSubmit={submit} className="card space-y-4 p-6 sm:p-9" noValidate={false}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Name</span>
              <input className="field" required autoComplete="name" value={form.name} onChange={update("name")} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <input className="field" type="email" required autoComplete="email" value={form.email} onChange={update("email")} />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Subject <span className="font-normal text-muted">(optional)</span></span>
            <input className="field" value={form.subject} onChange={update("subject")} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Message</span>
            <textarea className="field min-h-[9rem]" required value={form.message} onChange={update("message")} />
          </label>

          {/* Honeypot for bots: hidden from people and screen readers. */}
          <div aria-hidden="true" className="absolute -left-[9999px]">
            <label>
              Company
              <input tabIndex={-1} autoComplete="off" value={form.company} onChange={update("company")} />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button type="submit" className="btn-primary disabled:opacity-60" disabled={status.state === "sending"}>
              {status.state === "sending" ? "Sending…" : "Send message"}
              <Icon name="arrow" />
            </button>
            <p
              role="status"
              className={`text-sm ${status.state === "error" ? "text-red-700" : "text-emerald-700"}`}
            >
              {status.message}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
