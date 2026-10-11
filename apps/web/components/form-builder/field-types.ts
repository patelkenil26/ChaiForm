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
