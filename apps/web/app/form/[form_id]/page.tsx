"use client";

import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { StarIcon, ClockIcon, UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
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
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "~/components/ui/field";
import { useGetForm } from "~/hooks/api/form";
import { useSubmitForm } from "~/hooks/api/form-submission";
import { cn } from "~/lib/utils";

type FieldType =
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

type FormField = {
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

function FormFieldInput({
  field,
  register,
  setValue,
  watch,
  errors,
}: {
  field: FormField;
  register: ReturnType<typeof useForm>["register"];
  setValue: ReturnType<typeof useForm>["setValue"];
  watch: ReturnType<typeof useForm>["watch"];
  errors: Record<string, { message?: string }>;
}) {
  const rules = field.isRequired ? { required: `${field.label} is required` } : {};
  const error = errors[field.labelKey];
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
            <Label htmlFor={`${field.labelKey}_yes`} className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id={`${field.labelKey}_no`} />
            <Label htmlFor={`${field.labelKey}_no`} className="cursor-pointer">No</Label>
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
                className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

export default function PublicFormPage({ params }: { params: Promise<{ form_id: string }> }) {
  const { form_id: formId } = use(params);
  const { form, isLoading } = useGetForm(formId);
  const { submitFormAsync } = useSubmitForm();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!form) return;
    try {
      const values = form.fields
        .filter((field) => data[field.labelKey] !== undefined && data[field.labelKey] !== "")
        .map((field) => {
          const rawVal = data[field.labelKey];
          const stringVal = Array.isArray(rawVal) ? rawVal.join(", ") : String(rawVal);
          return {
            formFieldId: field.id,
            value: stringVal,
          };
        });
      await submitFormAsync({ formId: form.id, values });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit form";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading form...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Form not found</h1>
          <p className="text-sm text-muted-foreground">This form doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const isFormClosed = !form.isOpen || !form.isPublished || form.isExpired || form.isLimitReached;

  if (isFormClosed) {
    let closedTitle = "Form is Closed";
    let closedMessage = "This form is currently not accepting responses.";

    if (form.isExpired && form.closesAt) {
      closedTitle = "Form has Expired";
      closedMessage = `This form closed on ${new Date(form.closesAt).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })} and is no longer accepting responses.`;
    } else if (form.isLimitReached && form.responseLimit) {
      closedTitle = "Response Limit Reached";
      closedMessage = `This form has reached its maximum response capacity (${form.responseLimit} responses) and is no longer accepting new submissions.`;
    } else if (!form.isPublished) {
      closedTitle = "Submissions Paused";
      closedMessage = "The creator has paused submissions for this form. Please check back later.";
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-3 max-w-md rounded-2xl border p-8 bg-card shadow-sm">
          <div className="mx-auto size-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ClockIcon className="size-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{closedTitle}</h1>
          <p className="text-sm text-muted-foreground">{closedMessage}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Thanks for submitting!</h1>
          <p className="text-sm text-muted-foreground">Your response has been recorded.</p>
        </div>
      </div>
    );
  }

  const sortedFields = [...(form.fields ?? [])].sort(
    (a, b) => parseFloat(a.index) - parseFloat(b.index)
  );

  return (
    <div className="min-h-screen bg-background flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {form.closesAt && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border">
                <ClockIcon className="size-3 text-amber-500" />
                Closes {new Date(form.closesAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
              </span>
            )}
            {form.responseLimit && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border">
                <UsersIcon className="size-3 text-blue-500" />
                {form.submissionCount} / {form.responseLimit} responses
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
          {form.description && (
            <p className="mt-2 text-sm text-muted-foreground">{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit as Parameters<typeof handleSubmit>[0])}>
          <FieldGroup>
            {sortedFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">This form has no fields yet.</p>
            ) : (
              sortedFields.map((field) => (
                <FormFieldInput
                  key={field.id}
                  field={field as FormField}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  errors={errors as Record<string, { message?: string }>}
                />
              ))
            )}
          </FieldGroup>

          {sortedFields.length > 0 && (
            <Button type="submit" className="mt-8 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
