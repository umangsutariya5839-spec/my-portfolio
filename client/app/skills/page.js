import { loadContent } from "@/lib/api";
import ApiDown from "@/components/ApiDown";
import CtaBand from "@/components/CtaBand";
import SiteShell from "@/components/SiteShell";
import Skills from "@/components/Skills";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Skills",
  description: "Testing, languages, databases and tools Umang Sutarsandhiya works with.",
};

export default async function SkillsPage() {
  const { content, error } = await loadContent();
  if (error) return <ApiDown error={error} />;
  const { profile, skills } = content;

  return (
    <SiteShell profile={profile}>
      <Skills skills={skills} page />
      <CtaBand />
    </SiteShell>
  );
}
