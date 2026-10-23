"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { PlusIcon, SearchIcon, XIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { type FieldType } from "./field-types";
import { TOOLBOX_FIELDS, type ToolboxFieldDef } from "./field-toolbox";

interface MobileAddFieldDrawerProps {
  onAddField: (type: FieldType, defaultTitle: string) => void;
}

type CategoryFilter = "all" | "text" | "choice" | "input" | "special";

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All Types" },
  { id: "text", label: "Text" },
  { id: "choice", label: "Choices" },
  { id: "input", label: "Inputs" },
  { id: "special", label: "Special" },
];

export function MobileAddFieldDrawer({ onAddField }: MobileAddFieldDrawerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");

  const filteredFields = useMemo(() => {
    return TOOLBOX_FIELDS.filter((f) => {
      const matchesSearch =
        search.trim() === "" ||
        f.label.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === "all" || f.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleSelectField = (field: ToolboxFieldDef) => {
    onAddField(field.type, field.defaultTitle);
    toast.success(`Added ${field.label} question`);
    setOpen(false);
    setSearch("");
    setSelectedCategory("all");
  };

  return (
    <>
      {/* Floating Action Button (FAB) - Visible only on mobile/tablet viewports (< xl) */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 xl:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Add question to form"
          className="group flex items-center gap-2 h-11 px-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-neutral-950 font-semibold text-xs sm:text-sm shadow-xl shadow-amber-500/25 border border-white/20 hover:shadow-amber-500/40 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <div className="size-5 rounded-full bg-neutral-950/15 flex items-center justify-center shrink-0">
            <PlusIcon className="size-3.5 stroke-[2.5]" />
          </div>
          <span className="tracking-tight text-neutral-950 font-semibold whitespace-nowrap">
            Add Question
          </span>
        </button>
      </div>

      {/* Touch-Friendly Bottom Sheet Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85vh] bg-background/95 backdrop-blur-xl border-t border-border/80 flex flex-col focus:outline-hidden">
          {/* Header */}
          <DrawerHeader className="px-4 pt-3 pb-2 border-b border-border/40 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <SparklesIcon className="size-3.5" />
                </div>
                <div>
                  <DrawerTitle className="text-base font-semibold tracking-tight text-foreground">
                    Add Question
                  </DrawerTitle>
                  <DrawerDescription className="text-xs text-muted-foreground">
                    Tap any field type to append it to your form
                  </DrawerDescription>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                aria-label="Close"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            {/* Quick Search Input */}
            <div className="relative mt-3">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search question types (e.g. Email, Star, Dropdown)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 pr-8 text-xs rounded-xl bg-background/70 border-border/60 focus-visible:ring-amber-500/30"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-1">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer",
                      isActive
                        ? "bg-amber-400/15 text-amber-300 border border-amber-400/35 shadow-xs"
                        : "text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-transparent",
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </DrawerHeader>

          {/* Question Types Grid */}
          <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
            <div className="grid grid-cols-2 gap-2 pb-6">
              {filteredFields.map((field) => {
                const Icon = field.icon;
                return (
                  <button
                    key={field.type}
                    type="button"
                    onClick={() => handleSelectField(field)}
                    className="group flex flex-col items-start p-3 rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-amber-500/40 active:border-amber-500 active:scale-[0.98] transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="size-8 rounded-lg bg-muted/60 group-hover:bg-amber-500/10 text-muted-foreground group-hover:text-amber-400 border border-transparent group-hover:border-amber-500/20 flex items-center justify-center transition-colors">
                        <Icon className="size-4" />
                      </div>
                      <span className="size-5 rounded-full flex items-center justify-center text-muted-foreground/60 group-hover:text-amber-400 transition-colors">
                        <PlusIcon className="size-3.5" />
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-foreground group-hover:text-amber-300 transition-colors line-clamp-1">
                      {field.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                      {field.description}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredFields.length === 0 && (
              <div className="text-center py-10 space-y-2">
                <p className="text-sm text-muted-foreground">
                  No question types found for &ldquo;{search}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                  }}
                  className="text-xs text-amber-400 hover:underline font-medium cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
