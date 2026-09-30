import { loadContent } from "@/lib/api";
import ApiDown from "@/components/ApiDown";
import CtaBand from "@/components/CtaBand";
import Projects from "@/components/Projects";
import SiteShell from "@/components/SiteShell";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Projects",
  description: "Client websites, web apps and testing projects by Umang Sutarsandhiya.",
};

export default async function ProjectsPage() {
  const { content, error } = await loadContent();
  if (error) return <ApiDown error={error} />;
  const { profile, projects } = content;

  return (
    <SiteShell profile={profile}>
      <Projects projects={projects} page />
      <CtaBand title="Need a website for your business?" text="I build responsive business websites with booking, WhatsApp contact and everything your customers need." />
    </SiteShell>
  );
}
