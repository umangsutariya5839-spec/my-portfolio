// Starting content, taken from Umang's resume (September 2026).
// `npm run db:seed` loads it. Edit it later from the admin panel, not here.

export const profile = {
  name: "Umang Sutarsandhiya",
  role: "Full-Stack Web Developer & QA Tester",
  headline: "I build websites that work, and I test them until I'm sure they do.",
  intro:
    "I build fast, mobile-friendly websites and web apps for businesses, add AI features that save time, and test everything before it goes live. Computer Engineering graduate, currently in ERP software testing, and available for freelance projects.",
  about:
    "I finished my B.E. in Computer Engineering at Gujarat Technological University in 2026 and now work on ERP software at Kranti Forging, where I do manual and functional testing, report defects, verify business workflows and help keep the system running smoothly.\n\nAlongside that I work as a freelance web developer. I build full-stack websites and web applications with React, Next.js, Node.js and PostgreSQL, most recently a business website with online repair booking and WhatsApp contact for a motor repair company. I use AI tools every day to plan, build and test faster, and I help clients add AI features such as chatbots and automatic product descriptions.\n\nMy testing background is what sets my freelance work apart: every site I deliver is checked on real phones and browsers, with bugs fixed before launch. Earlier I completed a data analysis internship at IBM SkillsBuild working with Excel and SQL.",
  location: "Jepar, Ta. Chuda, Dist. Surendranagar, Gujarat",
  email: "umangsutariya5839@gmail.com",
  phone: "+91 94296 84634",
  github: "https://github.com/umangsutariya5839-spec",
  linkedin: "",
  resume_url: "/resume.pdf",
  photo_url: "",
  available: true,
  stats: [
    { label: "CGPA", value: "7.93" },
    { label: "Projects delivered", value: "4" },
    { label: "Graduated", value: "2026" },
    { label: "Softball", value: "National" },
  ],
  beyond_title: "Softball, national level",
  beyond_body:
    "I played softball for Gujarat Technological University and earned a national level certificate. The game taught me the basics first, then strategy, and above all teamwork and sportsmanship. The same habits carry into how I work on a project.",
};

