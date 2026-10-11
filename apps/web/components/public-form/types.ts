export type FormFieldType =
  | "TEXT"
  | "TEXTAREA"
  | "NUMBER"
  | "EMAIL"
  | "PHONE"
  | "URL"
  | "DATE"
  | "TIME"
  | "YES_NO"
  | "PASSWORD"
  | "SELECT"
  | "RADIO"
  | "CHECKBOX"
  | "RATING";

export type PublicFormField = {
  id: string;
  label: string;
  labelKey: string;
  type: FormFieldType;
  description?: string | null;
  placeholder?: string | null;
  isRequired: boolean;
  options?: string[] | null;
  index: string;
};
