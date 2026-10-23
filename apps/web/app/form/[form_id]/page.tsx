"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ClockIcon, UsersIcon, LockIcon, Loader2Icon, CornerDownLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { FieldGroup } from "~/components/ui/field";
import { useGetForm, useRecordFormView } from "~/hooks/api/form";
import { useSubmitForm } from "~/hooks/api/form-submission";
import { trpc } from "~/trpc/client";
import { FormFieldRenderer } from "~/components/public-form/form-field-renderer";
import { FormClosedScreen } from "~/components/public-form/form-closed-screen";
import { FormSuccessScreen } from "~/components/public-form/form-success-screen";
import { FormUnlockCard } from "~/components/forms/form-unlock-card";
import { getSafeErrorMessage } from "~/lib/error";
import { landingTheme } from "~/config/landing-theme";
import type { PublicFormField } from "~/components/public-form/types";

export default function PublicFormPage({ params }: { params: Promise<{ form_id: string }> }) {
  const { form_id: formId } = use(params);
  const [enteredPassword, setEnteredPassword] = useState<string | undefined>(undefined);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { form, isLoading } = useGetForm(formId, enteredPassword);
  const { recordView } = useRecordFormView();
  const [viewRecorded, setViewRecorded] = useState(false);
  const { submitFormAsync } = useSubmitForm();
  const [submitted, setSubmitted] = useState(false);
  const utils = trpc.useUtils();

  useEffect(() => {
    if (form?.id && !viewRecorded) {
      recordView({ formId: form.id });
      setViewRecorded(true);
    }
  }, [form?.id, viewRecorded, recordView]);

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
      const msg = getSafeErrorMessage(err, "Invalid form password");
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
    reset,
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
      toast.error(getSafeErrorMessage(err, "Failed to submit form"));
    }
  };

  // Hotkey support: Ctrl+Enter or Cmd+Enter to submit form from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit(onSubmit as Parameters<typeof handleSubmit>[0])();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, onSubmit]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-start justify-center py-16 px-4 animate-in fade-in duration-300">
        <div className="w-full max-w-lg space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-32 rounded-full" />
            </div>
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>

          {/* Field Skeletons */}
          <div className="space-y-5 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2.5 p-4 rounded-xl border bg-card/60">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>

          {/* Submit Button Skeleton */}
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-background">
        <div className="flex max-w-sm flex-col items-center gap-4">
          <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground border">
            <LockIcon className="size-5" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold tracking-tight">Form Not Available</h1>
            <p className="text-sm text-muted-foreground">
              This form doesn&apos;t exist, may be private, or has been deleted by its author.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Button asChild size="sm" variant="outline" className={landingTheme.buttonOutlineHover}>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild size="sm" className={landingTheme.primaryButton}>
              <Link href="/explore">Templates</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isFormClosed =
    !form.isOpen || !form.isPublished || form.isExpired || form.isLimitReached || form.isArchived;

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
    return (
      <FormSuccessScreen
        formTitle={form.title}
        onReset={() => {
          reset();
          setSubmitted(false);
        }}
      />
    );
  }

  const sortedFields = [...(form.fields ?? [])].sort(
    (a, b) => parseFloat(a.index) - parseFloat(b.index),
  );

  return (
    <div className="min-h-screen bg-background flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {form.closesAt && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border">
                <ClockIcon className="size-3 text-amber-500" />
                Closes{" "}
                {new Date(form.closesAt).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            )}
            {form.responseLimit && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border">
                <UsersIcon className="size-3 text-blue-500" />
                {form.submissionCount} / {form.responseLimit} responses
              </span>
            )}
            {form.isPasswordProtected && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
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
            <div className="mt-8 flex flex-col items-center gap-2">
              <Button
                type="submit"
                className={`w-full h-11 text-sm font-semibold transition-all shadow-md shadow-amber-500/10 gap-2 ${landingTheme.primaryButton}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin text-neutral-950" />
                    <span>Submitting response...</span>
                  </>
                ) : (
                  <span>Submit Response</span>
                )}
              </Button>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground select-none">
                <span>Tip: Press</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border bg-muted shadow-2xs">
                  Ctrl
                </kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border bg-muted shadow-2xs inline-flex items-center gap-0.5">
                  Enter <CornerDownLeft className="size-2.5" />
                </kbd>
                <span>to submit from anywhere</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
