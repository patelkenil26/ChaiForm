import db, { eq, asc } from "./index";
import { formsTable } from "./models/form";
import { formFieldsTable } from "./models/form-field";
import { formSubmissionTable } from "./models/form-submission";

function toLabelKey(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

async function seed() {
  console.log("Starting form fields seeding...");

  // Fetch all existing forms
  const forms = await db.select().from(formsTable).orderBy(asc(formsTable.createdAt));
  console.log(`Found ${forms.length} forms in database.`);

  const formConfigs: Record<
    string,
    Array<{
      label: string;
      type: string;
      description?: string;
      placeholder?: string;
      isRequired: boolean;
      options?: string[];
    }>
  > = {
    "Customer Satisfaction Survey": [
      {
        label: "How would you rate your overall experience with our service?",
        type: "RATING",
        description: "Rate us from 1 to 5 stars",
        isRequired: true,
      },
      {
        label: "Which product or service did you use?",
        type: "SELECT",
        description: "Choose the service you interacted with most recently",
        options: ["Web Platform", "Mobile App", "API Service", "Customer Support"],
        isRequired: true,
      },
      {
        label: "Would you recommend ChaiCode to a colleague or friend?",
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
        label: "Can our team contact you regarding your feedback?",
        type: "YES_NO",
        isRequired: false,
      },
      {
        label: "Your Email Address (optional)",
        type: "EMAIL",
        placeholder: "name@example.com",
        isRequired: false,
      },
    ],
    "Job Application Form": [
      {
        label: "Full Legal Name",
        type: "TEXT",
        placeholder: "e.g. John Doe",
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
          "Full Stack Engineer",
          "DevOps & Cloud Engineer",
          "Product Designer (UI/UX)",
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
        label: "Why are you interested in joining ChaiCode?",
        type: "TEXTAREA",
        placeholder: "Highlight your key technical achievements and passion...",
        isRequired: true,
      },
    ],
    "Event Registration Form": [
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
    "Product Feedback Form": [
      {
        label: "How often do you use the AI Coding Assistant?",
        type: "RADIO",
        options: ["Daily", "A few times a week", "Once a week", "Rarely"],
        isRequired: true,
      },
      {
        label: "How would you rate the accuracy of code generation?",
        type: "RATING",
        description: "1 = Needs Improvement, 5 = Exceptional",
        isRequired: true,
      },
      {
        label: "Which features do you find most valuable?",
        type: "CHECKBOX",
        options: [
          "One-click refactoring",
          "Auto bug-fixing",
          "Context-aware autocompletion",
          "Monorepo multi-file reasoning",
        ],
        isRequired: true,
      },
      {
        label: "What is your biggest frustration or missing feature?",
        type: "TEXTAREA",
        placeholder: "Tell us what could make this 10x better...",
        isRequired: true,
      },
      {
        label: "Would you be open to a 15-minute product interview?",
        type: "YES_NO",
        isRequired: true,
      },
    ],
    "Contact Us Form": [
      {
        label: "Your Full Name",
        type: "TEXT",
        placeholder: "Alex Smith",
        isRequired: true,
      },
      {
        label: "Email Address",
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
    "Course Enrollment Form": [
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
  };

  for (const form of forms) {
    const config = formConfigs[form.title];
    if (!config) continue;

    // Check if fields already exist
    const existing = await db
      .select({ id: formFieldsTable.id })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, form.id));

    if (existing.length > 0) {
      console.log(`Form "${form.title}" already has ${existing.length} fields. Skipping.`);
      continue;
    }

    console.log(`Adding ${config.length} fields to form "${form.title}"...`);

    let index = 1;
    for (const f of config) {
      const labelKey = toLabelKey(f.label);
      await db.insert(formFieldsTable).values({
        formId: form.id,
        label: f.label,
        labelKey,
        type: f.type,
        description: f.description ?? null,
        placeholder: f.placeholder ?? null,
        isRequired: f.isRequired,
        options: f.options ?? null,
        index: (index++).toFixed(2),
      });
    }

    console.log(`✓ Added fields to "${form.title}".`);
  }

  // Also add sample submissions to a couple of forms so the submissions viewer looks rich!
  for (const form of forms) {
    const fields = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, form.id));

    const existingSubs = await db
      .select({ id: formSubmissionTable.id })
      .from(formSubmissionTable)
      .where(eq(formSubmissionTable.formId, form.id));

    if (existingSubs.length === 0 && fields.length > 0) {
      console.log(`Adding 3 sample submissions to "${form.title}"...`);

      const sampleAnswers = [
        {
          name: "Alice Sharma",
          email: "alice.sharma@gmail.com",
          rating: "5",
          choice: "Web Platform",
          yesNo: "Yes",
          text: "The platform is incredibly fast and responsive! Loved the tRPC integration.",
        },
        {
          name: "Rohan Verma",
          email: "rohan.v@techcorp.io",
          rating: "4",
          choice: "Mobile App",
          yesNo: "Yes",
          text: "Very polished design. Would love to see dark mode theme customization.",
        },
        {
          name: "Priya Nair",
          email: "priya.nair@startup.co",
          rating: "5",
          choice: "Customer Support",
          yesNo: "No",
          text: "Great experience overall. Highly recommended for modern engineering teams.",
        },
      ];

      for (const sample of sampleAnswers) {
        const values = fields.map((fld) => {
          let val = "Sample Answer";
          if (fld.type === "RATING") val = sample.rating;
          else if (fld.type === "EMAIL") val = sample.email;
          else if (fld.type === "YES_NO") val = sample.yesNo;
          else if (fld.type === "SELECT" || fld.type === "RADIO")
            val = (fld.options && fld.options[0]) || sample.choice;
          else if (fld.type === "CHECKBOX")
            val = (fld.options && fld.options.slice(0, 2).join(", ")) || "Option 1, Option 2";
          else if (fld.type === "NUMBER") val = "3";
          else if (fld.type === "DATE") val = "2026-11-01";
          else if (fld.type === "TIME") val = "14:30";
          else if (fld.type === "PHONE") val = "+91 98765 43210";
          else if (fld.type === "URL") val = "https://github.com/example";
          else if (fld.type === "TEXTAREA") val = sample.text;
          else val = sample.name;

          return { formFieldId: fld.id, value: val };
        });

        await db.insert(formSubmissionTable).values({
          formId: form.id,
          values,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 5) * 86400000),
        });
      }
      console.log(`✓ Added sample submissions to "${form.title}".`);
    }
  }

  console.log("All forms seeded successfully with realistic fields and submissions!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
