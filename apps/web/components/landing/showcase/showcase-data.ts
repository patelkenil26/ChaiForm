export type ShowcaseTab = "runner" | "builder" | "analytics";

export interface MockSubmissionResponse {
  id: string;
  respondent: string;
  useCase: string;
  rating: number;
  timeToComplete: string;
}

export interface BuilderQuestionItem {
  id: number;
  title: string;
  description: string;
  isRequired: boolean;
  isActive?: boolean;
}

export interface BuilderFieldTypeOption {
  id: string;
  label: string;
  dotColorClass: string;
}

export const MOCK_SHOWCASE_RESPONSES: MockSubmissionResponse[] = [
  {
    id: "resp_1",
    respondent: "sarah.c@acme.ai",
    useCase: "Lead Qualification",
    rating: 5.0,
    timeToComplete: "14 seconds",
  },
  {
    id: "resp_2",
    respondent: "alex@growthlab.io",
    useCase: "Product Feedback",
    rating: 5.0,
    timeToComplete: "18 seconds",
  },
  {
    id: "resp_3",
    respondent: "david.m@stripe.com",
    useCase: "Event Registration",
    rating: 4.0,
    timeToComplete: "11 seconds",
  },
];

export const INITIAL_BUILDER_QUESTIONS: BuilderQuestionItem[] = [
  {
    id: 1,
    title: "How likely are you to recommend us?",
    description: "Rating Scale (1-5 Stars)",
    isRequired: true,
    isActive: true,
  },
  {
    id: 2,
    title: "What feature did you like most?",
    description: "Multiple Choice (3 Options)",
    isRequired: false,
  },
  {
    id: 3,
    title: "Leave your feedback or work email:",
    description: "Short Text Input",
    isRequired: false,
  },
];

export const BUILDER_FIELD_TYPES: BuilderFieldTypeOption[] = [
  { id: "rating", label: "Rating Stars", dotColorClass: "bg-lime-600 dark:bg-[#CCFF00]" },
  { id: "choice", label: "Multiple Choice", dotColorClass: "bg-blue-500" },
  { id: "text", label: "Short Text", dotColorClass: "bg-emerald-500" },
  { id: "file", label: "File Upload", dotColorClass: "bg-purple-500" },
  { id: "contact", label: "Phone & Date", dotColorClass: "bg-amber-500" },
  { id: "gate", label: "Password Gate", dotColorClass: "bg-rose-500" },
];
