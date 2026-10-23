"use client";

import { useState } from "react";
import {
  TypeIcon,
  AlignLeftIcon,
  MailIcon,
  HashIcon,
  PhoneIcon,
  GlobeIcon,
  CalendarIcon,
  ClockIcon,
  ToggleLeftIcon,
  CheckSquareIcon,
  RadioIcon,
  ChevronDownSquareIcon,
  StarIcon,
  GripVerticalIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";
import { type FieldType } from "./field-types";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";

export interface ToolboxFieldDef {
  type: FieldType;
  label: string;
  defaultTitle: string;
  category: "text" | "choice" | "input" | "special";
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const TOOLBOX_FIELDS: ToolboxFieldDef[] = [
  {
    type: "TEXT",
    label: "Short Text",
    defaultTitle: "Short Text Question",
    category: "text",
    icon: TypeIcon,
    description: "Single-line response (e.g. Name, Job title)",
  },
  {
    type: "TEXTAREA",
    label: "Long Text",
    defaultTitle: "Paragraph Question",
    category: "text",
    icon: AlignLeftIcon,
    description: "Multi-line feedback, bio, or description",
  },
  {
    type: "EMAIL",
    label: "Email Address",
    defaultTitle: "What is your email address?",
    category: "input",
    icon: MailIcon,
    description: "Validated email input with syntax checks",
  },
  {
    type: "NUMBER",
    label: "Number",
    defaultTitle: "Enter a number",
    category: "input",
    icon: HashIcon,
    description: "Numeric inputs (e.g. Age, Quantity)",
  },
  {
    type: "PHONE",
    label: "Phone Number",
    defaultTitle: "Phone Number",
    category: "input",
    icon: PhoneIcon,
    description: "Contact phone number input",
  },
  {
    type: "URL",
    label: "Website / URL",
    defaultTitle: "Website or Portfolio Link",
    category: "input",
    icon: GlobeIcon,
    description: "Valid web link with https validation",
  },
  {
    type: "CHECKBOX",
    label: "Multiple Choice",
    defaultTitle: "Select all that apply",
    category: "choice",
    icon: CheckSquareIcon,
    description: "Multi-select checkboxes with custom options",
  },
  {
    type: "RADIO",
    label: "Single Choice",
    defaultTitle: "Choose one option",
    category: "choice",
    icon: RadioIcon,
    description: "Radio button list with single selection",
  },
  {
    type: "SELECT",
    label: "Dropdown",
    defaultTitle: "Select from dropdown",
    category: "choice",
    icon: ChevronDownSquareIcon,
    description: "Compact dropdown selector",
  },
  {
    type: "YES_NO",
    label: "Yes / No",
    defaultTitle: "Yes or No question?",
    category: "choice",
    icon: ToggleLeftIcon,
    description: "Binary yes/no toggle switch",
  },
  {
    type: "RATING",
    label: "Star Rating",
    defaultTitle: "How would you rate your experience?",
    category: "special",
    icon: StarIcon,
    description: "Interactive 1 to 5 star rating scale",
  },
  {
    type: "DATE",
    label: "Date Picker",
    defaultTitle: "Select a date",
    category: "special",
    icon: CalendarIcon,
    description: "Calendar date picker for bookings or deadlines",
  },
  {
    type: "TIME",
    label: "Time Picker",
    defaultTitle: "Select a time",
    category: "special",
    icon: ClockIcon,
    description: "Time selector input",
  },
];

interface FieldToolboxProps {
  onAddField: (type: FieldType, defaultTitle: string) => void;
}

export function FieldToolbox({ onAddField }: FieldToolboxProps) {
  const [search, setSearch] = useState("");

  const filteredFields = TOOLBOX_FIELDS.filter(
    (f) =>
      f.label.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full xl:w-72 shrink-0 flex flex-col rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-3.5 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <div className="flex items-center gap-1.5">
          <SparklesIcon className="size-3.5 text-amber-400" />
          <span className="text-xs font-semibold tracking-tight text-foreground uppercase">
            Field Toolbox
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-mono border-amber-500/20 text-muted-foreground"
        >
          Drag & Drop
        </Badge>
      </div>

      <p className="text-[11px] text-muted-foreground leading-snug">
        Drag any field into the form canvas, or click{" "}
        <PlusIcon className="inline size-3 text-amber-400" /> to add directly.
      </p>

      {/* Search Filter */}
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Filter field types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pl-8 text-xs rounded-xl bg-background/50 border-border/60 focus-visible:ring-amber-500/30"
        />
      </div>

      {/* Field Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-1.5 max-h-[380px] xl:max-h-[calc(100vh-320px)] overflow-y-auto pr-0.5 custom-scrollbar">
        {filteredFields.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "application/json",
                  JSON.stringify({ type: item.type, defaultTitle: item.defaultTitle }),
                );
                e.dataTransfer.effectAllowed = "copy";
              }}
              onClick={() => onAddField(item.type, item.defaultTitle)}
              className="group flex items-center justify-between p-2 rounded-xl border border-border/50 bg-background/50 hover:bg-card hover:border-amber-500/40 hover:shadow-xs transition-all cursor-grab active:cursor-grabbing select-none"
              title={`Drag into form or click to add ${item.label}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-7 rounded-lg bg-muted/60 group-hover:bg-amber-500/10 text-muted-foreground group-hover:text-amber-400 border border-transparent group-hover:border-amber-500/20 flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="size-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-foreground group-hover:text-amber-300 transition-colors truncate">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground/80 truncate">
                    {item.description}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                <GripVerticalIcon className="size-3.5 text-muted-foreground group-hover:text-amber-400" />
              </div>
            </div>
          );
        })}

        {filteredFields.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-6">
            No field types match &ldquo;{search}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
