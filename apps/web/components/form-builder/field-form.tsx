"use client";

import { useEffect } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { Loader2 } from "lucide-react";
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
import { FIELD_TYPES, FIELD_TYPE_LABELS, type FieldFormValues } from "./field-types";
import { CharacterCounter } from "~/components/ui/character-counter";
import { FieldOptionsEditor } from "./field-options-editor";
import { landingTheme } from "~/config/landing-theme";

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

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const type = watch("type");
  const labelValue = watch("label") || "";
  const descValue = watch("description") || "";
  const isChoiceType = type === "SELECT" || type === "RADIO" || type === "CHECKBOX";
  const hasPlaceholder =
    type !== "YES_NO" && type !== "RATING" && type !== "CHECKBOX" && type !== "RADIO";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="label">Label / Question</FieldLabel>
            <CharacterCounter current={labelValue.length} max={100} />
          </div>
          <Input
            id="label"
            placeholder="e.g. What is your email address?"
            maxLength={100}
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
              render={({ field }) => (
                <div className="rounded-lg border bg-muted/20 p-3">
                  <FieldOptionsEditor
                    options={field.value || []}
                    onChange={field.onChange}
                    placeholder="Add an option..."
                  />
                </div>
              )}
            />
          </Field>
        )}

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="description">Helper Text / Description</FieldLabel>
            <CharacterCounter current={descValue.length} max={300} />
          </div>
          <Textarea
            id="description"
            placeholder="Subtext shown below the question (optional)"
            rows={2}
            maxLength={300}
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
        <Button
          type="button"
          variant="outline"
          className={landingTheme.buttonOutlineHover}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`gap-2 ${landingTheme.primaryButton}`}
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
