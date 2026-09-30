import Icon from "./Icon";

// Downloads the resume as "Firstname-Lastname-Resume.pdf" instead of "resume.pdf".
// A resume hosted elsewhere (Google Drive, etc.) opens in a new tab instead, because browsers
// only allow the download attribute for files on the same site.
export default function ResumeButton({ url, name, label = "Download resume", className = "btn-ghost" }) {
  if (!url) return null;
  const external = /^https?:\/\//i.test(url);
  const fileName = `${(name || "Resume").trim().replace(/\s+/g, "-")}-Resume.pdf`;

  return (
    <a
      href={url}
      className={className}
      {...(external ? { target: "_blank", rel: "noreferrer" } : { download: fileName })}
    >
      <Icon name="download" />
      {label}
    </a>
  );
}
