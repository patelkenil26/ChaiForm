"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { DialogFooter } from "~/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  FIELD_TYPES,
  FIELD_TYPE_LABELS,
  type FieldFormValues,
} from "./field-types";

interface FieldFormProps {
  onSubmit: SubmitHandler<FieldFormValues>;
  isSubmitting: boolean;
  defaultValues: FieldFormValues;
  onCancel: () => void;
  submitLabel: string;
}

export function FieldForm({
  onSubmit,
  isSubmitting,
  defaultValues,
  onCancel,
  submitLabel,
}: FieldFormProps) {
  const { register, handleSubmit, control, watch, reset } = useForm<FieldFormValues>({
    defaultValues,
  });

  const [newOptionInput, setNewOptionInput] = useState("");

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const type = watch("type");
  const isChoiceType = type === "SELECT" || type === "RADIO" || type === "CHECKBOX";
  const hasPlaceholder =
    type !== "YES_NO" && type !== "RATING" && type !== "CHECKBOX" && type !== "RADIO";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="label">Label / Question</FieldLabel>
          <Input
            id="label"
            placeholder="e.g. What is your email address?"
            {...register("label", { required: true, maxLength: 100 })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="type">Field Type</FieldLabel>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {FIELD_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {FIELD_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        {isChoiceType && (
          <Field>
            <FieldLabel>Options / Choices</FieldLabel>
            <Controller
              name="options"
              control={control}
              render={({ field }) => {
                const currentOptions = field.value || [];

                const handleAdd = () => {
                  if (!newOptionInput.trim()) return;
                  field.onChange([...currentOptions, newOptionInput.trim()]);
                  setNewOptionInput("");
                };

                const handleRemove = (idxToRemove: number) => {
                  field.onChange(currentOptions.filter((_, i) => i !== idxToRemove));
                };

                return (
                  <div className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3">
                    <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                      {currentOptions.map((opt, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md border bg-card text-xs shadow-2xs"
                        >
                          <span className="truncate">{opt}</span>
                          <button
                            type="button"
                            onClick={() => handleRemove(i)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <XIcon className="size-3.5" />
                          </button>
                        </div>
                      ))}
                      {currentOptions.length === 0 && (
                        <p className="text-xs text-muted-foreground italic py-1">
                          No options added yet. Add at least one option below.
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        placeholder="Add an option..."
                        value={newOptionInput}
                        onChange={(e) => setNewOptionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd();
                          }
                        }}
                        className="h-8 text-xs"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAdd}
                        className="h-8 text-xs shrink-0"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                );
              }}
            />
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="description">Helper Text / Description</FieldLabel>
          <Textarea
            id="description"
            placeholder="Subtext shown below the question (optional)"
            rows={2}
            {...register("description")}
          />
        </Field>

        {hasPlaceholder && (
          <Field>
            <FieldLabel htmlFor="placeholder">Placeholder</FieldLabel>
            <Input
              id="placeholder"
              placeholder="e.g. Type your answer here..."
              {...register("placeholder")}
            />
          </Field>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Controller
            name="isRequired"
            control={control}
            render={({ field }) => (
              <Checkbox id="isRequired" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="isRequired" className="text-sm font-medium cursor-pointer">
            Required question
          </Label>
        </div>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