export const projects = [
  {
    slug: "motor-repair-website",
    title: "Motor Repair & Electrical Services",
    category: "Freelance · Client website",
    summary:
      "A responsive business website for a client in the electric motor repair and rewinding industry, with online repair booking and WhatsApp integration.",
    points: [
      "Developed a responsive business website for a customer in the electric motor repair and rewinding industry.",
      "Implemented service, gallery, light decoration, reviews, FAQ, contact and repair booking sections with WhatsApp integration.",
      "Created a modern, mobile-friendly interface that presents the business's services, products and customer information professionally.",
    ],
    stack: ["Responsive design", "WhatsApp integration", "Netlify"],
    live_url: "https://motor-repair12.netlify.app/",
    code_url: "",
    image_url: "",
    year: "2026",
    featured: true,
  },
  {
    slug: "quickbite",
    title: "QuickBite",
    category: "Web app · Testing",
    summary:
      "An online food ordering web application with restaurant browsing, cart, checkout and order tracking, which I both built and tested.",
    points: [
      "Built a responsive food ordering app with HTML5, CSS3, JavaScript and MySQL, covering restaurant browsing, cart, checkout and order tracking.",
      "Performed functional, UI, responsive and regression testing, wrote test cases and logged the defects I found.",
      "Validated database data with MySQL queries and re-tested every bug fix to confirm the app behaved reliably.",
    ],
    stack: ["HTML5", "CSS3", "JavaScript", "MySQL", "Manual testing"],
    live_url: "",
    code_url: "",
    image_url: "",
    year: "2026",
    featured: true,
  },
  {
    slug: "ecommerce",
    title: "E-commerce website",
    category: "Web app",
    summary:
      "A responsive online store where users browse products by category, search, fill a cart and place orders against a MySQL database.",
    points: [
      "Developed the store with HTML, CSS, JavaScript and MySQL so users can browse and shop efficiently.",
      "Implemented product categories, search, cart management and order processing.",
      "Focused on responsive design, product filtering, secure database integration and simple navigation.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "MySQL"],
    live_url: "",
    code_url: "",
    image_url: "",
    year: "2025",
    featured: true,
  },
  {
    slug: "portfolio",
    title: "Personal portfolio website",
    category: "Website",
    summary:
      "A responsive personal site that shows my skills, projects, education and contact details to recruiters.",
    points: [
      "Built with HTML, CSS and JavaScript, with About, Projects, Skills, Resume and Contact sections and easy navigation.",
      "Mobile-friendly layout that works on any screen size.",
      "Linked GitHub, LinkedIn and a resume download so recruiters can check my work directly.",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    live_url: "https://umangsutariya.vercel.app",
    code_url: "",
    image_url: "",
    year: "2025",
    featured: false,
  },
];

export const experience = [
  {
    role: "ERP Software Testing & Maintenance Trainee",
    org: "Kranti Forging",
    period: "July 2026 – Present",
    current: true,
    points: [
      "Perform manual and functional testing on the company's ERP software.",
      "Identify, document and report defects, then verify the fixes.",
      "Verify business workflows end to end and help maintain the software so daily operations run smoothly.",
    ],
  },
  {
    role: "Freelance Full-Stack Web Developer",
    org: "Self-employed · Remote",
    period: "2026 – Present",
    current: true,
    points: [
      "Deliver responsive business websites and web applications for clients, from first requirements to launch and support.",
      "Built a motor repair and electrical services website with online repair booking, reviews, FAQ, gallery and one-tap WhatsApp contact.",
      "Work with React, Next.js, Node.js and PostgreSQL, and use AI tools to plan, build and test faster.",
      "Test every delivery on real phones and browsers before launch, so clients receive a site that works from day one.",
    ],
  },
  {
    role: "Data Analysis Intern",
    org: "IBM SkillsBuild",
    period: "July 2025",
    current: false,
    points: [
      "Analysed and validated datasets in Excel.",
      "Wrote SQL queries to explore, check and summarise data.",
    ],
  },
];

export const education = [
  {
    qualification: "Bachelor of Engineering, Computer Engineering",
    institute: "Gujarat Technological University",
    period: "2022 – 2026",
    result: "CGPA 7.93 / 10.00",
    note: "",
  },
  {
    qualification: "Class XII, Science",
    institute: "Pramukh Swami Vidyalaya, Salangpur",
    period: "2021 – 2022",
    result: "55.50% · Grade C1",
    note: "",
  },
  {
    qualification: "Class X",
    institute: "Pramukh Swami Vidyalaya, Salangpur",
    period: "2019 – 2020",
    result: "65.83% · Grade B2",
    note: "",
  },
];

export const skillGroups = [
  {
    name: "Frontend Development",
    items: ["HTML5", "CSS3", "JavaScript (ES6+)", "React", "Next.js", "Tailwind CSS", "Responsive design"],
  },
  {
    name: "Backend & APIs",
    items: ["Node.js", "Express.js", "REST APIs", "Authentication (JWT)", "Python (basic)"],
  },
  {
    name: "Databases",
    items: ["PostgreSQL", "MySQL", "Oracle Database", "SQL queries & data validation"],
  },
  {
    name: "AI & Automation",
    items: [
      "AI-assisted coding with ChatGPT & Claude",
      "Prompt engineering",
      "AI chatbot integration",
      "OpenAI & Claude API integration",
      "AI content generation",
      "Workflow automation",
    ],
  },
  {
    name: "Quality Assurance & Testing",
    items: [
      "Manual & functional testing",
      "Regression testing",
      "UI & responsive testing",
      "Test case design",
      "Defect tracking in Jira",
      "ERP software testing",
      "Automation testing (learning)",
    ],
  },
  {
    name: "Tools & Deployment",
    items: ["Git & GitHub", "VS Code", "IntelliJ IDEA", "Jira", "Vercel", "Netlify", "Railway", "Excel", "Linux (basic)", "AWS (basic)"],
  },
];

// Freelance services, grouped by category on the Services page.
// The first service in each category also appears on the home page.
const WEB = "Web development";
const AI = "AI, APIs & automation";
const QA = "Testing & quality";
const SUPPORT = "Business support";

export const services = [
  // ---- Web development
  {
    category: WEB,
    title: "Business websites",
    summary: "A fast, professional website that brings in enquiries for your shop, workshop or service business, and looks great on every phone.",
    items: ["Online booking & enquiry forms", "WhatsApp chat button", "Google Maps, reviews & gallery", "Easy content editing"],
  },
  {
    category: WEB,
    title: "E-commerce stores",
    summary: "An online store where customers can browse, pay and order, with everything you need to manage products and orders.",
    items: ["Product catalogue with search & filters", "Cart, checkout & order tracking", "Razorpay & UPI payments", "Stock and order management"],
  },
  {
    category: WEB,
    title: "Custom web applications",
    summary: "Full-stack apps built around how your business works, from customer logins to databases and reports.",
    items: ["React & Next.js frontend", "Node.js & Express backend", "PostgreSQL or MySQL database", "Secure login & user roles"],
  },
  {
    category: WEB,
    title: "Admin dashboards & CMS",
    summary: "A simple control panel so you and your team can update products, bookings and content without touching code.",
    items: ["Add, edit & delete content", "Bookings, orders & enquiries in one place", "Reports and exports", "Role-based access for staff"],
  },
  {
    category: WEB,
    title: "Landing pages & portfolios",
    summary: "Focused one-page sites for a product launch, an event, a campaign or your personal portfolio.",
    items: ["Clear call-to-action design", "Contact & lead capture forms", "Fast loading on mobile", "Ready in days, not weeks"],
  },
  {
    category: WEB,
    title: "Website redesign",
    summary: "Give an old or slow website a modern look, a mobile-friendly layout and faster loading, without losing your content.",
    items: ["Modern, responsive redesign", "Speed & performance improvements", "Content moved over safely", "Before-and-after testing"],
  },

  // ---- AI & automation
  {
    category: AI,
    title: "AI chatbots",
    summary: "A chatbot on your website that answers common questions day and night, and passes real leads to you.",
    items: ["Trained on your products & FAQs", "Lead capture into email or WhatsApp", "English, Hindi & Gujarati replies", "Hand-over to a human when needed"],
  },
  {
    category: AI,
    title: "AI features for your app",
    summary: "Practical AI built into your website or app, using the OpenAI and Claude APIs, to save your team time.",
    items: ["AI-written product descriptions", "Smart search & recommendations", "Document & data summaries", "OpenAI & Claude API integration"],
  },
  {
    category: AI,
    title: "API development & integration",
    summary: "Connect your website to the tools you already use, or give your app a clean API for mobile and partners.",
    items: ["REST API design & development", "Payment gateway integration", "WhatsApp, email & SMS notifications", "Google Sheets & third-party APIs"],
  },
  {
    category: AI,
    title: "Business process automation",
    summary: "Automate the repetitive work: reports, reminders, invoices and data entry that eat up your day.",
    items: ["Automatic emails & reminders", "Invoice & report generation", "Google Sheets & Excel automation", "Form-to-database workflows"],
  },

  // ---- Testing & quality
  {
    category: QA,
    title: "Website & app testing",
    summary: "I find the bugs before your customers do, with clear reports your developers can act on straight away.",
    items: ["Functional & regression testing", "Mobile & cross-browser checks", "Bug reports with steps & screenshots", "Re-testing after fixes"],
  },
  {
    category: QA,
    title: "ERP & business software testing",
    summary: "Hands-on testing of ERP and business systems, based on my day-to-day work in ERP software testing.",
    items: ["Business workflow verification", "Test case & test plan writing", "User acceptance testing (UAT) support", "Defect tracking in Jira"],
  },

  // ---- Business support (general services)
  {
    category: SUPPORT,
    title: "Website maintenance & support",
    summary: "Monthly care for your website so it stays secure, up to date and working, without you having to think about it.",
    items: ["Content & price updates", "Bug fixes & small changes", "Backups & uptime checks", "Monthly support plans"],
  },
  {
    category: SUPPORT,
    title: "Domain, hosting & deployment",
    summary: "I take care of the technical setup so your site is live on your own domain, secure and fast.",
    items: ["Domain & DNS setup", "Hosting on Vercel, Netlify or Railway", "SSL certificate (https)", "Business email setup"],
  },
  {
    category: SUPPORT,
    title: "SEO & Google Business setup",
    summary: "Help local customers find you on Google Search and Google Maps.",
    items: ["On-page SEO for every page", "Google Business Profile setup", "Google Search Console & sitemap", "Basic analytics setup"],
  },
  {
    category: SUPPORT,
    title: "Excel, data & reporting",
    summary: "Clean up your business data and turn it into clear reports, using the Excel and SQL skills from my data analysis internship.",
    items: ["Data cleaning & data entry", "Excel formulas & pivot tables", "SQL queries & reports", "Simple sales & stock dashboards"],
  },
];
