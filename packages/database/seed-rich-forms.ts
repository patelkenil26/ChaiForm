import db, { eq, asc } from "./index";
import { formsTable } from "./models/form";
import { formFieldsTable } from "./models/form-field";
import { formSubmissionTable } from "./models/form-submission";
import { usersTable } from "./models/user";

function toLabelKey(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

interface TemplateDefinition {
  title: string;
  category: "SURVEYS" | "FEEDBACK" | "EVENTS" | "APPLICATIONS" | "QUIZZES" | "GENERAL";
  description: string;
  fields: Array<{
    label: string;
    type: string;
    description?: string;
    placeholder?: string;
    isRequired: boolean;
    options?: string[];
  }>;
}

const TEMPLATES: TemplateDefinition[] = [
  // ===================== 1. SURVEYS (6 TEMPLATES) =====================
  {
    title: "Customer Satisfaction Survey (CSAT)",
    category: "SURVEYS",
    description:
      "Measure customer happiness, product feedback, and Net Promoter Score with clean rating scales.",
    fields: [
      {
        label: "How would you rate your overall experience with our service?",
        type: "RATING",
        description: "Rate us from 1 to 5 stars",
        isRequired: true,
      },
      {
        label: "Which product or service did you interact with most?",
        type: "SELECT",
        description: "Choose the service you interacted with most recently",
        options: ["Web Platform", "Mobile App", "API Service", "Customer Support"],
        isRequired: true,
      },
      {
        label: "Would you recommend ChaiForm to a colleague or friend?",
        type: "YES_NO",
        description: "Your honest recommendation means the world to us",
        isRequired: true,
      },
      {
        label: "What is the primary reason for your score?",
        type: "TEXTAREA",
        placeholder: "Please tell us what went well or what could be improved...",
        isRequired: false,
      },
      {
        label: "Your Email Address (optional)",
        type: "EMAIL",
        placeholder: "name@example.com",
        isRequired: false,
      },
    ],
  },
  {
    title: "Net Promoter Score (NPS) Survey",
    category: "SURVEYS",
    description:
      "Track customer loyalty, benchmark likelihood to recommend, and identify risk of churn.",
    fields: [
      {
        label: "How likely are you to recommend us to a colleague?",
        type: "RATING",
        description: "1 = Not likely at all, 5 = Extremely likely",
        isRequired: true,
      },
      {
        label: "What is the single biggest benefit you get from our product?",
        type: "TEXTAREA",
        placeholder: "e.g. Faster form building, beautiful conversational UI...",
        isRequired: true,
      },
      {
        label: "If you were to stop using our service, what would be the primary reason?",
        type: "SELECT",
        options: [
          "Too expensive",
          "Missing key features",
          "Hard to configure",
          "Found an alternative",
          "No longer needed",
        ],
        isRequired: true,
      },
      {
        label: "Which competitor or alternative tool would you consider instead?",
        type: "TEXT",
        placeholder: "e.g. Typeform, Google Forms, Tally...",
        isRequired: false,
      },
      {
        label: "What is one feature that would make this indispensable for your workflow?",
        type: "TEXTAREA",
        placeholder: "Tell us what could make this 10x better...",
        isRequired: false,
      },
    ],
  },
  {
    title: "Employee Pulse & Culture Survey",
    category: "SURVEYS",
    description:
      "Gather anonymous employee sentiment on workload, team collaboration, and management support.",
    fields: [
      {
        label: "How satisfied are you with your current work-life balance?",
        type: "RATING",
        description: "1 = Struggling, 5 = Healthy and sustainable",
        isRequired: true,
      },
      {
        label: "Do you feel your ideas and contributions are valued by your team?",
        type: "YES_NO",
        isRequired: true,
      },
      {
        label: "Which area of our company culture has the most room for improvement?",
        type: "SELECT",
        options: [
          "Transparent Communication",
          "Career Growth & Mentorship",
          "Tooling & Hardware Support",
          "Flexible Working Hours",
        ],
        isRequired: true,
      },
      {
        label: "How clear are your quarterly team OKRs and goals?",
        type: "RATING",
        description: "1 = Confusing, 5 = Crystal clear",
        isRequired: true,
      },
      {
        label: "Any anonymous suggestions or feedback for leadership?",
        type: "TEXTAREA",
        placeholder: "Your thoughts are completely anonymous...",
        isRequired: false,
      },
    ],
  },
  {
    title: "Market Research & Consumer Habits",
    category: "SURVEYS",
    description:
      "Understand consumer purchasing behaviors, budgets, and competitor software usage.",
    fields: [
      {
        label: "How often do you purchase SaaS software online?",
        type: "RADIO",
        options: ["Weekly", "Monthly", "Quarterly", "Rarely"],
        isRequired: true,
      },
      {
        label: "What factor influences your purchase decision most?",
        type: "SELECT",
        options: [
          "Price & Affordability",
          "Feature Completeness",
          "Customer Reviews",
          "Ease of Use",
        ],
        isRequired: true,
      },
      {
        label: "What is your typical monthly budget for productivity tools?",
        type: "SELECT",
        options: ["Under $20/mo", "$20 - $50/mo", "$50 - $200/mo", "$200+/mo"],
        isRequired: true,
      },
      {
        label: "Which platforms do you discover new tools on?",
        type: "CHECKBOX",
        options: ["Twitter / X", "LinkedIn", "YouTube", "Reddit", "ProductHunt"],
        isRequired: true,
      },
      {
        label: "Would you participate in a paid 30-minute user research session?",
        type: "YES_NO",
        isRequired: true,
      },
    ],
  },
  {
    title: "Brand Awareness & Perception Survey",
    category: "SURVEYS",
    description:
      "Discover how target users perceive your brand personality, trustworthiness, and positioning.",
    fields: [
      {
        label: "When you think of modern form builders, which brand comes to mind first?",
        type: "TEXT",
        placeholder: "Type the first name that comes to mind...",
        isRequired: true,
      },
      {
        label: "How would you describe our brand personality in three words?",
        type: "TEXT",
        placeholder: "e.g. Sleek, fast, reliable...",
        isRequired: true,
      },
      {
        label: "Where did you first hear about ChaiForm?",
        type: "SELECT",
        options: [
          "Google Search",
          "YouTube Video",
          "Twitter / X Post",
          "Colleague Recommendation",
          "GitHub Repo",
        ],
        isRequired: true,
      },
      {
        label: "How trustworthy and secure does our platform feel to you?",
        type: "RATING",
        description: "1 = Low trust, 5 = Enterprise grade",
        isRequired: true,
      },
      {
        label: "What would make you switch away from legacy form tools?",
        type: "TEXTAREA",
        placeholder: "Share your honest thoughts...",
        isRequired: false,
      },
    ],
  },
  {
    title: "Website Usability & Navigation Survey",
    category: "SURVEYS",
    description:
      "Identify UX pain points, navigation roadblocks, and mobile responsive friction on your site.",
    fields: [
      {
        label: "Did you easily find what you were looking for on our website today?",
        type: "YES_NO",
        isRequired: true,
      },
      {
        label: "How would you rate the speed and responsiveness of our pages?",
        type: "RATING",
        description: "1 = Slow, 5 = Instant",
        isRequired: true,
      },
      {
        label: "Which section of the site was the most confusing or difficult to navigate?",
        type: "SELECT",
        options: [
          "Pricing Page",
          "Documentation / API Docs",
          "Template Gallery",
          "Dashboard Navigation",
          "Checkout / Billing",
        ],
        isRequired: true,
      },
      {
        label: "Any specific bug, broken link, or visual glitch you encountered?",
        type: "TEXTAREA",
        placeholder: "Describe what happened...",
        isRequired: false,
      },
      {
        label: "What device and browser were you using?",
        type: "TEXT",
        placeholder: "e.g. MacBook Pro, Chrome 124",
        isRequired: false,
      },
    ],
  },

  // ===================== 2. FEEDBACK (6 TEMPLATES) =====================
  {
    title: "Product Feedback & Features",
    category: "FEEDBACK",
    description:
      "Gather actionable feature requests, bug reports, and user satisfaction ratings from active users.",
    fields: [
      {
        label: "How often do you interact with our platform?",
        type: "RADIO",
        options: ["Daily", "A few times a week", "Once a week", "Rarely"],
        isRequired: true,
      },
      {
        label: "How would you rate the overall speed and responsiveness?",
        type: "RATING",
        description: "1 = Sluggish, 5 = Blazing fast",
        isRequired: true,
      },
      {
        label: "Which capabilities do you find most valuable?",
        type: "CHECKBOX",
        options: [
          "One-click templates",
          "Conversational UX",
          "Live QR Distribution",
          "Export to CSV/Excel",
        ],
        isRequired: true,
      },
      {
        label: "What is your biggest frustration or missing capability right now?",
        type: "TEXTAREA",
        placeholder: "Describe the friction point...",
        isRequired: true,
      },
      {
        label: "Would you be open to a 15-minute product interview?",
        type: "YES_NO",
        isRequired: true,
      },
    ],
  },
  {
    title: "AI Assistant & Copilot Feedback",
    category: "FEEDBACK",
    description:
      "Measure AI response quality, accuracy of code generation, and developer productivity gains.",
    fields: [
      {
        label: "How frequently do you rely on AI suggestions during your workflow?",
        type: "SELECT",
        options: [
          "Every single task",
          "Multiple times daily",
          "Occasionally for debugging",
          "Almost never",
        ],
        isRequired: true,
      },
      {
        label: "Rate the accuracy and relevance of generated code snippets",
        type: "RATING",
        description: "1 = Often incorrect, 5 = Highly accurate",
        isRequired: true,
      },
      {
        label: "How many hours per week do you estimate AI saves your team?",
        type: "SELECT",
        options: ["1-2 hours", "3-5 hours", "6-10 hours", "More than 10 hours"],
        isRequired: true,
      },
      {
        label: "In what situations has the AI provided inaccurate or hallucinated answers?",
        type: "TEXTAREA",
        placeholder: "Describe any edge cases...",
        isRequired: false,
      },
      {
        label: "Would you recommend this AI assistant to fellow engineering peers?",
        type: "YES_NO",
        isRequired: true,
      },
    ],
  },
  {
    title: "Customer Support Experience Feedback",
    category: "FEEDBACK",
    description:
      "Collect immediate feedback on customer service interactions, agent helpfulness, and resolution speed.",
    fields: [
      {
        label: "Which support channel did you use to contact our team?",
        type: "SELECT",
        options: ["Live Chat", "Email Ticket", "Discord Community", "Phone / Video Call"],
        isRequired: true,
      },
      {
        label: "How satisfied were you with the response time of our team?",
        type: "RATING",
        description: "1 = Unacceptable delay, 5 = Impressively fast",
        isRequired: true,
      },
      {
        label: "Was your issue or inquiry fully resolved during the interaction?",
        type: "YES_NO",
        isRequired: true,
      },
      {
        label: "How friendly and knowledgeable was the support specialist?",
        type: "RATING",
        description: "1 = Unhelpful, 5 = Exceptional service",
        isRequired: true,
      },
      {
        label: "Any additional comments or compliments for our support team?",
        type: "TEXTAREA",
        placeholder: "Leave a shoutout or suggestion...",
        isRequired: false,
      },
    ],
  },
  {
    title: "Mobile App Experience Feedback",
    category: "FEEDBACK",
    description:
      "Capture mobile gestures, offline support, touch targets, and mobile form submission feedback.",
    fields: [
      {
        label: "Which mobile device and operating system are you using?",
        type: "RADIO",
        options: [
          "iOS (iPhone / iPad)",
          "Android (Samsung / Pixel / OnePlus)",
          "Mobile Web Browser",
        ],
        isRequired: true,
      },
      {
        label: "How smooth are the screen animations and touch interactions?",
        type: "RATING",
        description: "1 = Laggy, 5 = Butter smooth",
        isRequired: true,
      },
      {
        label: "Have you experienced any unexpected crashes or freezes recently?",
        type: "YES_NO",
        isRequired: true,
      },
      {
        label: "Which desktop feature do you miss most when using mobile?",
        type: "TEXTAREA",
        placeholder: "What would make mobile 10x better...",
        isRequired: false,
      },
      {
        label: "How likely are you to rate our mobile app 5 stars on the store?",
        type: "RATING",
        isRequired: true,
      },
    ],
  },
  {
    title: "Onboarding & First-Time UX Feedback",
    category: "FEEDBACK",
    description:
      "Assess new user signup friction, tutorial clarity, and time-to-first-value onboarding.",
    fields: [
      {
        label: "How easy was it to get started and create your first form?",
        type: "RATING",
        description: "1 = Very difficult, 5 = Completely seamless",
        isRequired: true,
      },
      {
        label: "Did the interactive dashboard tips help you understand core features?",
        type: "YES_NO",
        isRequired: true,
      },
      {
        label: "How long did it take you to publish your first live form?",
        type: "SELECT",
        options: ["Under 2 minutes", "5-10 minutes", "Over 20 minutes", "Haven't published yet"],
        isRequired: true,
      },
      {
        label: "What step in the setup flow felt the most confusing or overwhelming?",
        type: "TEXTAREA",
        placeholder: "Describe where you hesitated...",
        isRequired: false,
      },
      {
        label: "What is one template you wish was available immediately?",
        type: "TEXT",
        placeholder: "e.g. Wedding RSVP, Medical Intake...",
        isRequired: false,
      },
    ],
  },
  {
    title: "Feature Beta & Early Access Feedback",
    category: "FEEDBACK",
    description:
      "Collect testing feedback from beta participants before general production release.",
    fields: [
      {
        label: "Which experimental beta feature are you testing?",
        type: "SELECT",
        options: [
          "Multi-step Logic branching",
          "Custom Domain CNAME",
          "AI Auto-Fill Prompts",
          "Theme Presets",
        ],
        isRequired: true,
      },
      {
        label: "How stable has this beta feature performed during your tests?",
        type: "RATING",
        description: "1 = Buggy, 5 = Rock solid",
        isRequired: true,
      },
      {
        label: "Did you encounter any edge cases or unexpected behaviors?",
        type: "TEXTAREA",
        placeholder: "Describe the unexpected behavior...",
        isRequired: false,
      },
      {
        label: "Is this feature ready for public production release in your opinion?",
        type: "YES_NO",
        isRequired: true,
      },
      {
        label: "What additional options should be added before general release?",
        type: "TEXTAREA",
        placeholder: "Your feature wishlist...",
        isRequired: false,
      },
    ],
  },

  // ===================== 3. EVENTS (6 TEMPLATES) =====================
  {
    title: "Tech Conference Registration",
    category: "EVENTS",
    description:
      "Register attendees, collect company info, dietary preferences, and ticket tiers for events.",
    fields: [
      {
        label: "Attendee Full Name",
        type: "TEXT",
        placeholder: "Sarah Jenkins",
        isRequired: true,
      },
      {
        label: "Work Email Address",
        type: "EMAIL",
        placeholder: "sarah@company.com",
        isRequired: true,
      },
      {
        label: "Company or Institution",
        type: "TEXT",
        placeholder: "ChaiCode Labs",
        isRequired: true,
      },
      {
        label: "Ticket Tier Selection",
        type: "RADIO",
        options: [
          "General Admission (Free)",
          "VIP All-Access Pass ($49)",
          "Student Pass ($19)",
          "Virtual Live-Stream Pass (Free)",
        ],
        isRequired: true,
      },
      {
        label: "Workshop Tracks of Interest",
        type: "CHECKBOX",
        options: [
          "Full Stack Systems & Monorepos",
          "AI & Large Language Models",
          "PostgreSQL & Database Optimization",
          "Cloud Architecture & Docker",
        ],
        isRequired: true,
      },
      {
        label: "Dietary Preferences",
        type: "SELECT",
        options: ["No Restrictions", "Vegetarian", "Vegan", "Gluten-Free", "Halal"],
        isRequired: false,
      },
      {
        label: "Do you require special accessibility accommodations?",
        type: "YES_NO",
        isRequired: false,
      },
    ],
  },
  {
    title: "Full Stack Cohort Enrollment",
    category: "EVENTS",
    description:
      "Streamlined student onboarding with preferred batch times, coding background, and goals.",
    fields: [
      {
        label: "Student Full Name",
        type: "TEXT",
        placeholder: "Kenil Patel",
        isRequired: true,
      },
      {
        label: "Contact Email",
        type: "EMAIL",
        placeholder: "kenil@example.com",
        isRequired: true,
      },
      {
        label: "WhatsApp / Mobile Number",
        type: "PHONE",
        placeholder: "+91 99887 76655",
        isRequired: true,
      },
      {
        label: "Preferred Batch Timing",
        type: "RADIO",
        options: [
          "Morning Batch (8:00 AM - 10:00 AM IST)",
          "Evening Batch (7:00 PM - 9:00 PM IST)",
          "Weekend Intensive (Saturday & Sunday)",
        ],
        isRequired: true,
      },
      {
        label: "Current Coding Proficiency Level",
        type: "SELECT",
        options: [
          "Complete Beginner",
          "Know basic HTML/JS",
          "Intermediate (Built simple projects)",
          "Experienced working developer",
        ],
        isRequired: true,
      },
      {
        label: "Primary Goal for joining this cohort",
        type: "CHECKBOX",
        options: [
          "Get my first Software Engineer job",
          "Switch to Full Stack Developer",
          "Build and launch my own startup SaaS",
          "Upskill in Modern Monorepos & tRPC",
        ],
        isRequired: true,
      },
      {
        label: "Do you have a dedicated laptop with 8GB+ RAM?",
        type: "YES_NO",
        isRequired: true,
      },
    ],
  },
  {
    title: "Webinar RSVP & Live Q&A",
    category: "EVENTS",
    description:
      "Collect registrations for live webinars, workshops, and pre-submit audience questions.",
    fields: [
      {
        label: "Your Full Name",
        type: "TEXT",
        placeholder: "Alex Johnson",
        isRequired: true,
      },
      {
        label: "Work Email",
        type: "EMAIL",
        placeholder: "alex@techstart.io",
        isRequired: true,
      },
      {
        label: "Current Role",
        type: "SELECT",
        options: [
          "Founder / Executive",
          "Software Engineer",
          "Product Manager",
          "Designer",
          "Student / Learning",
        ],
        isRequired: true,
      },
      {
        label: "What is your #1 question for our guest speakers?",
        type: "TEXTAREA",
        placeholder: "Ask anything about full-stack architecture, scaling, or tRPC...",
        isRequired: true,
      },
      {
        label: "Would you like an invite to our private developer Discord?",
        type: "YES_NO",
        isRequired: true,
      },
    ],
  },
  {
    title: "Hackathon Team Registration",
    category: "EVENTS",
    description:
      "Register software teams, solo hackers, challenge tracks, and project repositories for hackathons.",
    fields: [
      {
        label: "Team Name",
        type: "TEXT",
        placeholder: "ByteCrafters",
        isRequired: true,
      },
      {
        label: "Team Leader Full Name & Email",
        type: "TEXT",
        placeholder: "Alice Walker (alice@hack.io)",
        isRequired: true,
      },
      {
        label: "Total Number of Team Members",
        type: "SELECT",
        options: ["1 (Solo Hacker)", "2 Members", "3 Members", "4 Members (Max)"],
        isRequired: true,
      },
      {
        label: "Challenge Track Selection",
        type: "RADIO",
        options: [
          "Track 1: Generative AI & Autonomous Agents",
          "Track 2: Web3 & Decentralized Finance",
          "Track 3: Developer Tooling & Productivity",
          "Track 4: Open Innovation",
        ],
        isRequired: true,
      },
      {
        label: "Team GitHub Organization or Shared Repo URL",
        type: "URL",
        placeholder: "https://github.com/team-repo",
        isRequired: false,
      },
      {
        label: "T-Shirt Sizes for Team Members",
        type: "TEXT",
        placeholder: "e.g. 2x M, 1x L, 1x XL",
        isRequired: false,
      },
      {
        label: "Do all members agree to the hackathon code of conduct?",
        type: "YES_NO",
        isRequired: true,
      },
    ],
  },
  {
    title: "VIP Executive Dinner RSVP",
    category: "EVENTS",
    description:
      "Exclusive RSVP form for founders, CTOs, and investors with entree choices and attendee bios.",
    fields: [
      {
        label: "Guest Full Name",
        type: "TEXT",
        placeholder: "Elena Vance",
        isRequired: true,
      },
      {
        label: "Executive Title & Company Name",
        type: "TEXT",
        placeholder: "VP of Engineering at CloudScale",
        isRequired: true,
      },
      {
        label: "Work Email",
        type: "EMAIL",
        placeholder: "elena@cloudscale.io",
        isRequired: true,
      },
      {
        label: "Will you be attending the executive dinner in person?",
        type: "RADIO",
        options: [
          "Yes, I will attend in person",
          "Regretfully declining",
          "Sending an executive proxy",
        ],
        isRequired: true,
      },
      {
        label: "Preferred Entree Selection",
        type: "SELECT",
        options: [
          "Filet Mignon (Beef)",
          "Pan-Seared Salmon",
          "Wild Mushroom Risotto (Vegetarian)",
          "Roasted Cauliflower Steak (Vegan)",
        ],
        isRequired: true,
      },
      {
        label: "LinkedIn Profile URL for attendee directory",
        type: "URL",
        placeholder: "https://linkedin.com/in/elena",
        isRequired: false,
      },
    ],
  },
  {
    title: "Community Meetup & Workshop RSVP",
    category: "EVENTS",
    description:
      "RSVP for local developer meetups, city chapters, and lightning talk speaker submissions.",
    fields: [
      {
        label: "Your Full Name",
        type: "TEXT",
        placeholder: "Karan Singhania",
        isRequired: true,
      },
      {
        label: "Email Address",
        type: "EMAIL",
        placeholder: "karan@example.com",
        isRequired: true,
      },
      {
        label: "City / Chapter Location",
        type: "SELECT",
        options: [
          "San Francisco / Bay Area",
          "New York City",
          "Bengaluru",
          "London",
          "Berlin",
          "Remote / Online",
        ],
        isRequired: true,
      },
      {
        label: "Are you interested in giving a 5-minute lightning talk?",
        type: "YES_NO",
        isRequired: true,
      },
      {
        label: "If yes, what would be the topic of your lightning talk?",
        type: "TEXT",
        placeholder: "e.g. Building micro-frontends with Turborepo",
        isRequired: false,
      },
      {
        label: "How did you hear about this meetup?",
        type: "SELECT",
        options: ["Twitter / X", "Meetup.com", "Friend / Colleague", "Discord Server"],
        isRequired: true,
      },
    ],
  },

  // ===================== 4. APPLICATIONS (6 TEMPLATES) =====================
  {
    title: "Software Engineer Application",
    category: "APPLICATIONS",
    description:
      "Collect candidate profiles, portfolio links, experience details, and tech stack proficiencies.",
    fields: [
      {
        label: "Full Legal Name",
        type: "TEXT",
        placeholder: "John Doe",
        isRequired: true,
      },
      {
        label: "Email Address",
        type: "EMAIL",
        placeholder: "john.doe@example.com",
        isRequired: true,
      },
      {
        label: "Phone Number",
        type: "PHONE",
        placeholder: "+91 98765 43210",
        isRequired: true,
      },
      {
        label: "Position You Are Applying For",
        type: "SELECT",
        options: [
          "Frontend Engineer (Next.js)",
          "Backend Engineer (Node/Postgres)",
          "Full Stack Engineer (TypeScript)",
          "DevOps & Cloud Engineer",
        ],
        isRequired: true,
      },
      {
        label: "Total Years of Relevant Experience",
        type: "NUMBER",
        placeholder: "3",
        isRequired: true,
      },
      {
        label: "Portfolio or GitHub Profile URL",
        type: "URL",
        placeholder: "https://github.com/username",
        isRequired: true,
      },
      {
        label: "Earliest Available Start Date",
        type: "DATE",
        isRequired: true,
      },
      {
        label: "Highlight your key technical achievements and passion",
        type: "TEXTAREA",
        placeholder: "Describe a complex problem you solved...",
        isRequired: true,
      },
    ],
  },
  {
    title: "Product Designer Application",
    category: "APPLICATIONS",
    description:
      "Screen product designers with portfolio links, design systems, and UX case studies.",
    fields: [
      {
        label: "Full Name",
        type: "TEXT",
        placeholder: "Maya Lin",
        isRequired: true,
      },
      {
        label: "Email Address",
        type: "EMAIL",
        placeholder: "maya@design.co",
        isRequired: true,
      },
      {
        label: "Design Portfolio or Figma URL",
        type: "URL",
        placeholder: "https://figma.com/@portfolio",
        isRequired: true,
      },
      {
        label: "Primary Design Tools",
        type: "CHECKBOX",
        options: ["Figma", "Framer", "Adobe Creative Suite", "Spline 3D"],
        isRequired: true,
      },
      {
        label: "Experience with Design Systems",
        type: "SELECT",
        options: [
          "Built design systems from scratch",
          "Maintained existing design systems",
          "Familiar with UI kits only",
        ],
        isRequired: true,
      },
      {
        label: "Link to a live project or app that you designed",
        type: "URL",
        placeholder: "https://myproject.app",
        isRequired: false,
      },
      {
        label: "What product has the best micro-interactions in your opinion and why?",
        type: "TEXTAREA",
        placeholder: "Share your design thoughts...",
        isRequired: true,
      },
    ],
  },
  {
    title: "Creator Partnership Request",
    category: "APPLICATIONS",
    description:
      "Onboard influencers, content creators, and community ambassadors for sponsorship deals.",
    fields: [
      {
        label: "Creator / Brand Name",
        type: "TEXT",
        placeholder: "Chai Tech Reviews",
        isRequired: true,
      },
      {
        label: "Contact Email",
        type: "EMAIL",
        placeholder: "partnerships@creator.com",
        isRequired: true,
      },
      {
        label: "Primary Content Platform",
        type: "SELECT",
        options: ["YouTube", "Twitter / X", "LinkedIn", "Instagram", "Newsletter / Substack"],
        isRequired: true,
      },
      {
        label: "Primary Channel or Profile URL",
        type: "URL",
        placeholder: "https://youtube.com/@channel",
        isRequired: true,
      },
      {
        label: "Total Audience Reach / Follower Base",
        type: "SELECT",
        options: ["Under 10K", "10K - 50K", "50K - 200K", "200K+"],
        isRequired: true,
      },
      {
        label: "Preferred Collaboration Model",
        type: "CHECKBOX",
        options: [
          "Sponsored Video / Post",
          "Affiliate Commission",
          "Speaking Engagement",
          "Long-term Ambassadorship",
        ],
        isRequired: true,
      },
      {
        label: "Estimated Sponsorship Budget / Rate",
        type: "TEXT",
        placeholder: "$500 - $1,500",
        isRequired: false,
      },
    ],
  },
  {
    title: "Product Manager (PM) Application",
    category: "APPLICATIONS",
    description:
      "Screen technical product managers on product roadmaps, metrics impact, and engineering alignment.",
    fields: [
      {
        label: "Full Legal Name",
        type: "TEXT",
        placeholder: "Rahul Mehra",
        isRequired: true,
      },
      {
        label: "Email Address",
        type: "EMAIL",
        placeholder: "rahul@product.io",
        isRequired: true,
      },
      {
        label: "LinkedIn Profile URL",
        type: "URL",
        placeholder: "https://linkedin.com/in/rahul",
        isRequired: true,
      },
      {
        label: "Years of Product Management Experience",
        type: "SELECT",
        options: [
          "1-2 years (Associate PM)",
          "3-5 years (PM)",
          "6-9 years (Senior PM)",
          "10+ years (Lead / Director)",
        ],
        isRequired: true,
      },
      {
        label: "Describe a product feature you shipped that moved a core business metric",
        type: "TEXTAREA",
        placeholder: "What was the metric, hypothesis, and outcome?",
        isRequired: true,
      },
      {
        label: "How do you handle technical disagreements between engineering and design?",
        type: "TEXTAREA",
        placeholder: "Describe your communication framework...",
        isRequired: true,
      },
      {
        label: "Desired Salary Range (Annual USD)",
        type: "TEXT",
        placeholder: "$120,000 - $160,000",
        isRequired: false,
      },
    ],
  },
  {
    title: "Startup Grant & Fellowship Program",
    category: "APPLICATIONS",
    description:
      "Apply for non-dilutive founder grants, cloud credits, and accelerator interview rounds.",
    fields: [
      {
        label: "Founder Full Name & Co-Founders",
        type: "TEXT",
        placeholder: "Marcus Aurelius, Linus Torvalds",
        isRequired: true,
      },
      {
        label: "Startup / Project Name",
        type: "TEXT",
        placeholder: "NextEngine AI",
        isRequired: true,
      },
      {
        label: "Founder Email Address",
        type: "EMAIL",
        placeholder: "marcus@nextengine.ai",
        isRequired: true,
      },
      {
        label: "Demo Video or Pitch Deck URL",
        type: "URL",
        placeholder: "https://loom.com/share/demo",
        isRequired: true,
      },
      {
        label: "What unique insight does your startup have that others miss?",
        type: "TEXTAREA",
        placeholder: "Explain your unfair advantage...",
        isRequired: true,
      },
      {
        label: "Current Stage of Development",
        type: "RADIO",
        options: ["Idea & Wireframes", "Working MVP", "Live with Beta Users", "Generating Revenue"],
        isRequired: true,
      },
      {
        label: "How much grant funding are you requesting?",
        type: "SELECT",
        options: ["$5,000", "$15,000", "$25,000", "$50,000"],
        isRequired: true,
      },
    ],
  },
  {
    title: "Open Source Contributor Application",
    category: "APPLICATIONS",
    description:
      "Join core maintainer squads, request issue bounties, and join contributor Discord channels.",
    fields: [
      {
        label: "GitHub Username",
        type: "TEXT",
        placeholder: "octocat",
        isRequired: true,
      },
      {
        label: "Primary Programming Languages",
        type: "CHECKBOX",
        options: ["TypeScript / JavaScript", "Rust", "Go", "Python", "SQL"],
        isRequired: true,
      },
      {
        label: "Link to a Pull Request or open source contribution you are proud of",
        type: "URL",
        placeholder: "https://github.com/org/repo/pull/123",
        isRequired: true,
      },
      {
        label: "Which area of the codebase would you like to contribute to?",
        type: "SELECT",
        options: [
          "Core Form Engine & Rendering",
          "tRPC API & Database Queries",
          "UI Components & Accessibility",
          "Documentation & Guides",
        ],
        isRequired: true,
      },
      {
        label: "Estimated Weekly Hours Available for Contributions",
        type: "SELECT",
        options: ["2-5 hours/week", "5-10 hours/week", "10+ hours/week"],
        isRequired: true,
      },
      {
        label: "Discord Username for Contributor Team Channel",
        type: "TEXT",
        placeholder: "octocat#1234",
        isRequired: true,
      },
    ],
  },

  // ===================== 5. QUIZZES (6 TEMPLATES) =====================
  {
    title: "Full Stack Developer Quiz",
    category: "QUIZZES",
    description:
      "Interactive developer skill test covering TypeScript, tRPC, React 19, and full-stack architecture.",
    fields: [
      {
        label:
          "Which TypeScript keyword is used to create a property that cannot be modified after declaration?",
        type: "RADIO",
        options: ["readonly", "const", "immutable", "frozen"],
        isRequired: true,
      },
      {
        label: "What is the primary benefit of tRPC compared to traditional REST APIs?",
        type: "RADIO",
        options: [
          "Automatic end-to-end type safety without code generation",
          "Faster network packets",
          "Built-in database ORM",
          "Replaces CSS styling",
        ],
        isRequired: true,
      },
      {
        label:
          "In modern React, which hook is used to consume asynchronous promises or context directly?",
        type: "RADIO",
        options: ["use()", "useFetch()", "usePromise()", "useResource()"],
        isRequired: true,
      },
      {
        label: "Which SQL clause is used to return unique values without duplicates?",
        type: "RADIO",
        options: ["DISTINCT", "UNIQUE", "NO_DUPLICATE", "FILTER"],
        isRequired: true,
      },
      {
        label: "How would you rate your confidence in architecting full-stack monorepos?",
        type: "RATING",
        description: "1 = Beginner, 5 = Staff/Principal Level",
        isRequired: true,
      },
      {
        label: "Which topics would you like to master next?",
        type: "CHECKBOX",
        options: [
          "PostgreSQL Query Optimization & Indexing",
          "Docker & Kubernetes Containerization",
          "Turborepo & Monorepo Caching",
          "Real-time WebSockets & Server-Sent Events",
        ],
        isRequired: true,
      },
    ],
  },
  {
    title: "JavaScript & Web Core Quiz",
    category: "QUIZZES",
    description:
      "Quick 5-minute quiz testing Core JavaScript, ESNext features, event loop, and web security.",
    fields: [
      {
        label: "What is the output of `typeof null` in standard JavaScript?",
        type: "RADIO",
        options: ["'object'", "'null'", "'undefined'", "'boolean'"],
        isRequired: true,
      },
      {
        label:
          "Which storage mechanism is automatically sent with every matching HTTP request header?",
        type: "RADIO",
        options: ["Cookies", "localStorage", "sessionStorage", "IndexedDB"],
        isRequired: true,
      },
      {
        label: "What does the `SameSite=Strict` cookie attribute primarily protect against?",
        type: "RADIO",
        options: [
          "Cross-Site Request Forgery (CSRF)",
          "SQL Injection",
          "Distributed Denial of Service (DDoS)",
          "Cross-Site Scripting (XSS)",
        ],
        isRequired: true,
      },
      {
        label: "Which HTTP status code signifies that a client must authenticate itself?",
        type: "RADIO",
        options: ["401 Unauthorized", "403 Forbidden", "400 Bad Request", "404 Not Found"],
        isRequired: true,
      },
      {
        label: "Rate your confidence in debugging asynchronous JavaScript event loop & microtasks",
        type: "RATING",
        description: "1 = Shaky, 5 = Deep Mastery",
        isRequired: true,
      },
    ],
  },
  {
    title: "React 19 & Next.js Architecture Quiz",
    category: "QUIZZES",
    description:
      "Test your knowledge on React 19 Actions, Server Components, Suspense, and hydration mechanics.",
    fields: [
      {
        label: "What is the primary benefit of React Server Components in Next.js?",
        type: "RADIO",
        options: [
          "Zero impact on client JavaScript bundle size",
          "They can directly use useState and useEffect",
          "They only run on the user's browser",
          "They eliminate the need for CSS",
        ],
        isRequired: true,
      },
      {
        label: "Which directive converts an asynchronous function into a Next.js Server Action?",
        type: "RADIO",
        options: ["'use server'", "'use client'", "'use action'", "'use api'"],
        isRequired: true,
      },
      {
        label: "In React 19, how are refs passed to function components?",
        type: "RADIO",
        options: [
          "Refs can be passed directly as regular props without forwardRef",
          "Using the useForwardRef() hook",
          "Using the withRef() higher order component",
          "Refs are no longer supported",
        ],
        isRequired: true,
      },
      {
        label: "What is the primary cause of React hydration errors in Next.js?",
        type: "RADIO",
        options: [
          "Mismatch between server-rendered HTML and client initial render",
          "Network latency over 100ms",
          "Using Tailwind CSS instead of CSS Modules",
          "Too many concurrent database connections",
        ],
        isRequired: true,
      },
      {
        label: "Rate your mastery of Next.js Turbopack and streaming Suspense boundaries",
        type: "RATING",
        description: "1 = Beginner, 5 = Senior Architect",
        isRequired: true,
      },
    ],
  },
  {
    title: "System Design & Cloud Architecture Quiz",
    category: "QUIZZES",
    description:
      "Evaluate your skills in distributed systems, CAP theorem, caching strategies, and message brokers.",
    fields: [
      {
        label: "Which HTTP header serves stale cached content while asynchronously revalidating?",
        type: "RADIO",
        options: ["stale-while-revalidate", "no-cache", "immutable", "must-revalidate"],
        isRequired: true,
      },
      {
        label:
          "According to the CAP Theorem, what can a distributed system guarantee during a network partition?",
        type: "RADIO",
        options: [
          "Either Consistency or Availability, but not both",
          "Both Consistency and Availability simultaneously",
          "Zero latency and infinite throughput",
          "Partitions can never occur in cloud networks",
        ],
        isRequired: true,
      },
      {
        label: "What is the primary benefit of a PostgreSQL connection pooler (e.g. PgBouncer)?",
        type: "RADIO",
        options: [
          "Reuses existing backend processes to prevent connection exhaustion",
          "Compresses database tables on disk",
          "Auto-generates foreign key relationships",
          "Replaces SQL with GraphQL",
        ],
        isRequired: true,
      },
      {
        label:
          "Which message broker is best suited for durable high-throughput append-only event streaming?",
        type: "RADIO",
        options: ["Apache Kafka", "Redis Pub/Sub", "RabbitMQ", "SQLite In-Memory"],
        isRequired: true,
      },
      {
        label: "Rate your knowledge of microservices vs modular monorepo architectural trade-offs",
        type: "RATING",
        description: "1 = Basic, 5 = Principal Staff Level",
        isRequired: true,
      },
    ],
  },
  {
    title: "AI & Prompt Engineering Quiz",
    category: "QUIZZES",
    description:
      "Assess your foundation in LLM tokenization, RAG pipelines, vector databases, and agent loops.",
    fields: [
      {
        label: "In Large Language Models, what does 'Few-Shot Prompting' mean?",
        type: "RADIO",
        options: [
          "Providing multiple demonstration examples within the prompt context",
          "Limiting the model output to fewer than 5 tokens",
          "Training model weights on a small dataset",
          "Running the model only a few times per hour",
        ],
        isRequired: true,
      },
      {
        label: "What does RAG stand for in modern AI application architecture?",
        type: "RADIO",
        options: [
          "Retrieval-Augmented Generation",
          "Randomized Attention Gradient",
          "Recursive Auto-regression Graph",
          "Real-time Agent Gateway",
        ],
        isRequired: true,
      },
      {
        label:
          "Which vector distance metric is most commonly used to measure semantic embedding similarity?",
        type: "RADIO",
        options: ["Cosine Similarity", "Manhattan Distance", "Hamming Distance", "Jaccard Index"],
        isRequired: true,
      },
      {
        label: "What is the primary underlying cause of hallucinations in LLMs?",
        type: "RADIO",
        options: [
          "Sampling statistically likely token continuations without deterministic ground truth",
          "Insufficient GPU VRAM during inference",
          "Overheating server racks",
          "Using JSON formatting instead of plain text",
        ],
        isRequired: true,
      },
      {
        label:
          "Rate your experience in building production autonomous agents with tool-calling capabilities",
        type: "RATING",
        description: "1 = Never built, 5 = Deployed in production",
        isRequired: true,
      },
    ],
  },
  {
    title: "SQL & PostgreSQL Performance Quiz",
    category: "QUIZZES",
    description:
      "Challenge your database indexing, EXPLAIN ANALYZE interpretation, and transaction isolation skills.",
    fields: [
      {
        label:
          "Which PostgreSQL index type is most effective for array containment and full-text search?",
        type: "RADIO",
        options: ["GIN (Generalized Inverted Index)", "B-Tree Index", "Hash Index", "BRIN Index"],
        isRequired: true,
      },
      {
        label: "What is the primary function of the SQL `EXPLAIN ANALYZE` command in PostgreSQL?",
        type: "RADIO",
        options: [
          "Executes the query and displays real execution plan timings per node",
          "Checks syntax without executing the query",
          "Formats and lints SQL queries automatically",
          "Drops unused tables and indexes",
        ],
        isRequired: true,
      },
      {
        label: "In PostgreSQL, what is the main purpose of the `VACUUM` process?",
        type: "RADIO",
        options: [
          "Reclaim disk storage occupied by dead row tuples from UPDATEs and DELETEs",
          "Flush all cache memory to restart PostgreSQL",
          "Migrate tables from HDD to NVMe SSD",
          "Back up data directly to AWS S3",
        ],
        isRequired: true,
      },
      {
        label:
          "Which SQL transaction isolation level prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads?",
        type: "RADIO",
        options: ["SERIALIZABLE", "READ COMMITTED", "READ UNCOMMITTED", "REPEATABLE READ"],
        isRequired: true,
      },
      {
        label: "Rate your ability to optimize slow queries using compound indexes and query plans",
        type: "RATING",
        description: "1 = Novice, 5 = DBA Expert",
        isRequired: true,
      },
    ],
  },

  // ===================== 6. GENERAL (6 TEMPLATES) =====================
  {
    title: "Contact Us & Sales Inquiry",
    category: "GENERAL",
    description:
      "Clean business inquiry and support contact form for fast lead generation and customer support.",
    fields: [
      {
        label: "Your Full Name",
        type: "TEXT",
        placeholder: "Alex Smith",
        isRequired: true,
      },
      {
        label: "Business Email Address",
        type: "EMAIL",
        placeholder: "alex@example.com",
        isRequired: true,
      },
      {
        label: "Inquiry Category",
        type: "SELECT",
        options: [
          "Enterprise Sales",
          "General Support",
          "Partnership & Press",
          "Billing & Invoicing",
        ],
        isRequired: true,
      },
      {
        label: "Subject",
        type: "TEXT",
        placeholder: "e.g. Custom enterprise integration question",
        isRequired: true,
      },
      {
        label: "Message Details",
        type: "TEXTAREA",
        placeholder: "Write your message in detail...",
        isRequired: true,
      },
      {
        label: "Preferred Call Time",
        type: "TIME",
        isRequired: false,
      },
    ],
  },
  {
    title: "SaaS Enterprise Demo Request",
    category: "GENERAL",
    description: "Qualify high-value enterprise leads and book live tailored product walkthroughs.",
    fields: [
      {
        label: "Full Name",
        type: "TEXT",
        placeholder: "David Miller",
        isRequired: true,
      },
      {
        label: "Corporate Work Email",
        type: "EMAIL",
        placeholder: "david@acmecorp.com",
        isRequired: true,
      },
      {
        label: "Company Name",
        type: "TEXT",
        placeholder: "Acme Corporation",
        isRequired: true,
      },
      {
        label: "Company Employee Size",
        type: "SELECT",
        options: [
          "1-10 Employees",
          "11-50 Employees",
          "51-200 Employees",
          "201-1000 Employees",
          "1000+ Employees",
        ],
        isRequired: true,
      },
      {
        label: "Primary Goal for Your Team",
        type: "CHECKBOX",
        options: [
          "Replace slow legacy forms",
          "Integrate directly with PostgreSQL/CRM",
          "Embed type-safe forms in Next.js",
          "SOC2 compliance & data security",
        ],
        isRequired: true,
      },
      {
        label: "Implementation Timeline",
        type: "SELECT",
        options: ["Immediately (This Month)", "Within 1-3 Months", "Researching for Next Quarter"],
        isRequired: true,
      },
    ],
  },
  {
    title: "Bug Report & Diagnostics Form",
    category: "GENERAL",
    description:
      "Capture structured bug reports with steps to reproduce, environment info, and severity.",
    fields: [
      {
        label: "Reporter Name & Email",
        type: "TEXT",
        placeholder: "Sam Taylor (sam@company.io)",
        isRequired: true,
      },
      {
        label: "Issue Headline / Summary",
        type: "TEXT",
        placeholder: "e.g. Form builder loses unsaved field edits on mobile",
        isRequired: true,
      },
      {
        label: "Operating System & Browser",
        type: "SELECT",
        options: [
          "Windows / Chrome",
          "macOS / Chrome",
          "macOS / Safari",
          "Linux / Firefox",
          "iOS Mobile Safari",
          "Android Chrome",
        ],
        isRequired: true,
      },
      {
        label: "Bug Severity Level",
        type: "RADIO",
        options: [
          "P0 - Critical Blocker (Site Down)",
          "P1 - High (Major Feature Broken)",
          "P2 - Medium (Workaround Available)",
          "P3 - Low (Cosmetic/Typo)",
        ],
        isRequired: true,
      },
      {
        label: "Detailed Steps to Reproduce the Issue",
        type: "TEXTAREA",
        placeholder: "1. Go to...\n2. Click on...\n3. Observe...",
        isRequired: true,
      },
      {
        label: "Expected vs Actual Behavior",
        type: "TEXTAREA",
        placeholder: "What should have happened vs what actually happened...",
        isRequired: true,
      },
    ],
  },
  {
    title: "General RSVP & Party Invitation",
    category: "GENERAL",
    description:
      "Fun, conversational RSVP form for parties, birthdays, anniversaries, and social celebrations.",
    fields: [
      {
        label: "Guest Full Name",
        type: "TEXT",
        placeholder: "Jordan Lee",
        isRequired: true,
      },
      {
        label: "Email Address",
        type: "EMAIL",
        placeholder: "jordan@example.com",
        isRequired: true,
      },
      {
        label: "Will you be able to attend the celebration?",
        type: "RADIO",
        options: ["Joyfully Yes!", "Regretfully Cannot Attend", "Tentative / Not Sure Yet"],
        isRequired: true,
      },
      {
        label: "Number of Accompanying Plus-Ones",
        type: "SELECT",
        options: ["Just Me (0)", "+1 Guest", "+2 Guests", "+3 or more"],
        isRequired: true,
      },
      {
        label: "Favorite song request for the party playlist",
        type: "TEXT",
        placeholder: "Artist - Song Name",
        isRequired: false,
      },
      {
        label: "Any special food allergies or dietary needs?",
        type: "TEXT",
        placeholder: "e.g. Peanut allergy, Vegan...",
        isRequired: false,
      },
    ],
  },
  {
    title: "Volunteer & Community Sign-Up",
    category: "GENERAL",
    description:
      "Organize non-profit volunteers, committee preferences, availability schedules, and contact info.",
    fields: [
      {
        label: "Volunteer Full Name",
        type: "TEXT",
        placeholder: "Priya Sharma",
        isRequired: true,
      },
      {
        label: "Contact Email",
        type: "EMAIL",
        placeholder: "priya@volunteer.org",
        isRequired: true,
      },
      {
        label: "Mobile Phone Number",
        type: "PHONE",
        placeholder: "+91 98765 00000",
        isRequired: true,
      },
      {
        label: "Which volunteer committees are you interested in joining?",
        type: "CHECKBOX",
        options: [
          "Event Logistics & Setup",
          "Social Media & Photography",
          "Speaker / Guest Hospitality",
          "Technical & Audio/Visual Crew",
          "Registration Desk",
        ],
        isRequired: true,
      },
      {
        label: "Available Days & Times",
        type: "SELECT",
        options: ["Weekday Mornings", "Weekday Evenings", "Weekends Only", "Flexible / On-call"],
        isRequired: true,
      },
      {
        label: "Emergency Contact Name and Phone Number",
        type: "TEXT",
        placeholder: "Raj Sharma (+91 98765 11111)",
        isRequired: true,
      },
      {
        label: "Previous volunteer or community experience",
        type: "TEXTAREA",
        placeholder: "Briefly share any relevant past involvement...",
        isRequired: false,
      },
    ],
  },
  {
    title: "Vendor & Supplier Onboarding Form",
    category: "GENERAL",
    description:
      "Collect procurement details, GST/Tax IDs, payment terms, and banking wire information from vendors.",
    fields: [
      {
        label: "Vendor Legal Business Name",
        type: "TEXT",
        placeholder: "Apex Supplies Pvt Ltd",
        isRequired: true,
      },
      {
        label: "Primary Business Representative Name",
        type: "TEXT",
        placeholder: "Robert Chen",
        isRequired: true,
      },
      {
        label: "Corporate Billing Email",
        type: "EMAIL",
        placeholder: "billing@apexsupplies.com",
        isRequired: true,
      },
      {
        label: "Tax ID / GST / VAT Registration Number",
        type: "TEXT",
        placeholder: "GSTIN27AAAAA0000A1Z5",
        isRequired: true,
      },
      {
        label: "Service / Product Category Supplied",
        type: "SELECT",
        options: [
          "Cloud Hosting & Software Licenses",
          "Hardware & IT Equipment",
          "Office Supplies & Furniture",
          "Legal & Accounting Services",
          "Marketing & Creative Services",
        ],
        isRequired: true,
      },
      {
        label: "Standard Payment Terms Requested",
        type: "RADIO",
        options: ["Net 15 Days", "Net 30 Days", "Net 45 Days", "Immediate Due on Receipt"],
        isRequired: true,
      },
      {
        label: "Bank Account & Wire Routing Details for Direct Deposit",
        type: "TEXTAREA",
        placeholder: "Bank Name, Account Number, IFSC / SWIFT Code...",
        isRequired: true,
      },
    ],
  },
];

async function seed() {
  console.log("Starting modern templates database seeding...");

  // Find admin user
  const users = await db.select({ id: usersTable.id }).from(usersTable).limit(1);
  if (users.length === 0) {
    console.error("No users found in database! Please run user seed or register first.");
    process.exit(1);
  }
  const adminUserId = users[0]!.id;
  console.log(`Using admin user ID: ${adminUserId}`);

  // Fetch all existing forms
  const existingForms = await db.select().from(formsTable);
  console.log(`Found ${existingForms.length} existing forms in database.`);

  // Clean up any test forms
  for (const form of existingForms) {
    if (form.title.toLowerCase().startsWith("test")) {
      await db
        .update(formsTable)
        .set({ visibility: "UNLISTED", isPublished: false })
        .where(eq(formsTable.id, form.id));
    }
  }

  // Iterate over all 36 modern template definitions
  for (const tpl of TEMPLATES) {
    let formRecord = existingForms.find((f) => f.title.toLowerCase() === tpl.title.toLowerCase());

    if (!formRecord) {
      console.log(`Creating template: "${tpl.title}" [${tpl.category}]...`);
      const [inserted] = await db
        .insert(formsTable)
        .values({
          title: tpl.title,
          description: tpl.description,
          category: tpl.category,
          visibility: "PUBLIC",
          isPublished: true,
          isArchived: false,
          createdBy: adminUserId,
        })
        .returning();
      formRecord = inserted;
    } else {
      console.log(`Updating existing template: "${tpl.title}" [${tpl.category}]...`);
      await db
        .update(formsTable)
        .set({
          description: tpl.description,
          category: tpl.category,
          visibility: "PUBLIC",
          isPublished: true,
          isArchived: false,
        })
        .where(eq(formsTable.id, formRecord.id));
    }

    if (!formRecord) continue;

    // Check existing fields
    const existingFields = await db
      .select({ id: formFieldsTable.id })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formRecord.id));

    if (existingFields.length === 0) {
      console.log(`Adding ${tpl.fields.length} questions to "${tpl.title}"...`);
      let index = 1;
      for (const f of tpl.fields) {
        const labelKey = toLabelKey(f.label);
        await db.insert(formFieldsTable).values({
          formId: formRecord.id,
          label: f.label,
          labelKey,
          type: f.type as any,
          description: f.description ?? null,
          placeholder: f.placeholder ?? null,
          isRequired: f.isRequired,
          options: f.options ?? null,
          index: (index++).toFixed(2),
        });
      }
      console.log(`✓ Seeded questions for "${tpl.title}".`);
    }

    // Check if it has sample submissions
    const existingSubs = await db
      .select({ id: formSubmissionTable.id })
      .from(formSubmissionTable)
      .where(eq(formSubmissionTable.formId, formRecord.id))
      .limit(1);

    if (existingSubs.length === 0) {
      const allFields = await db
        .select()
        .from(formFieldsTable)
        .where(eq(formFieldsTable.formId, formRecord.id));

      if (allFields.length > 0) {
        const sampleValues = allFields.map((fld) => {
          let val = "Sample Answer";
          if (fld.type === "RATING") val = "5";
          else if (fld.type === "EMAIL") val = "demo.user@example.com";
          else if (fld.type === "YES_NO") val = "Yes";
          else if (fld.type === "SELECT" || fld.type === "RADIO")
            val = (fld.options && fld.options[0]) || "Option 1";
          else if (fld.type === "CHECKBOX")
            val = (fld.options && fld.options.slice(0, 2).join(", ")) || "Option 1";
          else if (fld.type === "NUMBER") val = "4";
          else if (fld.type === "DATE") val = "2026-11-15";
          else if (fld.type === "TIME") val = "10:00";
          else if (fld.type === "PHONE") val = "+91 98765 43210";
          else if (fld.type === "URL") val = "https://github.com/chaicode";
          else if (fld.type === "TEXTAREA")
            val = "Great experience with the platform! Extremely intuitive and fast.";
          else val = "Demo Respondent";

          return { formFieldId: fld.id, value: val };
        });

        await db.insert(formSubmissionTable).values({
          formId: formRecord.id,
          values: sampleValues,
          createdAt: new Date(),
        });
      }
    }
  }

  console.log("==========================================");
  console.log(`Successfully seeded ${TEMPLATES.length} modern templates (6 in each category)!`);
  console.log("==========================================");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
