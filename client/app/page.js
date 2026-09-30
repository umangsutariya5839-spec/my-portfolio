import { loadContent } from "@/lib/api";
import ApiDown from "@/components/ApiDown";
import CtaBand from "@/components/CtaBand";
import Hero from "@/components/Hero";
import HomeOverview from "@/components/HomeOverview";
import Services from "@/components/Services";
import SiteShell from "@/components/SiteShell";

// Always read fresh content from the API, so edits in /admin show up on the next refresh.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { content, error } = await loadContent();
  if (error) return <ApiDown error={error} />;
  const { profile, projects, experience, skills, services } = content;

  return (
    <SiteShell profile={profile}>
      <Hero profile={profile} />
      <Services services={services} compact />
      <HomeOverview profile={profile} projects={projects} experience={experience} skills={skills} />
      <CtaBand />
    </SiteShell>
  );
}
