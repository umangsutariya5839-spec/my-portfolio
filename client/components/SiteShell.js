import Footer from "./Footer";
import Nav from "./Nav";

// Navigation bar + page content + footer. Every public page uses it.
export default function SiteShell({ profile, children }) {
  return (
    <>
      <Nav name={profile.name} resumeUrl={profile.resumeUrl} />
      <main>{children}</main>
      <Footer profile={profile} />
    </>
  );
}
