"use client";

import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { ClockIcon, UsersIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { FieldGroup } from "~/components/ui/field";
import { useGetForm } from "~/hooks/api/form";
import { useSubmitForm } from "~/hooks/api/form-submission";
import { trpc } from "~/trpc/client";
import { FormFieldRenderer } from "~/components/public-form/form-field-renderer";
import { FormClosedScreen } from "~/components/public-form/form-closed-screen";
import { FormSuccessScreen } from "~/components/public-form/form-success-screen";
import { FormUnlockCard } from "~/components/forms/form-unlock-card";
import type { PublicFormField } from "~/components/public-form/types";

export default function PublicFormPage({ params }: { params: Promise<{ form_id: string }> }) {
  const { form_id: formId } = use(params);
  const [enteredPassword, setEnteredPassword] = useState<string | undefined>(undefined);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { form, isLoading } = useGetForm(formId, enteredPassword);
  const { submitFormAsync } = useSubmitForm();
  const [submitted, setSubmitted] = useState(false);
  const utils = trpc.useUtils();

  const handleUnlock = async (pwd: string) => {
    setIsUnlocking(true);
    try {
      const res = await utils.form.getForm.fetch({ formId, password: pwd });
      if (res && res.isUnlocked) {
        setEnteredPassword(pwd);
        toast.success("Form unlocked!");
      } else {
        throw new Error("Invalid password");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid form password";
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setIsUnlocking(false);
    }
  };

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
      const values = (form.fields ?? [])
        .filter((field) => data[field.labelKey] !== undefined && data[field.labelKey] !== "")
        .map((field) => {
          const rawVal = data[field.labelKey];
          const stringVal = Array.isArray(rawVal) ? rawVal.join(", ") : String(rawVal);
          return {
            formFieldId: field.id,
            value: stringVal,
          };
        });

      await submitFormAsync({
        formId: form.id,
        values,
        password: enteredPassword,
      });
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

  const isFormClosed = !form.isOpen || !form.isPublished || form.isExpired || form.isLimitReached || form.isArchived;

  if (isFormClosed) {
    return (
      <FormClosedScreen
        isArchived={form.isArchived}
        isExpired={form.isExpired}
        closesAt={form.closesAt}
        isLimitReached={form.isLimitReached}
        responseLimit={form.responseLimit}
        isPublished={form.isPublished}
      />
    );
  }

  if (form.isPasswordProtected && !form.isUnlocked) {
    return (
      <FormUnlockCard
        title={form.title}
        description={form.description}
        onUnlock={handleUnlock}
        isUnlocking={isUnlocking}
      />
    );
  }

  if (submitted) {
    return <FormSuccessScreen />;
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
            {form.isPasswordProtected && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <LockIcon className="size-3" />
                Unlocked Access
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
                <FormFieldRenderer
                  key={field.id}
                  field={field as PublicFormField}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
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
