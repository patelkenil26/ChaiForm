export const FIELD_TYPES = [
  "TEXT",
  "TEXTAREA",
  "NUMBER",
  "EMAIL",
  "PHONE",
  "URL",
  "DATE",
  "TIME",
  "YES_NO",
  "PASSWORD",
  "SELECT",
  "RADIO",
  "CHECKBOX",
  "RATING",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  TEXT: "Short Text",
  TEXTAREA: "Long Text (Paragraph)",
  NUMBER: "Number",
  EMAIL: "Email Address",
  PHONE: "Phone Number",
  URL: "Website / URL",
  DATE: "Date Picker",
  TIME: "Time Picker",
  YES_NO: "Yes / No Toggle",
  PASSWORD: "Password",
  SELECT: "Dropdown (Single Select)",
  RADIO: "Single Choice (Radio)",
  CHECKBOX: "Multiple Choice (Checkbox)",
  RATING: "Rating (1-5 Stars)",
};

export type FieldFormValues = {
  label: string;
  type: FieldType;
  description: string;
  placeholder: string;
  isRequired: boolean;
  options: string[];
};

export type FieldRow = {
  id: string;
  label: string;
  labelKey: string;
  type: FieldType;
  description?: string | null;
  placeholder?: string | null;
  isRequired: boolean;
  options?: string[] | null;
  index: string;
};

export const DEFAULT_VALUES: FieldFormValues = {
  label: "",
  type: "TEXT",
  description: "",
  placeholder: "",
  isRequired: false,
  options: ["Option 1", "Option 2"],
};

export function toLabelKey(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function getFieldPlaceholder(type: FieldType): string {
  switch (type) {
    case "TEXT":
      return "e.g. What is your full name?";
    case "TEXTAREA":
      return "e.g. Tell us a bit about your project or feedback...";
    case "EMAIL":
      return "e.g. What is your work email address?";
    case "NUMBER":
      return "e.g. How many team members do you have?";
    case "PHONE":
      return "e.g. What is your phone or WhatsApp number?";
    case "URL":
      return "e.g. What is your portfolio or website link?";
    case "CHECKBOX":
      return "e.g. Select all topics that interest you";
    case "RADIO":
      return "e.g. Which pricing plan suits your needs?";
    case "SELECT":
      return "e.g. Select your country / region";
    case "YES_NO":
      return "e.g. Do you have any prior experience?";
    case "RATING":
      return "e.g. How would you rate our customer support?";
    case "DATE":
      return "e.g. Pick your preferred appointment date";
    case "TIME":
      return "e.g. What time works best for a call?";
    case "PASSWORD":
      return "e.g. Create a secure access key";
    default:
      return "Enter question title...";
  }
}
