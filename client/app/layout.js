import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://umangsutariya.vercel.app"),
  title: {
    default: "Umang Sutarsandhiya — Software Tester & Web Developer",
    template: "%s — Umang Sutarsandhiya",
  },
  description:
    "Portfolio of Umang Sutarsandhiya, a Computer Engineering graduate from Gujarat Technological University working in ERP software testing, web development and data analysis.",
  openGraph: {
    title: "Umang Sutarsandhiya — Software Tester & Web Developer",
    description: "ERP software testing, web development and data analysis. Projects, experience and contact.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#F7F4EF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
