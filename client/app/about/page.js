import { loadContent } from "@/lib/api";
import About from "@/components/About";
import ApiDown from "@/components/ApiDown";
import CtaBand from "@/components/CtaBand";
import Education from "@/components/Education";
import SiteShell from "@/components/SiteShell";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "About",
  description: "About Umang Sutarsandhiya: education, background and life beyond work.",
};

export default async function AboutPage() {
  const { content, error } = await loadContent();
  if (error) return <ApiDown error={error} />;
  const { profile, education } = content;

  return (
    <SiteShell profile={profile}>
      <About profile={profile} page />
      <Education education={education} profile={profile} />
      <div className="pt-20 sm:pt-28" />
      <CtaBand />
    </SiteShell>
  );
}
