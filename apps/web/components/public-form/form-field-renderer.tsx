"use client";

import { useState } from "react";
import type { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import { StarIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "~/components/ui/field";
import { cn } from "~/lib/utils";
import type { PublicFormField } from "./types";

export interface FormFieldRendererProps {
  field: PublicFormField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: UseFormWatch<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
}

export function FormFieldRenderer({
  field,
  register,
  setValue,
  watch,
  errors,
}: FormFieldRendererProps) {
  const rules = field.isRequired ? { required: `${field.label} is required` } : {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = (errors as Record<string, any>)[field.labelKey];
  const [hoverRating, setHoverRating] = useState(0);

  // 1. Yes / No Switch
  if (field.type === "YES_NO") {
    const value = watch(field.labelKey) as string;
    return (
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor={field.labelKey}>
          {field.label}
          {field.isRequired && <span className="text-destructive ml-0.5">*</span>}
        </FieldLabel>
        {field.description && <FieldDescription>{field.description}</FieldDescription>}
        <RadioGroup
          value={value}
          onValueChange={(val) => setValue(field.labelKey, val, { shouldValidate: true })}
          className="flex gap-6 mt-1"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id={`${field.labelKey}_yes`} />
            <Label htmlFor={`${field.labelKey}_yes`} className="cursor-pointer">
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id={`${field.labelKey}_no`} />
            <Label htmlFor={`${field.labelKey}_no`} className="cursor-pointer">
              No
            </Label>
          </div>
        </RadioGroup>
        {error && <FieldError>{error.message}</FieldError>}
      </Field>
    );
  }

  // 2. Long Text / Textarea
  if (field.type === "TEXTAREA") {
    return (
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor={field.labelKey}>
          {field.label}
          {field.isRequired && <span className="text-destructive ml-0.5">*</span>}
        </FieldLabel>
        {field.description && <FieldDescription>{field.description}</FieldDescription>}
        <Textarea
          id={field.labelKey}
          placeholder={field.placeholder ?? undefined}
          rows={4}
          aria-invalid={!!error}
          {...register(field.labelKey, rules)}
        />
        {error && <FieldError>{error.message}</FieldError>}
      </Field>
    );
  }

  // 3. Dropdown Select
  if (field.type === "SELECT") {
    const value = watch(field.labelKey) as string;
    return (
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor={field.labelKey}>
          {field.label}
          {field.isRequired && <span className="text-destructive ml-0.5">*</span>}
        </FieldLabel>
        {field.description && <FieldDescription>{field.description}</FieldDescription>}
        <Select
          value={value || ""}
          onValueChange={(val) => setValue(field.labelKey, val, { shouldValidate: true })}
        >
          <SelectTrigger id={field.labelKey} className="w-full">
            <SelectValue placeholder={field.placeholder || "Select an option..."} />
          </SelectTrigger>
          <SelectContent>
            {(field.options || []).map((opt, i) => (
              <SelectItem key={i} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <FieldError>{error.message}</FieldError>}
      </Field>
    );
  }

  // 4. Radio Group (Single Choice)
  if (field.type === "RADIO") {
    const value = watch(field.labelKey) as string;
    return (
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor={field.labelKey}>
          {field.label}
          {field.isRequired && <span className="text-destructive ml-0.5">*</span>}
        </FieldLabel>
        {field.description && <FieldDescription>{field.description}</FieldDescription>}
        <RadioGroup
          value={value}
          onValueChange={(val) => setValue(field.labelKey, val, { shouldValidate: true })}
          className="flex flex-col gap-2.5 mt-1"
        >
          {(field.options || []).map((opt, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <RadioGroupItem value={opt} id={`${field.labelKey}_${i}`} />
              <Label htmlFor={`${field.labelKey}_${i}`} className="cursor-pointer font-normal text-sm">
                {opt}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {error && <FieldError>{error.message}</FieldError>}
      </Field>
    );
  }

  // 5. Multi-Select Checkboxes
  if (field.type === "CHECKBOX") {
    const currentValues = (watch(field.labelKey) as string[] | undefined) ?? [];
    const handleToggle = (opt: string) => {
      const next = currentValues.includes(opt)
        ? currentValues.filter((v) => v !== opt)
        : [...currentValues, opt];
      setValue(field.labelKey, next, { shouldValidate: true });
    };

    return (
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor={field.labelKey}>
          {field.label}
          {field.isRequired && <span className="text-destructive ml-0.5">*</span>}
        </FieldLabel>
        {field.description && <FieldDescription>{field.description}</FieldDescription>}
        <div className="flex flex-col gap-2.5 mt-1">
          {(field.options || []).map((opt, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Checkbox
                id={`${field.labelKey}_${i}`}
                checked={currentValues.includes(opt)}
                onCheckedChange={() => handleToggle(opt)}
              />
              <Label
                htmlFor={`${field.labelKey}_${i}`}
                className="cursor-pointer font-normal text-sm"
              >
                {opt}
              </Label>
            </div>
          ))}
        </div>
        {error && <FieldError>{error.message}</FieldError>}
      </Field>
    );
  }

  // 6. Interactive Star Rating (1-5)
  if (field.type === "RATING") {
    const currentRating = Number(watch(field.labelKey) || 0);

    return (
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor={field.labelKey}>
          {field.label}
          {field.isRequired && <span className="text-destructive ml-0.5">*</span>}
        </FieldLabel>
        {field.description && <FieldDescription>{field.description}</FieldDescription>}
        <div className="flex items-center gap-1.5 mt-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoverRating || currentRating);
            return (
              <button
                key={star}
                type="button"
                className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setValue(field.labelKey, String(star), { shouldValidate: true })}
                title={`${star} star`}
              >
                <StarIcon
                  className={cn(
                    "size-8 transition-colors",
                    isFilled
                      ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                      : "text-muted-foreground/30 hover:text-amber-400/60"
                  )}
                />
              </button>
            );
          })}
          {currentRating > 0 && (
            <span className="text-sm font-semibold text-amber-500 ml-2">
              {currentRating} / 5
            </span>
          )}
        </div>
        {error && <FieldError>{error.message}</FieldError>}
      </Field>
    );
  }

  // 7. Inputs (Text, Number, Email, Phone, Website, Date, Time, Password)
  const inputTypeMap: Record<string, string> = {
    TEXT: "text",
    NUMBER: "number",
    EMAIL: "email",
    PHONE: "tel",
    URL: "url",
    DATE: "date",
    TIME: "time",
    PASSWORD: "password",
  };

  const inputType = inputTypeMap[field.type] || "text";

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={field.labelKey}>
        {field.label}
        {field.isRequired && <span className="text-destructive ml-0.5">*</span>}
      </FieldLabel>
      {field.description && <FieldDescription>{field.description}</FieldDescription>}
      <Input
        id={field.labelKey}
        type={inputType}
        placeholder={field.placeholder ?? undefined}
        aria-invalid={!!error}
        {...register(field.labelKey, rules)}
      />
      {error && <FieldError>{error.message}</FieldError>}
    </Field>
  );
}
