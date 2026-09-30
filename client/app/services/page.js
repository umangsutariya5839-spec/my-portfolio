import { loadContent } from "@/lib/api";
import ApiDown from "@/components/ApiDown";
import CtaBand from "@/components/CtaBand";
import Services from "@/components/Services";
import SiteShell from "@/components/SiteShell";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Freelance services",
  description:
    "Hire Umang Sutarsandhiya for business websites, custom web applications, AI integration and website testing.",
};

export default async function ServicesPage() {
  const { content, error } = await loadContent();
  if (error) return <ApiDown error={error} />;
  const { profile, services } = content;

  return (
    <SiteShell profile={profile}>
      <Services services={services} page />
      <CtaBand
        title="Let's talk about your project."
        text="Tell me what you need and I'll reply with a clear quote and timeline, usually within a day."
      />
    </SiteShell>
  );
}
