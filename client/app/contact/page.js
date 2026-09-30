import { loadContent } from "@/lib/api";
import ApiDown from "@/components/ApiDown";
import Contact from "@/components/Contact";
import SiteShell from "@/components/SiteShell";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Contact",
  description: "Get in touch with Umang Sutarsandhiya about testing and web development roles or freelance websites.",
};

export default async function ContactPage() {
  const { content, error } = await loadContent();
  if (error) return <ApiDown error={error} />;
  const { profile } = content;

  return (
    <SiteShell profile={profile}>
      <Contact profile={profile} page />
    </SiteShell>
  );
}
