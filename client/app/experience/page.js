import { loadContent } from "@/lib/api";
import ApiDown from "@/components/ApiDown";
import CtaBand from "@/components/CtaBand";
import Experience from "@/components/Experience";
import SiteShell from "@/components/SiteShell";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Experience",
  description: "Umang Sutarsandhiya's work experience in ERP software testing, freelance web development and data analysis.",
};

export default async function ExperiencePage() {
  const { content, error } = await loadContent();
  if (error) return <ApiDown error={error} />;
  const { profile, experience } = content;

  return (
    <SiteShell profile={profile}>
      <Experience experience={experience} page />
      <CtaBand title="Looking for a careful tester?" />
    </SiteShell>
  );
}
